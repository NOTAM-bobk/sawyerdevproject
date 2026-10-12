"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Container, Section, SectionHeading } from "@/components/ui";
import { reviews, reviewsConfig, type Review } from "@/content/reviews";

/** Five stars, filled up to `value`. */
export function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={`h-4 w-4 ${step <= value ? "fill-warm text-warm" : "text-line-strong"}`}
        />
      ))}
    </span>
  );
}

function averageRating(items: readonly Review[]) {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + item.rating, 0) / items.length;
}

/**
 * Rotating reviews. Auto-advances every `reviewsConfig.rotateMs`, pauses while
 * hovered or focused, and never auto-advances when the visitor has asked for
 * reduced motion. Without JavaScript the first review still renders.
 */
export function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const total = reviews.length;
  const average = averageRating(reviews);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (total < 2 || paused || reduceMotion) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % total),
      reviewsConfig.rotateMs,
    );
    return () => window.clearInterval(timer);
  }, [total, paused, reduceMotion]);

  if (total === 0) return null;

  const go = (step: number) => setIndex((current) => (current + step + total) % total);
  const active = reviews[index];

  return (
    <Section id="reviews" className="relative overflow-hidden bg-mist">
      <div aria-hidden="true" className="absolute inset-0 tint-warm" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={reviewsConfig.eyebrow}
            title={reviewsConfig.title}
            description={reviewsConfig.description}
          />
        </Reveal>

        {reviewsConfig.showSummary ? (
          <Reveal delay={60}>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              <span className="text-4xl font-semibold tracking-[-0.04em] tabular-nums">
                {average.toFixed(1)}
              </span>
              <Stars value={Math.round(average)} className="[&>svg]:h-5 [&>svg]:w-5" />
              <span className="text-sm text-muted">
                {reviewsConfig.summaryLabel} ({total})
              </span>
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={120}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Reviews"
            className="surface mx-auto mt-12 max-w-3xl p-7 md:p-11"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {/* Every review is stacked in one grid cell so the card never resizes mid-rotation. */}
            <div className="grid">
              {reviews.map((review, position) => (
                <figure
                  key={`${review.name}-${review.date}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${position + 1} of ${total}`}
                  aria-hidden={position === index ? undefined : true}
                  className={`col-start-1 row-start-1 transition-opacity duration-500 ${
                    position === index ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <Stars value={review.rating} />
                  <blockquote className="mt-6 text-lg leading-relaxed text-ink text-pretty md:text-xl">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-7">
                    <span className="block text-sm font-medium tracking-[-0.01em]">
                      {review.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">
                      {review.role}
                      <span aria-hidden="true"> · </span>
                      {review.href ? (
                        <a
                          href={review.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
                        >
                          {review.source}
                        </a>
                      ) : (
                        review.source
                      )}
                      , {review.date}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
              <span className="font-mono text-[11px] tracking-[0.14em] text-muted tabular-nums uppercase">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 sm:flex">
                  {reviews.map((review, position) => (
                    <button
                      key={`dot-${review.name}-${review.date}`}
                      type="button"
                      onClick={() => setIndex(position)}
                      aria-label={`Show review ${position + 1}`}
                      aria-current={position === index ? "true" : undefined}
                      className="group/dot flex h-6 items-center px-0.5"
                    >
                      <span
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          position === index
                            ? "w-6 bg-ink"
                            : "w-1.5 bg-line-strong group-hover/dot:bg-ink/40"
                        }`}
                      />
                    </button>
                  ))}
                </span>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="btn3d btn3d-light inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="btn3d btn3d-light inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong text-ink"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <p aria-live="polite" className="sr-only">
          Showing review {index + 1} of {total} from {active.name}.
        </p>
      </Container>
    </Section>
  );
}
