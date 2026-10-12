import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { Container, Section } from "@/components/ui";
import { site } from "@/content/site";

type LegalSection = { heading: string; body: readonly string[] };

/** Shared layout for /privacy and /terms. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow="Legal" title={title} description={intro} />

      <Section>
        <Container className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">{updated}</p>

          <div className="mt-10 space-y-5">
            {sections.map((section, index) => (
              <Reveal key={section.heading} delay={index * 60}>
                <article className="surface p-6 md:p-7">
                  <h2 className="text-lg font-medium tracking-[-0.02em]">{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 24)}
                        className="text-sm leading-relaxed text-ink-soft text-pretty"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 text-sm leading-relaxed text-muted text-pretty">
            Questions about any of this? Email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
            >
              {site.email}
            </a>{" "}
            or message {site.phone} — I don&apos;t take phone calls.
          </p>
        </Container>
      </Section>
    </>
  );
}
