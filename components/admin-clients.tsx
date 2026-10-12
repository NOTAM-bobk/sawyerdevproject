import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { STATUS_LABELS, projectProgress, type Project } from "@/lib/projects";

const tone: Record<Project["status"], string> = {
  reviewing: "text-warm-deep",
  accepted: "text-mint",
  declined: "text-muted",
  delivered: "text-plum",
};

/** Compact list of client dashboards under the enquiry list on /admin. */
export function AdminClients({ projects }: { projects: Project[] }) {
  return (
    <section className="mt-20 border-t border-line pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
            Client dashboards
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
            What each client can see.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
            Every enquiry gets one automatically, with a code the client signs in with. Open one to
            post an update, tick off the checklist, set the launch date or accept the job.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-warm" />
          The dashboard view
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          None yet — one appears the first time someone sends an enquiry.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {projects.map((project) => {
            const progress = projectProgress(project);
            return (
              <li key={project.id}>
                <Link
                  href={`/admin/clients/${project.id}`}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 transition-colors hover:bg-mist"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium tracking-[-0.01em]">
                      {project.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {project.name} · {progress.done}/{progress.total} steps
                      {project.deadline ? ` · launch ${project.deadline}` : " · no launch date"}
                    </span>
                  </span>
                  <span className="flex items-center gap-5">
                    <span
                      className={`font-mono text-[11px] tracking-wide whitespace-nowrap uppercase ${tone[project.status]}`}
                    >
                      {STATUS_LABELS[project.status]}
                    </span>
                    {project.hasCode ? null : (
                      <span className="font-mono text-[11px] tracking-wide whitespace-nowrap text-warm-deep uppercase">
                        No code
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
