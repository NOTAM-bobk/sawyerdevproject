import type { Metadata } from "next";
import { ArrowUpRight, Github } from "lucide-react";
import { CtaBand } from "@/components/cta-band";
import { SketchSparkle } from "@/components/doodles";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { ButtonLink, Container, Section, SectionHeading, Tag } from "@/components/ui";
import { projects } from "@/content/site";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Sawyer Schulz — products, client platforms and open-source tools, with the results behind each build.",
};

export default function ProjectsPage() {
  const { featured } = projects;

  return (
    <>
      <PageHero eyebrow={projects.eyebrow} title={projects.title} description={projects.intro} />

      {/* Featured */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-mist p-7 md:p-10">
            <div aria-hidden="true" className="absolute inset-0 bg-grid bg-grid-fade opacity-70" />
            <div className="relative grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-paper uppercase">
                    Featured
                  </span>
                  <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
                    {featured.kind} · {featured.year}
                  </span>
                </div>
                <h2 className="mt-6 flex items-center gap-3 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">
                  {featured.name}
                  <SketchSparkle className="h-5 w-5 text-ink" delay={300} />
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft text-pretty">
                  {featured.summary}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted text-pretty">
                  {featured.detail}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  {featured.links.map((link) => (
                    <ButtonLink
                      key={link.label}
                      href={link.href}
                      variant={link.label === "Live site" ? "primary" : "secondary"}
                    >
                      {link.label === "Source" ? <Github className="h-4 w-4" /> : null}
                      {link.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </ButtonLink>
                  ))}
                </div>
              </div>

              <dl className="grid grid-cols-3 gap-6 self-start rounded-xl border border-line bg-paper p-6 md:grid-cols-1 md:gap-0">
                {featured.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="text-center md:border-b md:border-line md:py-5 md:text-left md:last:border-b-0"
                  >
                    <dd className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {metric.value}
                    </dd>
                    <dt className="mt-1.5 text-xs leading-relaxed text-muted">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* Grid */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="More work"
            title="Client builds, products and open source."
            description="Each one shipped to production. Case studies available on request."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.items.map((project, index) => (
              <ProjectCard key={project.name} project={project} index={index} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Curious how any of these were built?"
        description="Happy to walk through the architecture, the trade-offs, or the things I'd do differently next time. No sales pitch."
      />
    </>
  );
}
