import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileQuestion, Lock } from "lucide-react";
import { InvoiceView } from "@/components/invoice-view";
import { getInvoiceByTokenOrId } from "@/lib/invoices";
import { getPayPalPublicConfig } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invoice | Sawyer Schulz",
  description: "Private client invoice and payment page.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await getInvoiceByTokenOrId(id);

  if (!invoice) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="surface max-w-md w-full rounded-3xl border border-line bg-paper p-8 text-center shadow-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mist border border-line text-muted mb-4">
            <Lock className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-semibold text-ink">Private Invoice</h1>
          <p className="mt-2 text-xs text-muted leading-relaxed text-pretty">
            This invoice is private and could not be found. Please make sure you have the full link sent by Sawyer.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="btn3d btn3d-dark inline-flex items-center rounded-full px-5 py-2.5 text-xs font-medium text-paper"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const paypalConfig = getPayPalPublicConfig();

  return (
    <main className="min-h-screen bg-canvas">
      <InvoiceView initialInvoice={invoice} paypalConfig={paypalConfig} />
    </main>
  );
}
