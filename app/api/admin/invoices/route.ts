import { NextResponse } from "next/server";
import { isSameOrigin, isSignedIn } from "@/lib/admin";
import { createInvoice, listInvoices } from "@/lib/invoices";
import { isStorageConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ ok: true, invoices: [] }, { headers: NO_STORE });
  }

  try {
    const invoices = await listInvoices(100);
    return NextResponse.json({ ok: true, invoices }, { headers: NO_STORE });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to fetch invoices." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Cross-origin request blocked." }, { status: 403 });
  }

  try {
    const payload = await request.json();
    const { clientName, clientEmail, clientCompany, projectId, projectTitle, dueDate, items, notes } = payload;

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { ok: false, error: "Client name and email are required." },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "At least one line item is required." },
        { status: 400 },
      );
    }

    const invoice = await createInvoice({
      clientName,
      clientEmail,
      clientCompany,
      projectId,
      projectTitle,
      dueDate,
      items,
      notes,
    });

    return NextResponse.json({ ok: true, invoice }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create invoice." },
      { status: 500 },
    );
  }
}
