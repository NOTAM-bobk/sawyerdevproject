import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectShowcase } from "@/components/project-showcase";
import { Reveal } from "@/components/reveal";
import { Container, Section } from "@/components/ui";
import { projects } from "@/content/site";
import { breadcrumbSchema, projectsSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Four live projects by Sawyer Schulz: two web directories, a website for an 800m runner, and his own portfolio.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Sawyer Schulz",
    description:
      "Four live projects by Sawyer Schulz, including two web directories and a site for an 800m runner.",
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

      <CtaBand
        title="Want something like this?"
        description="I take on a few sites at a time. Tell me what you have in mind and I'll tell you what it takes."
      />
    </>
  );
}
