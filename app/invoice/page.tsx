import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Invoices | Sawyer Schulz",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InvoiceLandingPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="surface max-w-md w-full rounded-3xl border border-line bg-paper p-8 text-center shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-mist border border-line text-ink mb-5 shadow-xs">
          <Lock className="h-6 w-6 stroke-[1.75]" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-ink">Private Client Invoicing</h1>
        <p className="mt-3 text-xs leading-relaxed text-muted text-pretty">
          All invoices are unlisted and accessible exclusively through the direct link provided by Sawyer in your project correspondence.
        </p>

        <div className="mt-8 border-t border-line pt-6 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="btn3d btn3d-dark inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium text-paper"
          >
            Go to Client Dashboard
          </Link>
          <Link
            href="/"
            className="text-xs text-muted hover:text-ink transition-colors"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
