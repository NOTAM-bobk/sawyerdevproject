import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Sawyer Schulz collects through the enquiry form, why, who else sees it, and how to have it deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={privacy.title}
      updated={privacy.updated}
      intro={privacy.intro}
      sections={privacy.sections}
    />
  );
}
