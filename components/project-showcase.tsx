import { ArrowUpRight } from "lucide-react";
import { SketchSparkle } from "@/components/doodles";
import { ButtonLink, Tag } from "@/components/ui";
import type { Project } from "@/content/site";

/** Full-width project card used on the projects page. */
export function ProjectShowcase({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="surface group relative overflow-hidden p-7 md:p-9">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid bg-grid-fade opacity-70 anim-grid-pan"
      />
      <div className="relative grid gap-9 md:grid-cols-[1.2fr_1fr] md:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {project.featured ? (
              <span className="btn3d-dark rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-paper uppercase">
                Featured
              </span>
            ) : null}
            <span className="font-mono text-[11px] tracking-wide text-muted uppercase">
              {project.kind} · {project.year}
            </span>
          </div>

          <h2 className="mt-5 flex items-center gap-3 text-2xl font-semibold tracking-[-0.035em] md:text-3xl">
            {project.name}
            <SketchSparkle className="h-4 w-4 text-warm" delay={200 + index * 120} />
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft text-pretty">
            {project.summary}
          </p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted text-pretty">
            {project.detail}
          </p>

          <ul className="mt-6 max-w-xl space-y-2">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm text-ink-soft">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-warm" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <Tag key={tag} tone={tagIndex === 0 ? "warm" : "neutral"}>
                {tag}
              </Tag>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.links.map((link, linkIndex) => (
              <ButtonLink
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                variant={linkIndex === 0 ? "primary" : "secondary"}
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            ))}
          </div>
        </div>

        <dl className="surface self-start px-6">
          {project.facts.map((fact) => (
            <div key={fact.label} className="border-b border-line py-5 last:border-b-0">
              <dt className="font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-sm text-ink">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
