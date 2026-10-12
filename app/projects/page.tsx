import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectShowcase } from "@/components/project-showcase";
import { Reveal } from "@/components/reveal";
import { GithubPanel } from "@/components/github-panel";
import { Container, Section } from "@/components/ui";
import { projects } from "@/content/site";
import { breadcrumbSchema, projectsSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Sawyer Schulz: an athlete site for an 800m runner and his own portfolio, both live and maintained.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Sawyer Schulz",
    description:
      "Live projects by Sawyer Schulz: a site for an 800m runner, and his own portfolio.",
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

      <GithubPanel
        eyebrow="Also on GitHub"
        title="Smaller things I've shipped."
        description="Apps and tools I built to learn something or to fix an annoyance. Star counts and languages come straight from GitHub."
      />

      <CtaBand
        title="Want something like this?"
        description="I take on a few sites at a time. Tell me what you have in mind and I'll tell you what it takes."
      />
    </>
  );
}
