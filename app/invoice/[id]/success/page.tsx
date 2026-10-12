import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Check,
  FileCheck,
  LayoutDashboard,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getInvoiceByTokenOrId } from "@/lib/invoices";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment Received | Sawyer Schulz",
  robots: {
    index: false,
    follow: false,
  },
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default async function InvoiceSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceByTokenOrId(id);

  if (!invoice) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-canvas px-4 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-xl">
        {/* Success Card */}
        <div className="surface rounded-3xl border border-line bg-paper p-8 sm:p-12 shadow-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 mb-6 shadow-xs">
            <Check className="h-8 w-8 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 font-mono text-xs font-semibold text-emerald-800 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Payment Received</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Thank you, {invoice.clientName.split(" ")[0]}!
          </h1>
          <p className="mt-2 text-sm text-muted leading-relaxed text-pretty">
            Your payment of{" "}
            <span className="font-semibold text-ink font-mono">
              {formatCurrency(invoice.total)}
            </span>{" "}
            for invoice <span className="font-mono text-ink font-medium">{invoice.number}</span> has been confirmed.
          </p>

          {/* Receipt Breakdown Box */}
          <div className="mt-8 rounded-2xl border border-line bg-mist/60 p-6 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-line/60 pb-2.5">
              <span className="text-muted font-mono uppercase tracking-wider text-[11px]">
                Invoice Number
              </span>
              <span className="font-mono font-semibold text-ink">{invoice.number}</span>
            </div>

            <div className="flex justify-between border-b border-line/60 pb-2.5">
              <span className="text-muted font-mono uppercase tracking-wider text-[11px]">
                Amount Paid
              </span>
              <span className="font-mono font-bold text-ink text-sm">
                {formatCurrency(invoice.total)}
              </span>
            </div>

            <div className="flex justify-between border-b border-line/60 pb-2.5">
              <span className="text-muted font-mono uppercase tracking-wider text-[11px]">
                Date & Time
              </span>
              <span className="font-medium text-ink">
                {formatDate(invoice.paidAt || invoice.createdAt)}
              </span>
            </div>

            {invoice.paypalCaptureId ? (
              <div className="flex justify-between border-b border-line/60 pb-2.5">
                <span className="text-muted font-mono uppercase tracking-wider text-[11px]">
                  PayPal Transaction
                </span>
                <span className="font-mono text-muted text-[11px]">
                  {invoice.paypalCaptureId}
                </span>
              </div>
            ) : null}

            <div className="flex justify-between pt-0.5">
              <span className="text-muted font-mono uppercase tracking-wider text-[11px]">
                Payment Status
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                Completed
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/invoice/${encodeURIComponent(invoice.token || invoice.id)}`}
              className="btn3d btn3d-dark w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-medium text-paper"
            >
              <FileCheck className="h-4 w-4" />
              View & Print Invoice
            </Link>

            <Link
              href="/dashboard"
              className="btn3d btn3d-light w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3 text-xs font-medium text-ink"
            >
              <LayoutDashboard className="h-4 w-4" />
              Go to Client Dashboard
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-line flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>A copy of this payment receipt was recorded for your records.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
