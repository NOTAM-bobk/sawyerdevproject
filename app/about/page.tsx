import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchCorners } from "@/components/doodles";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import {
  ButtonLink,
  Container,
  MetaRow,
  Scribbled,
  Section,
  SectionHeading,
} from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import { about, site } from "@/content/site";
import { breadcrumbSchema } from "@/lib/seo";
import { avatarUrl } from "@/lib/dicebear";

const SCRIBBLE_PHRASE = "I write the design and the code myself";

/** Renders a paragraph with one hand-drawn-underlined phrase inside it. */
function highlight(paragraph: string, phrase: string) {
  const [before, after] = paragraph.split(phrase);
  if (after === undefined) return paragraph;
  return (
    <>
      {before}
      <Scribbled delay={400}>{phrase}</Scribbled>
      {after}
    </>
  );
}

export const metadata: Metadata = {
  title: "About",
  description:
    "Sawyer Schulz designs and builds websites in Minneapolis, Minnesota — what he works with, and what he does away from the keyboard.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sawyer Schulz",
    description:
      "A web designer and developer in Minneapolis, Minnesota: what he works with, and what he does away from the keyboard.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "About", path: "/about" }])} />
      <PageHero
        eyebrow="About"
        title={about.title}
        description={about.intro}
      />

      <Section>
        <Container className="grid gap-14 md:grid-cols-[260px_1fr] md:gap-16">
          {/* Portrait / monogram card */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="surface relative p-6">
              <SketchCorners className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-line-strong" />
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-line-strong bg-paper">
                <Image
                  src={avatarUrl({ size: 384, format: "png" })}
                  alt={`${site.name} avatar`}
                  width={384}
                  height={384}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-6">
                <p className="text-base font-medium tracking-[-0.02em]">{site.name}</p>
                <p className="mt-1 text-sm text-muted">{site.location}</p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                  Design · Backend · Frontend
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <ButtonLink href={`mailto:${site.email}`} size="sm">
                  <Mail className="h-3.5 w-3.5" />
                  Email me
                </ButtonLink>
                <ButtonLink href="/projects" variant="secondary" size="sm">
                  See my work
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </ButtonLink>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Reveal className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft text-pretty">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{highlight(paragraph, SCRIBBLE_PHRASE)}</p>
              ))}
            </Reveal>

            <Reveal delay={80}>
              <dl className="mt-12 max-w-xl">
                {about.currently.map((item) => (
                  <MetaRow key={item.label} label={item.label} value={item.value} />
                ))}
              </dl>
            </Reveal>

          </div>
        </Container>
      </Section>

      {/* Toolbox */}
      <Section className="bg-mist">
        <Container>
          <SectionHeading
            eyebrow="Toolbox"
            title="The tools I reach for."
            description="The tools I reach for most days."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.toolbox.map((group, index) => (
              <Reveal key={group.group} delay={index * 80} className="surface surface-lift p-6">
                <h3 className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                  {group.group}
                </h3>
                <div className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <p key={item} className="text-sm text-ink-soft">
                      {item}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Beyond the code */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Beyond the code"
            title="What I do when the laptop closes."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {about.beyondCode.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="surface surface-lift relative p-6"
              >
                <span className="font-mono text-xs text-warm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-medium tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand title="Let's talk about what you're building." />
    </>
  );
}
