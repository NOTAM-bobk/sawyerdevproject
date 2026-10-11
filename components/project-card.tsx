import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Tag } from "@/components/ui";

export type ProjectSummary = {
  name: string;
  kind: string;
  year: string;
  summary: string;
  tags: readonly string[];
  href?: string;
};

export function ProjectCard({
  project,
  index,
  className = "",
}: {
  project: ProjectSummary;
  index: number;
  className?: string;
}) {
  return (
    <Link
      href={project.href ?? "#"}
      target={project.href?.startsWith("http") ? "_blank" : undefined}
      rel={project.href?.startsWith("http") ? "noreferrer" : undefined}
      className={`group relative flex flex-col justify-between rounded-xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="font-mono text-xs text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
        </div>
        <h3 className="mt-5 text-lg font-medium tracking-[-0.02em]">{project.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{project.summary}</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] tracking-wide text-muted uppercase">
        {project.kind} · {project.year}
      </p>
    </Link>
  );
}
