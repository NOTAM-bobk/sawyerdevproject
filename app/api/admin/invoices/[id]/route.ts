import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { deleteInvoice } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing invoice ID." }, { status: 400 });
  }

  try {
    const success = await deleteInvoice(id);
    if (!success) {
      return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to delete invoice." },
      { status: 500 },
    );
  }
}
