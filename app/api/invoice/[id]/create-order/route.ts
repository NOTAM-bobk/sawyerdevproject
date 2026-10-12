import { NextResponse } from "next/server";
import { getInvoiceByTokenOrId } from "@/lib/invoices";
import { createPayPalCheckoutOrder, isPayPalConfigured } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(
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

    if (invoice.status === "paid") {
      return NextResponse.json({ ok: false, error: "This invoice is already paid." }, { status: 400 });
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "PayPal is not yet configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel environment variables.",
        },
        { status: 503 },
      );
    }

    const orderId = await createPayPalCheckoutOrder({
      invoiceId: invoice.id,
      invoiceNumber: invoice.number,
      description: `Invoice ${invoice.number} - ${invoice.clientName}`,
      total: invoice.total,
      items: invoice.items,
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to create PayPal order." },
      { status: 500 },
    );
  }
}
