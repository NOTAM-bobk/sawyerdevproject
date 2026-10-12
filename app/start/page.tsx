import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FullscreenShell } from "@/components/fullscreen";
import { JsonLd } from "@/components/json-ld";
import { ProjectForm } from "@/components/project-form";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui";
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

const nextSteps = [
  {
    title: "You send this",
    body: "Four short steps. Rough answers are fine — the useful detail usually comes out in the reply.",
  },
  {
    title: "I reply within a day",
    body: "With what I'd build, what it costs (usually the $299 package), and how long it takes.",
  },
  {
    title: "We get it live",
    body: "You review and pay once it's built, I revise once, then it launches on your domain with a handover doc.",
  },
];

/**
 * The form is a full-screen surface rather than a page: it takes over the
 * viewport when someone clicks Start, so the questions are the only thing on
 * screen. Escape or "Back to site" closes it.
 */
export default function StartPage() {
  return (
    <>
      <JsonLd
        data={[contactPageSchema(), breadcrumbSchema([{ name: "Start a project", path: "/start" }])]}
      />

      <FullscreenShell>
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8 md:py-12">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
            <span className="chip3d hidden items-center gap-2 rounded-full border border-line bg-paper/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase backdrop-blur sm:inline-flex">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {site.availability}
            </span>
          </header>

          <div className="mt-10 grid flex-1 gap-12 lg:grid-cols-[1.55fr_1fr] lg:items-start lg:gap-16">
            <div>
              <h1 className="text-3xl leading-[1.1] font-semibold tracking-[-0.04em] text-balance sm:text-4xl md:text-5xl">
                {projectForm.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty">
                {projectForm.intro}
              </p>

              <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase">
                <span className="chip3d rounded-full border border-line bg-paper px-3 py-1.5 text-ink">
                  {pricing.options[0].name} · {pricing.options[0].price}
                </span>
                <span className="text-muted">{pricing.options[0].priceNote}</span>
              </p>

              <div className="mt-9">
                <ProjectForm />
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <Reveal variant="right" delay={80}>
                <div className="surface p-6">
                  <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                    What happens next
                  </h2>
                  <ol className="mt-5 space-y-5">
                    {nextSteps.map((step, index) => (
                      <li key={step.title} className="flex gap-4">
                        <span className="mt-0.5 font-mono text-xs text-warm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-sm font-medium tracking-[-0.01em]">{step.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted text-pretty">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>

              <Reveal variant="right" delay={160}>
                <div className="surface p-6">
                  <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                    Or reach me directly
                  </h2>
                  <ul className="mt-5 space-y-3">
                    <li>
                      <a
                        href={`mailto:${site.email}`}
                        className="flex items-center gap-3 text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        <Mail className="h-4 w-4 shrink-0 text-warm" />
                        {site.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={site.phoneHref}
                        className="flex items-center gap-3 text-sm text-ink-soft transition-colors hover:text-ink"
                      >
                        <Phone className="h-4 w-4 shrink-0 text-warm" />
                        {site.phone}
                      </a>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-ink-soft">
                      <MapPin className="h-4 w-4 shrink-0 text-warm" />
                      {site.location}
                    </li>
                  </ul>
                  <p className="mt-5 border-t border-line pt-5 text-xs leading-relaxed text-muted">
                    {site.timezone} · I read every enquiry myself and usually reply within a day.
                  </p>
                </div>
              </Reveal>

              <Reveal variant="right" delay={240}>
                <div className="flex flex-col gap-3">
                  <ButtonLink href="/pricing" variant="secondary" size="sm">
                    What the $299 package includes
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </ButtonLink>
                  <ButtonLink href="/projects" variant="ghost" size="sm">
                    See what I&apos;ve built
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </ButtonLink>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </FullscreenShell>
    </>
  );
}
