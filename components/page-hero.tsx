import type { ReactNode } from "react";
import { Eyebrow, Container } from "@/components/ui";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="absolute inset-0 bg-grid bg-grid-fade" />
      <Container className="relative py-16 md:py-24">
        <div className="max-w-3xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="animate-rise mt-5 text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p
              className="animate-rise mt-6 max-w-2xl text-base leading-relaxed text-muted text-pretty md:text-lg"
              style={{ animationDelay: "100ms" }}
            >
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
