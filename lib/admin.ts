import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin authentication.
 *
 * One secret does both jobs: ADMIN_PASSWORD is the password you type, and it
 * also keys the session cookie's signature — so there is no second secret to
 * set, and changing the password immediately invalidates old sessions.
 */
export const ADMIN_COOKIE = "swr_admin";

/** How long a signed-in session lasts. */
const SESSION_MS = 8 * 60 * 60 * 1000;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Compares two strings without leaking their length difference through timing. */
function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

/** Signs any payload with the admin secret. Shared with the client sessions. */
export function signPayload(payload: string) {
  return sign(payload);
}

/** Timing-safe check of a payload against its signature. */
export function verifyPayload(payload: string, signature: string) {
  if (!secret()) return false;
  return safeEqual(signature, sign(payload));
}

export function createSessionToken(now = Date.now()) {
  const expires = now + SESSION_MS;
  return { token: `${expires}.${sign(`admin:${expires}`)}`, expires };
}

export function verifySessionToken(token: string | undefined, now = Date.now()) {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [rawExpiry, signature] = parts;
  const expires = Number(rawExpiry);
  if (!Number.isFinite(expires) || expires <= now) return false;
  return safeEqual(signature ?? "", sign(`admin:${expires}`));
}

export async function isSignedIn() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export function sessionCookie(expires: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  };
}

/* ------------------------------------------------------------ throttling ---- */

/**
 * Best-effort brute-force brake: a handful of wrong passwords per IP per
 * window. Serverless instances each keep their own count, so treat this as a
 * speed bump rather than a wall — the password itself is the real control.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function isThrottled(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function noteFailure(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearFailures(key: string) {
  attempts.delete(key);
}

/** Coarse client key for throttling — the platform's edge IP, never stored. */
export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return ip;
}

/**
 * Blocks cross-site posts to the admin endpoints. SameSite=Lax already stops
 * cross-site cookies; this is a second lock on the same door.
 */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin form posts and non-browser clients
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
