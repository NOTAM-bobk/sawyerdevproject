import Link from "next/link";
import { ArrowUpRight, Pencil, ScanEye } from "lucide-react";
import { STATUS_LABELS, projectProgress, type Project } from "@/lib/projects";

const statusStyles: Record<Project["status"], string> = {
  reviewing: "text-warm-deep",
  accepted: "text-mint",
  declined: "text-muted",
  delivered: "text-plum",
};

/**
 * The admin's view of /dashboard: every client dashboard in one list, with a
 * shortcut into the editor and a preview of exactly what the client sees.
 */
export function DashboardProjects({
  projects,
  storageReady,
  storageError = "",
}: {
  projects: Project[];
  storageReady: boolean;
  storageError?: string;
}) {
  return (
    <div>
      <span className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
        Dashboard
      </span>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
        Client dashboards.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted text-pretty">
        Every enquiry gets a page like this. Edit one to post an update, tick off the checklist, set
        the launch date or move the status.
      </p>

      {!storageReady ? (
        <p className="mt-8 max-w-2xl rounded-xl border border-line bg-mist p-5 text-sm leading-relaxed text-ink-soft">
          Add <code className="font-mono text-xs">MONGODB_URI</code> to your environment variables and
          redeploy. Dashboards need somewhere to live.
        </p>
      ) : null}

      {storageError ? (
        <p
          role="alert"
          className="mt-8 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-relaxed text-red-700"
        >
          Storage could not be reached, so nothing is listed here.
          <span className="mt-2 block font-mono text-[11px] break-all opacity-80">
            {storageError}
          </span>
        </p>
      ) : null}

      {storageReady && !storageError && projects.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No dashboards yet. One is created automatically the first time someone sends an enquiry.
        </p>
      ) : null}

      <ul className="mt-10 grid gap-5 lg:grid-cols-2">
        {projects.map((project) => {
          const progress = projectProgress(project);
          return (
            <li key={project.id} className="surface flex flex-col p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-base font-medium tracking-[-0.02em]">{project.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {project.name}
                    {project.email ? ` · ${project.email}` : ""}
                  </p>
                </div>
                <span
                  className={`font-mono text-[11px] tracking-wide whitespace-nowrap uppercase ${statusStyles[project.status]}`}
                >
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-ink"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] whitespace-nowrap text-muted">
                  {progress.done}/{progress.total}
                </span>
              </div>

              <p className="mt-4 font-mono text-[11px] tracking-wide text-muted uppercase">
                {project.deadline ? `Launch ${project.deadline}` : "No launch date set"}
                {project.hasCode ? "" : " · no code issued"}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
                <Link
                  href={`/dashboard/p/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  <ScanEye className="h-3.5 w-3.5 text-warm" />
                  Preview
                </Link>
                <Link
                  href={`/admin/clients/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  <Pencil className="h-3.5 w-3.5 text-warm" />
                  Edit
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
                >
                  Enquiries
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
