import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  checkPassword,
  clearFailures,
  clientKey,
  createSessionToken,
  isAdminConfigured,
  isSameOrigin,
  isThrottled,
  noteFailure,
  sessionCookie,
} from "@/lib/admin";
import { CLIENT_COOKIE, createClientToken } from "@/lib/client-auth";
import { isStorageConfigured } from "@/lib/mongodb";
import { getProjectByCode } from "@/lib/projects";

/**
 * One door for both kinds of visitor: Sawyer with the admin secret, or a
 * client with the code they were given when they sent the enquiry.
 */
export const dynamic = "force-dynamic";

/** Brute-force delay, same as the admin login. */
const DELAY_MS = 350;

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const key = clientKey(request);
  if (isThrottled(key)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

  // The admin secret opens the dashboard as well as /admin.
  if (isAdminConfigured() && checkPassword(code)) {
    clearFailures(key);
    const { token, expires } = createSessionToken();
    const response = NextResponse.json({ ok: true, role: "admin" });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookie(expires));
    return response;
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Client dashboards are not connected yet. Ask me for an update." },
      { status: 503 },
    );
  }

  let project = null;
  try {
    project = await getProjectByCode(code);
  } catch {
    return NextResponse.json(
      { ok: false, error: "I couldn't reach storage. Try again in a moment." },
      { status: 503 },
    );
  }

  if (!project) {
    noteFailure(key);
    return NextResponse.json(
      { ok: false, error: "That code doesn't match an open project." },
      { status: 401 },
    );
  }

  clearFailures(key);
  const { token, expires } = createClientToken(project.id);
  const response = NextResponse.json({ ok: true, role: "client", name: project.name });
  response.cookies.set(CLIENT_COOKIE, token, sessionCookie(expires));
  return response;
}
