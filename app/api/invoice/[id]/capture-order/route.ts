import { NextResponse } from "next/server";
import { getInvoiceByTokenOrId, markInvoiceAsPaid } from "@/lib/invoices";
import { capturePayPalCheckoutOrder, isPayPalConfigured } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing invoice ID." }, { status: 400 });
  }

  const invoice = await getInvoiceByTokenOrId(id);
  if (!invoice) {
    return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });
  }

  if (invoice.status === "paid") {
    return NextResponse.json({ ok: true, invoice });
  }

  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, error: "PayPal is not configured." },
      { status: 503 },
    );
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as { orderId?: string };
    const orderId = payload.orderId;

    if (!orderId) {
      return NextResponse.json({ ok: false, error: "Missing PayPal order ID." }, { status: 400 });
    }

    const captureResult = await capturePayPalCheckoutOrder(orderId);

    const updated = await markInvoiceAsPaid({
      id: invoice.id,
      paypalOrderId: orderId,
      paypalCaptureId: captureResult.captureId,
      paypalPayerEmail: captureResult.payerEmail,
      paypalPayerName: captureResult.payerName,
    });

    return NextResponse.json({
      ok: true,
      capture: captureResult,
      invoice: updated ?? { ...invoice, status: "paid", paidAt: new Date().toISOString() },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Payment capture failed." },
      { status: 500 },
    );
  }
}
