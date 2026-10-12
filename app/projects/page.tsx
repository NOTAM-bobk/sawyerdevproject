import type { Metadata } from "next";
import { Star } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectShowcase } from "@/components/project-showcase";
import { Reveal } from "@/components/reveal";
import { GithubPanel } from "@/components/github-panel";
import { Container, Section, SectionHeading } from "@/components/ui";
import { projects } from "@/content/site";
import { languageColor } from "@/lib/github";
import { breadcrumbSchema, projectsSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Twelve live projects by Sawyer Schulz: two web directories, a website for an 800m runner, his own portfolio, and eight smaller apps from GitHub.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Sawyer Schulz",
    description:
      "Twelve live projects by Sawyer Schulz, including two web directories, a site for an 800m runner and eight apps from GitHub.",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={[projectsSchema(), breadcrumbSchema([{ name: "Projects", path: "/projects" }])]}
      />
      <PageHero eyebrow={projects.eyebrow} title={projects.title} description={projects.intro} />

      <Section>
        <Container>
          <div className="space-y-6">
            {projects.items.map((project, index) => (
              <Reveal key={project.name} delay={index * 90}>
                <ProjectShowcase project={project} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- the other eight */}
      <Section className="bg-mist">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The other eight"
              title="Smaller things, all live."
              description="Apps I built to learn something or to fix an annoyance. Every one of them is public."
            />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {projects.more.map((project, index) => (
              <Reveal as="li" key={project.name} delay={index * 60} className="h-full">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="surface surface-lift group flex h-full flex-col p-6"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: languageColor(project.language) }}
                      />
                      <span className="text-base font-medium tracking-[-0.02em] transition-colors group-hover:text-warm-deep">
                        {project.name}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted tabular-nums">
                      <Star className="h-3 w-3" />
                      {project.stars}
                    </span>
                  </span>
                  <span className="mt-3 flex-1 text-sm leading-relaxed text-muted text-pretty">
                    {project.description}
                  </span>
                  <span className="mt-5 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                    {project.language}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <GithubPanel
        eyebrow="GitHub"
        title="The numbers behind them."
        description="Pulled from my GitHub account and refreshed a few times a day."
      />

      <CtaBand
        title="Want something like this?"
        description="I take on a few sites at a time. Tell me what you have in mind and I'll tell you what it takes."
      />
    </>
  );
}
