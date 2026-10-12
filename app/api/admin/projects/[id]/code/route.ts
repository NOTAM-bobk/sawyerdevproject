import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { isStorageConfigured } from "@/lib/mongodb";
import { rotateAccessCode } from "@/lib/projects";

export const dynamic = "force-dynamic";

/**
 * Issues a fresh access code. Codes are stored hashed, so this is the only way
 * to produce one for a client who has lost theirs — and it retires the old one.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage is not connected." }, { status: 503 });
  }

  const { id } = await params;

  try {
    const rotated = await rotateAccessCode(id);
    if (!rotated) {
      return NextResponse.json({ ok: false, error: "No such project." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, code: rotated.code });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Could not issue a code." },
      { status: 502 },
    );
  }
}
