import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { FullscreenShell } from "@/components/fullscreen";
import { JsonLd } from "@/components/json-ld";
import { ProjectForm } from "@/components/project-form";
import { projectForm } from "@/content/form";
import { pricing, site } from "@/content/site";
import { breadcrumbSchema, contactPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell me about your project and your business: what you need built, who it is for, your design style, the pages you want, what it connects to, your domain, and when you need it live. Fixed price, $299 for a full site, with no upfront cost.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start a project — Sawyer Schulz",
    description:
      "Answer a few questions about your project and business — who it is for, design style, pages, integrations, domain and timeline — and get a plan, a fixed price and a timeline back within a day.",
    url: "/start",
  },
};

export default function StartPage() {
  return (
    <>
      <JsonLd
        data={[contactPageSchema(), breadcrumbSchema([{ name: "Start a project", path: "/start" }])]}
      />

      <FullscreenShell>
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-8 sm:px-6 md:py-12">
          {/* Top navigation */}
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <span className="chip3d inline-flex items-center gap-2 rounded-full border border-line bg-paper/90 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase backdrop-blur">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {site.availability}
            </span>
          </header>

          {/* Centered Main Form Container */}
          <div className="mt-8 md:mt-12 flex flex-1 flex-col items-center justify-start w-full">
            <div className="w-full text-center max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.18em] text-warm uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                {projectForm.eyebrow}
              </span>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-balance sm:text-4xl md:text-5xl text-ink">
                {projectForm.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-muted text-pretty max-w-xl mx-auto">
                {projectForm.intro}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 font-mono text-[11px] tracking-[0.14em] uppercase">
                <span className="chip3d rounded-full border border-line bg-paper px-3.5 py-1.5 text-ink font-medium">
                  {pricing.options[0].name} · {pricing.options[0].price}
                </span>
                <span className="rounded-full bg-mist px-3.5 py-1.5 text-muted border border-line">
                  {pricing.options[0].priceNote}
                </span>
              </div>
            </div>

            {/* The Main Wide Form Card */}
            <div className="mt-10 w-full">
              <ProjectForm />
            </div>

            {/* Reassurance Grid Below Form */}
            <div className="mt-12 grid w-full gap-5 sm:grid-cols-3">
              <div className="surface p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist text-warm border border-line">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">24-Hour Review</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  I review every brief personally and reply within a day with an exact plan, timeline, and suggestions.
                </p>
              </div>

              <div className="surface p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist text-warm border border-line">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">Pay After You See It</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  Flat $299 fee. Zero upfront deposit required — you only pay once the build is ready and approved.
                </p>
              </div>

              <div className="surface p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist text-warm border border-line">
                  <MapPin className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink">Direct Communication</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">
                  No agencies or middle-men. You talk directly with me throughout design, build, and launch.
                </p>
              </div>
            </div>

            {/* Quick Contact Bar */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted">
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-warm" />
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 text-ink-soft hover:text-ink transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-warm" />
                {site.phone}
              </a>
              <span>{site.location} · {site.timezone}</span>
            </div>
          </div>
        </div>
      </FullscreenShell>
    </>
  );
}
