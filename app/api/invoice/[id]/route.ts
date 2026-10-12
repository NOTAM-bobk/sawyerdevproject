import { NextResponse } from "next/server";
import { getInvoiceByTokenOrId } from "@/lib/invoices";
import { getPayPalPublicConfig } from "@/lib/paypal";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store" } as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing invoice ID." }, { status: 400 });
  }

  try {
    const invoice = await getInvoiceByTokenOrId(id);
    if (!invoice) {
      return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });
    }

    const paypal = getPayPalPublicConfig();

    return NextResponse.json(
      {
        ok: true,
        invoice,
        paypal,
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to load invoice." },
      { status: 500 },
    );
  }
}
