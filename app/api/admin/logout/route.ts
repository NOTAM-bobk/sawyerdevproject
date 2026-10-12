import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isSameOrigin, sessionCookie } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  // Expire it immediately rather than only clearing the value.
  response.cookies.set(ADMIN_COOKIE, "", sessionCookie(0));
  return response;
}
