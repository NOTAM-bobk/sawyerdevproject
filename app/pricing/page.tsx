import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchCheck, SketchSparkle } from "@/components/doodles";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { PricingCard } from "@/components/pricing-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Section, SectionHeading } from "@/components/ui";
import { pricing, site } from "@/content/site";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Pricing — one full site for $299",
  description:
    "One fixed-price package: a complete custom website for $299, designed, built and launched by Sawyer Schulz. Includes up to 5 pages, SEO basics, and a contact form.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing — one full site for $299",
    description:
      "A complete custom website for $299, fixed price. Up to 5 pages, custom design, SEO basics, deployed to your domain.",
    url: "/pricing",
  },
};

export default function PricingPage() {
  const [option] = pricing.options;

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(),
          faqSchema(),
          breadcrumbSchema([{ name: "Pricing", path: "/pricing" }]),
        ]}
      />
      <PageHero eyebrow={pricing.eyebrow} title={pricing.title} description={pricing.intro}>
        <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{pricing.note}</p>
      </PageHero>

      <Section>
        <Container>
          <Reveal className="mx-auto max-w-4xl">
            <PricingCard option={option} variant="wide" />
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-muted text-pretty">
              Bigger than a site — an app, a rebuild, or ongoing work? Those are quoted separately.{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
              >
                Send me the details
              </a>{" "}
              and I&apos;ll come back with a number.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className="bg-mist">
        <Container className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading eyebrow="In every project" title="What you always get." />
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
            <SectionHeading eyebrow="How it works" title="Three steps, no meetings you don't need." />
            <ol className="mt-10 space-y-5">
              {[
                {
                  title: "Tell me what you need",
                  body: "A message is enough: who it's for, the pages you want, and any content or branding you already have.",
                },
                {
                  title: "I design and build it",
                  body: "You get a fixed $299 quote up front, then progress updates as the site comes together.",
                },
                {
                  title: "You review, I launch",
                  body: "One revision round, then it goes live on your domain — with a handover doc for anything you want to change later.",
                },
              ].map((step, index) => (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={index * 90}
                  className="flex gap-4 rounded-xl border border-line bg-paper p-5 transition-colors duration-300 hover:border-line-strong"
                >
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-sm font-medium tracking-[-0.01em]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>
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
              Not sure $299 covers it?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted text-pretty md:text-base">
              Send me a paragraph about the project. I&apos;ll tell you honestly whether the $299
              package fits, what I&apos;d cut, and how long it would take.
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
        title="Ready when you are."
        description="One price, one person to talk to, one site that works. Send me the details and I'll reply within a day."
      />
    </>
  );
}
