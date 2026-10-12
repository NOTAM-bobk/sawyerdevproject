import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms for Sawyer Schulz's $299 website package: what is included, payment, revisions, ownership and limits.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title={terms.title}
      updated={terms.updated}
      intro={terms.intro}
      sections={terms.sections}
    />
  );
}
