import type { Metadata } from "next";
import { CtaBand } from "@/components/cta-band";
import { PageHero } from "@/components/page-hero";
import { ProjectShowcase } from "@/components/project-showcase";
import { Reveal } from "@/components/reveal";
import { Container, Section } from "@/components/ui";
import { projects, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Sawyer Schulz, a student developer in Minneapolis — including an athlete site for an NCAA 800m runner and his own portfolio.",
};

export default function ProjectsPage() {
  return (
    <>
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

          <Reveal delay={120}>
            <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
              Both sites are maintained by me — content updates, new results and fixes ship as they
              come up. If you want to see how something was built, or you&apos;re working on
              something similar,{" "}
              <a
                href={`mailto:${site.email}`}
                className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
              >
                send me a note
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        title="Want something like this?"
        description="I'm taking on small web projects — a site, a rebuild, or a page that needs to load fast and look sharp. Tell me what you have in mind."
      />
    </>
  );
}
