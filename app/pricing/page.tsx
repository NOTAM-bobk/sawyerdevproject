import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchCheck, SketchSparkle } from "@/components/doodles";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { PricingCard } from "@/components/pricing-card";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { pricing, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, fixed-price pricing for landing pages, full sites and monthly engineering retainers — plus what's included, add-ons and FAQs.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow={pricing.eyebrow} title={pricing.title} description={pricing.intro}>
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
          {pricing.note}
        </p>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
            {pricing.tiers.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 100} className="h-full">
                <PricingCard tier={tier} delay={index * 100} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            Larger scope, unusual requirements, or a team that needs a hand?{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              Send me the details
            </a>{" "}
            and I&apos;ll quote it.
          </p>
        </Container>
      </Section>

      <Section className="bg-mist">
        <Container className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading eyebrow="Always included" title="In every project, no exceptions." />
            <ul className="mt-10 space-y-4">
              {pricing.included.map((item, index) => (
                <Reveal
                  as="li"
                  key={item}
                  delay={index * 70}
                  className="flex gap-3 text-sm leading-relaxed text-ink-soft"
                >
                  <SketchCheck className="mt-0.5 h-4 w-4 shrink-0 text-ink" delay={index * 70} />
                  <span>{item}</span>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Add-ons" title="Extras, priced up front." />
            <dl className="mt-10 overflow-hidden rounded-xl border border-line bg-paper">
              {pricing.addons.map((addon, index) => (
                <Reveal
                  key={addon.name}
                  delay={index * 50}
                  className="flex items-baseline justify-between gap-6 border-b border-line px-6 py-4 last:border-b-0"
                >
                  <dt className="text-sm text-ink-soft">{addon.name}</dt>
                  <dd className="font-mono text-xs tracking-wide text-muted whitespace-nowrap">
                    {addon.price}
                  </dd>
                </Reveal>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-muted text-pretty">
              Hourly work is available at $120/hour for existing clients, billed in 30-minute
              increments. Everything is invoiced in USD.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions I get asked before we start."
            description="Still unsure? Ask anyway — I'd rather answer a question than quote the wrong thing."
          />
          <div className="divide-y divide-line border-y border-line">
            {pricing.faq.map((item, index) => (
              <Reveal key={item.q} delay={index * 60}>
                <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium tracking-[-0.01em] [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start gap-2">
                    <SketchSparkle
                      className="mt-1.5 h-3 w-3 shrink-0 text-muted transition-colors group-open:text-ink"
                      delay={150}
                    />
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 font-mono text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 pl-5 text-sm leading-relaxed text-muted text-pretty">
                  {item.a}
                </p>
                </details>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-mist">
        <Container>
          <Reveal className="mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-8 text-center md:p-12">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
              Not sure which tier fits?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted text-pretty md:text-base">
              Send me a paragraph about the project and a rough budget. I&apos;ll tell you what&apos;s
              realistic, what I&apos;d cut, and where the timeline honestly lands.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href={`mailto:${site.email}`} className="px-6 py-3">
                Email {site.email}
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/projects" variant="secondary" className="px-6 py-3">
                See past work
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Two project slots left this quarter."
        description="Booking now for work starting in the next six weeks. If your timeline is tighter than that, say so — I keep room for emergencies."
      />
    </>
  );
}
