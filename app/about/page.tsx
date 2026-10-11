import type { Metadata } from "next";
import { ArrowUpRight, Mail } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchCorners, SketchSparkle } from "@/components/doodles";
import { PageHero } from "@/components/page-hero";
import {
  ButtonLink,
  Container,
  MetaRow,
  Scribbled,
  Section,
  SectionHeading,
} from "@/components/ui";
import { about, site } from "@/content/site";

const SCRIBBLE_PHRASE = "fewer dependencies, fewer abstractions";

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
    "Sawyer Schulz is a software engineer in Denver, Colorado building fast, clean web products — plus the toolbox and the story behind the work.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Engineer, tinkerer, relentless simplifier."
        description={about.intro}
      />

      <Section>
        <Container className="grid gap-14 md:grid-cols-[260px_1fr] md:gap-16">
          {/* Portrait / monogram card */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative rounded-2xl border border-line bg-mist p-6">
              <SketchCorners className="pointer-events-none absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-line-strong" />
              <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-line-strong bg-paper">
                <span className="font-mono text-6xl font-medium tracking-tighter text-ink">
                  {site.initials}
                </span>
              </div>
              <div className="mt-6">
                <p className="text-base font-medium tracking-[-0.02em]">{site.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {site.role} · {site.location}
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
            <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-soft text-pretty">
              {about.paragraphs.map((paragraph, index) => (
                <p key={paragraph.slice(0, 24)}>
                  {index === 0 ? highlight(paragraph, SCRIBBLE_PHRASE) : paragraph}
                </p>
              ))}
            </div>

            <dl className="mt-12 max-w-xl">
              {about.currently.map((item) => (
                <MetaRow key={item.label} label={item.label} value={item.value} />
              ))}
            </dl>

            <div className="mt-14">
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">
                How I like to work
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Small, reviewable steps",
                    body: "Short-lived branches and focused pull requests — you always know what changed and why.",
                  },
                  {
                    title: "Writing before building",
                    body: "A one-page plan catches more problems than a week of prototyping ever will.",
                  },
                  {
                    title: "Boring where it counts",
                    body: "Proven tools on the critical path. Novelty is for side projects, not billing systems.",
                  },
                  {
                    title: "Own the outcome",
                    body: "If it's slow, confusing or off-brand, that's my problem to fix — not yours to report.",
                  },
                ].map((item) => (
                  <li key={item.title} className="rounded-xl border border-line bg-paper p-5">
                    <h3 className="flex items-start gap-2 text-sm font-medium tracking-[-0.01em]">
                      <SketchSparkle className="mt-1 h-3 w-3 shrink-0 text-ink" delay={200} />
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Toolbox */}
      <Section className="bg-mist">
        <Container>
          <SectionHeading
            eyebrow="Toolbox"
            title="The tools I reach for."
            description="Not a laundry list — these are the ones I've used in production and would happily use again."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.toolbox.map((group) => (
              <div key={group.group} className="bg-paper p-6">
                <h3 className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                  {group.group}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
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
              <div
                key={item.title}
                className="relative rounded-xl border border-line bg-paper p-6"
              >
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-medium tracking-[-0.02em]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-2xl text-sm text-muted">
            Want the full résumé, project references or a walkthrough of any of this?{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              Just ask
            </a>{" "}
            — I&apos;m happy to share more than fits on a page.
          </p>
        </Container>
      </Section>

      <CtaBand title="Let's talk about what you're building." />
    </>
  );
}
