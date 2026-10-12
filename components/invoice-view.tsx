"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  FileCheck2,
  FileText,
  Loader2,
  Lock,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { Invoice } from "@/lib/invoice-types";

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
    });
  } catch {
    return dateStr;
  }
}

export function InvoiceView({
  initialInvoice,
  paypalConfig,
}: {
  initialInvoice: Invoice;
  paypalConfig: {
    clientId: string;
    configured: boolean;
    currency: string;
    environment: "sandbox" | "production";
  };
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isPaid = invoice.status === "paid";
  const token = invoice.token || invoice.id;

  async function handleCreateOrder(): Promise<string> {
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/invoice/${encodeURIComponent(token)}/create-order`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok || !data?.orderId) {
        throw new Error(data?.error || "Could not start PayPal payment.");
      }

      return data.orderId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initiate payment";
      setErrorMessage(msg);
      throw err;
    }
  }

  async function handleApprove(data: { orderID: string; [key: string]: any }) {
    const orderId = data.orderID || data.orderId;
    setProcessing(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/invoice/${encodeURIComponent(token)}/capture-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const result = await res.json().catch(() => null);

      if (res.ok && result?.ok) {
        setInvoice((prev) => ({
          ...prev,
          status: "paid",
          paidAt: new Date().toISOString(),
          paypalOrderId: orderId,
          paypalCaptureId: result.capture?.captureId,
          paypalPayerEmail: result.capture?.payerEmail,
        }));
        router.push(`/invoice/${encodeURIComponent(token)}/success`);
      } else {
        setErrorMessage(result?.error || "Payment verification failed. Please check your account.");
      }
    } catch {
      setErrorMessage("Network error verifying your payment with PayPal.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 md:py-16">
      {/* Top Banner / Breadcrumb */}
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mist border border-line text-ink">
            <FileText className="h-4 w-4" />
          </span>
          <span className="font-mono text-xs tracking-wider uppercase text-muted">
            Private Client Invoice
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn3d btn3d-light inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-line-strong"
          >
            <Printer className="h-3.5 w-3.5" />
            Print or PDF
          </button>
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="surface print:border-none print:shadow-none relative rounded-3xl border border-line bg-paper p-6 sm:p-10 md:p-12 shadow-xl">
        {/* Status Stamp if Paid */}
        {isPaid ? (
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs">
            <Check className="h-4 w-4 stroke-[2.5]" />
            <span>PAID IN FULL</span>
          </div>
        ) : (
          <div className="absolute top-6 right-6 sm:top-10 sm:right-10 flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-medium text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Awaiting Payment</span>
          </div>
        )}

        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-line pb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Sawyer Schulz
            </h1>
            <p className="mt-1 text-xs font-mono uppercase tracking-widest text-muted">
              Web Design & Full-Stack Development
            </p>
            <div className="mt-4 space-y-1 text-xs text-muted leading-relaxed">
              <p>Minneapolis, MN</p>
              <p>Email: sawyerbobk563@gmail.com</p>
              <p>Web: sawyerschulz.com</p>
            </div>
          </div>

          <div className="md:text-right space-y-2">
            <div className="inline-block rounded-lg bg-mist border border-line px-3 py-1 font-mono text-xs font-semibold text-ink">
              {invoice.number}
            </div>
            <div className="space-y-1 text-xs text-muted">
              <p>
                <span className="font-mono uppercase text-muted/70">Issue Date:</span>{" "}
                <span className="font-medium text-ink">{formatDate(invoice.createdAt)}</span>
              </p>
              <p>
                <span className="font-mono uppercase text-muted/70">Payment Due:</span>{" "}
                <span className="font-medium text-ink">{formatDate(invoice.dueDate)}</span>
              </p>
              {isPaid && invoice.paidAt ? (
                <p className="text-emerald-700 font-medium">
                  <span className="font-mono uppercase">Paid On:</span>{" "}
                  {formatDate(invoice.paidAt)}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Billed To */}
        <div className="py-6 border-b border-line">
          <span className="font-mono text-[11px] tracking-wider uppercase text-muted">
            Billed To
          </span>
          <div className="mt-2 text-sm">
            <p className="font-semibold text-ink text-base">{invoice.clientName}</p>
            {invoice.clientCompany ? (
              <p className="text-xs text-ink-soft">{invoice.clientCompany}</p>
            ) : null}
            <p className="text-xs text-muted mt-0.5">{invoice.clientEmail}</p>
            {invoice.projectTitle ? (
              <p className="mt-2 text-xs font-mono text-ink-soft">
                Project: <span className="font-medium text-ink">{invoice.projectTitle}</span>
              </p>
            ) : null}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] font-mono uppercase tracking-wider text-muted">
                <th scope="col" className="pb-3 font-medium">Description</th>
                <th scope="col" className="pb-3 text-center font-medium">Qty</th>
                <th scope="col" className="pb-3 text-right font-medium">Price</th>
                <th scope="col" className="pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {invoice.items.map((item) => (
                <tr key={item.id} className="text-ink">
                  <td className="py-4 pr-4">
                    <p className="font-medium text-ink">{item.description}</p>
                  </td>
                  <td className="py-4 text-center text-xs text-muted">{item.quantity}</td>
                  <td className="py-4 text-right text-xs font-mono text-ink-soft">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-4 text-right text-sm font-semibold font-mono text-ink">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="border-t border-line pt-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="max-w-md">
            {invoice.notes ? (
              <div className="rounded-xl bg-mist/60 border border-line p-4 text-xs text-muted leading-relaxed">
                <span className="font-mono text-[10px] uppercase font-semibold text-ink block mb-1">
                  Notes & Terms
                </span>
                {invoice.notes}
              </div>
            ) : null}

            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Payments are processed securely via PayPal. 100% money-back guarantee.</span>
            </div>
          </div>

          <div className="w-full md:w-72 space-y-2.5">
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-ink">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Taxes / Fees:</span>
              <span className="font-mono font-medium text-ink">$0.00</span>
            </div>
            <div className="flex justify-between border-t border-line-strong pt-3 text-base sm:text-lg font-bold text-ink">
              <span>Total Due:</span>
              <span className="font-mono">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Action Section (no-print) */}
        <div className="no-print mt-10 border-t border-line pt-8">
          {isPaid ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                <FileCheck2 className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-semibold text-emerald-950">
                Payment completed on {formatDate(invoice.paidAt || invoice.createdAt)}
              </h3>
              <p className="mt-1 text-xs text-emerald-800 max-w-md mx-auto">
                Thank you for your payment. Your receipt has been finalized. You can print or download this invoice anytime.
              </p>
              {invoice.paypalCaptureId ? (
                <p className="mt-2 font-mono text-[11px] text-emerald-700">
                  PayPal Transaction ID: {invoice.paypalCaptureId}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn3d btn3d-dark inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium text-paper"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Official Receipt
                </button>
                <Link
                  href="/dashboard"
                  className="btn3d btn3d-light inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-medium text-ink"
                >
                  Go to Client Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-mist px-3 py-1 font-mono text-xs text-muted mb-2">
                  <Lock className="h-3 w-3 text-ink" />
                  <span>Secure One-Click Payment</span>
                </div>
                <h3 className="text-lg font-semibold text-ink">
                  Pay {formatCurrency(invoice.total)} with PayPal
                </h3>
                <p className="text-xs text-muted mt-1">
                  Pay with PayPal balance, Pay in 4, debit card, or credit card.
                </p>
              </div>

              {errorMessage ? (
                <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 text-center">
                  {errorMessage}
                </div>
              ) : null}

              {processing ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-ink" />
                  <p className="text-sm font-medium text-ink">Verifying your payment with PayPal…</p>
                </div>
              ) : paypalConfig.configured ? (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalConfig.clientId,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <div className="relative min-h-[150px]">
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        shape: "rect",
                        label: "pay",
                        height: 48,
                      }}
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={(err) => {
                        console.error("PayPal button error:", err);
                        setErrorMessage("An error occurred with the PayPal checkout window. Please try again.");
                      }}
                    />
                  </div>
                </PayPalScriptProvider>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-xs text-amber-900 space-y-2">
                  <p className="font-semibold text-amber-950">PayPal credentials required</p>
                  <p>
                    Add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">PAYPAL_CLIENT_ID</code> and{" "}
                    <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">PAYPAL_CLIENT_SECRET</code> to your Vercel Environment Secrets to enable live payment processing.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Security Footer */}
      <div className="no-print mt-8 text-center text-xs text-muted space-y-1">
        <p>This invoice is private and accessible only via direct link.</p>
        <p>Questions? Contact Sawyer at sawyerbobk563@gmail.com.</p>
      </div>
    </div>
  );
}
