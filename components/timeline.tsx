import { Tag } from "@/components/ui";

export type Role = {
  role: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  highlights: readonly string[];
  tags: readonly string[];
};

export function Timeline({ roles }: { roles: readonly Role[] }) {
  return (
    <ol className="relative mt-4">
      {roles.map((role, index) => (
        <li key={`${role.company}-${role.period}`} className="relative md:grid md:grid-cols-[200px_1fr]">
          {/* Connector + node */}
          <span
            aria-hidden="true"
            className={`absolute top-6 left-[7px] w-px bg-line md:left-[215px] ${
              index === roles.length - 1 ? "h-6" : "h-full"
            }`}
          />
          <span
            aria-hidden="true"
            className="absolute top-[22px] left-0 h-3.5 w-3.5 rounded-full border border-line-strong bg-paper md:left-[208px]"
          />

          <div className="pl-8 md:pl-0 md:pr-8 md:text-right">
            <p className="font-mono text-xs tracking-wide text-muted uppercase">{role.period}</p>
            <p className="mt-1 text-xs text-muted">{role.location}</p>
          </div>

          <article className="mt-4 pb-14 pl-8 md:mt-0 md:pl-8">
            <h3 className="text-lg font-medium tracking-[-0.02em]">
              {role.role}
              <span className="text-muted"> · {role.company}</span>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{role.summary}</p>
            <ul className="mt-4 space-y-2">
              {role.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm text-ink-soft">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {role.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
