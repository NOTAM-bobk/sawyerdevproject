import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Container, MetaRow, Section, SectionHeading, Tag } from "@/components/ui";
import { about, experience } from "@/content/site";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "What Sawyer Schulz works with and what he is building now: five years of websites and client sites in Minneapolis.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience — Sawyer Schulz",
    description:
      "What Sawyer Schulz works with now: five years of websites and client work in Minneapolis.",
    url: "/experience",
  },
};

export default function ExperiencePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Experience", path: "/experience" }])} />
      <PageHero
        eyebrow={experience.eyebrow}
        title={experience.title}
        description={experience.intro}
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/start" className="px-6 py-3">
            Start a project
            <ArrowUpRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary" className="px-6 py-3">
            See the work
          </ButtonLink>
        </div>
      </PageHero>

      <Section className="bg-mist">
        <Container className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading eyebrow="Right now" title="What I'm doing this year." />
            <dl className="surface mt-10 max-w-md px-6 py-2">
              {about.currently.map((item) => (
                <MetaRow key={item.label} label={item.label} value={item.value} />
              ))}
            </dl>
          </div>

          <div>
            <SectionHeading eyebrow="Skills" title="What I'm fluent in." />
            <div className="mt-10 space-y-7">
              {about.toolbox.map((group, index) => (
                <Reveal key={group.group} delay={index * 80}>
                  <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                    {group.group}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item, tagIndex) => (
                      <Tag key={item} tone={tagIndex === 0 ? "warm" : "neutral"}>
                        {item}
                      </Tag>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Want to see it before you decide?"
        description="Send your brief and you get a private dashboard the same day — status, updates and a live chat, so you are not guessing while I build."
      />
    </>
  );
}
