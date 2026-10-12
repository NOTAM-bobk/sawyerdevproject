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

/** Reads the env and sets a cookie, so it can never be cached or prerendered. */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Admin is not set up yet: ADMIN_PASSWORD is missing." },
      { status: 503 },
    );
  }
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

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  // A small fixed delay: cheap for one person, expensive for a script.
  await new Promise((resolve) => setTimeout(resolve, 350));

  if (!checkPassword(password)) {
    noteFailure(key);
    return NextResponse.json({ ok: false, error: "Wrong password." }, { status: 401 });
  }

  clearFailures(key);
  const { token, expires } = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, sessionCookie(expires));
  return response;
}
