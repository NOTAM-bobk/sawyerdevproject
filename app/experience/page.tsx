import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchSparkle } from "@/components/doodles";
import { PageHero } from "@/components/page-hero";
import { Timeline } from "@/components/timeline";
import { ButtonLink, Container, Section, SectionHeading, Tag } from "@/components/ui";
import { about, experience, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "A decade of product engineering — roles, responsibilities and results across startups, agencies and platform teams.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow={experience.eyebrow}
        title={experience.title}
        description={experience.intro}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href={`mailto:${site.email}?subject=${encodeURIComponent("Résumé request")}`}>
            Request full résumé
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            See the work
          </ButtonLink>
        </div>
      </PageHero>

      <Section>
        <Container>
          <SectionHeading eyebrow="Work history" title="Where I've spent my hours." />
          <div className="mt-14">
            <Timeline roles={experience.roles} />
          </div>
        </Container>
      </Section>

      <Section className="bg-mist">
        <Container className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading eyebrow="Education" title="Foundations." />
            <ul className="mt-10 space-y-5">
              {experience.education.map((item) => (
                <li key={item.title} className="rounded-xl border border-line bg-paper p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-base font-medium tracking-[-0.02em]">{item.title}</h3>
                    <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-muted">{item.org}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading eyebrow="Skills" title="What I'm fluent in." />
            <div className="mt-10 space-y-7">
              {about.toolbox.map((group) => (
                <div key={group.group}>
                  <h3 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                    {group.group}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-10 flex items-start gap-2 text-sm leading-relaxed text-muted text-pretty">
              <SketchSparkle className="mt-1 h-3 w-3 shrink-0 text-ink" delay={200} />
              Learning something new is part of the job — these are just the tools I can pick up
              without reading the docs twice.
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Need someone who's done this before?"
        description="I've joined teams mid-flight, inherited half-finished platforms and shipped on deadlines someone else set. Bring me the messy version of the problem."
      />
    </>
  );
}
