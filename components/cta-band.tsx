import { ArrowUpRight } from "lucide-react";
import { SketchSquiggle } from "@/components/doodles";
import { ProjectCta } from "@/components/project-cta";
import { Reveal } from "@/components/reveal";
import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui";
import { site } from "@/content/site";

export function CtaBand({
  title = "Have something you want built properly?",
  description = "Tell me about the project — even if it's just a paragraph. I'll reply with honest scope, a price, and whether I'm the right person for it.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-60 anim-dots-drift" />
        <div className="anim-blob absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(255,116,52,0.4),rgba(255,116,52,0))]" />
        <div className="anim-blob-slow absolute -right-32 -bottom-32 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(255,178,92,0.36),rgba(255,178,92,0))]" />
      </div>
      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Next up</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted text-pretty">{description}</p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={`mailto:${site.email}`} className="px-6 py-3">
                {site.email}
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href={site.phoneHref} variant="secondary" className="px-6 py-3">
                {site.phone}
              </ButtonLink>
              <ProjectCta variant="secondary" className="px-6 py-3" />
            </div>
            <SketchSquiggle className="h-3 w-48 text-line-strong" delay={400} />
            <p className="font-mono text-[11px] tracking-wide text-muted uppercase">
              {site.location} · {site.timezone} · Replies within a day
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
