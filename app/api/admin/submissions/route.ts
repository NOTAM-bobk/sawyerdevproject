import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { deleteSubmission, isStorageConfigured } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }
  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: false, error: "Storage is not connected." }, { status: 503 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id." }, { status: 400 });
  }

  const deleted = await deleteSubmission(id);
  return NextResponse.json({ ok: deleted }, { status: deleted ? 200 : 404 });
}
