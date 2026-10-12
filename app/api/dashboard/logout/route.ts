import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isSameOrigin, sessionCookie } from "@/lib/admin";
import { CLIENT_COOKIE } from "@/lib/client-auth";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  // Both cookies go: the dashboard is one door, so leaving it ends the session
  // whether it was opened as a client or as the admin.
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_COOKIE, "", sessionCookie(0));
  response.cookies.set(ADMIN_COOKIE, "", sessionCookie(0));
  return response;
}
