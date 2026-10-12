import { cookies } from "next/headers";
import { signPayload, verifyPayload } from "@/lib/admin";

/**
 * Client dashboard sessions.
 *
 * A browser is signed in to one project at a time. The cookie is signed with
 * the same secret the admin session uses, so there is still only one variable
 * to set — but a client never sees that secret, and their access code is
 * checked separately against its hash.
 *
 * The signature is deliberately independent of the access code, so rotating a
 * client's code does not hand out a valid signature to anyone who still has the
 * old one.
 */
export const CLIENT_COOKIE = "swr_client";

/** Long-lived on purpose: a client may only check their page every few weeks. */
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export function createClientToken(projectId: string, now = Date.now()) {
  const expires = now + SESSION_MS;
  const payload = `client:${projectId}:${expires}`;
  return { token: `${projectId}.${expires}.${signPayload(payload)}`, expires };
}

/** Returns the signed-in project id, or null. */
export function verifyClientToken(token: string | undefined, now = Date.now()): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [projectId, rawExpiry, signature] = parts;
  if (!projectId || !rawExpiry || !signature) return null;

  const expires = Number(rawExpiry);
  if (!Number.isFinite(expires) || expires <= now) return null;

  if (!verifyPayload(`client:${projectId}:${expires}`, signature)) return null;
  return projectId;
}

export async function clientProjectId(): Promise<string | null> {
  const store = await cookies();
  return verifyClientToken(store.get(CLIENT_COOKIE)?.value);
}
