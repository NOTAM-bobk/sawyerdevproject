import type { CSSProperties, SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement> & {
  /** Stagger the draw-in animation (milliseconds). */
  delay?: number;
};

/*
 * Sizing note: these are inline SVGs, so any that is absolutely positioned with
 * an auto width or height falls back to its intrinsic 300x120 ratio and ignores
 * its insets. When a doodle should stretch, give it both dimensions — the
 * `inset-0 h-full w-full` combination used by Circled and the stat circles.
 */
function drawStyle(delay: number): CSSProperties {
  return delay ? { animationDelay: `${delay}ms` } : {};
}

/**
 * A hand-drawn underline. Stretches with its container:
 * `preserveAspectRatio="none"` plus a non-scaling stroke keeps the line weight honest.
 */
export function SketchUnderline({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 266 26"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M6 17.5c40-9.6 100-13.4 154-10.6 33 1.7 58 5.4 80 9.3"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M18 23c54-5.8 122-8.4 180-5.7 24 .9 44 2.8 62 5.2"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.55}
      />
    </svg>
  );
}

/** A rough, slightly overshooting loop — great for circling a word or a number. */
export function SketchCircle({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 300 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M168 10C96 4 24 26 21 59c-3 33 67 55 139 53 58-2 122-20 124-51 2-26-53-46-118-49-25-1-49 0-71 3"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A hand-drawn marker highlight, meant to sit behind a line of text. */
export function SketchHighlight({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 320 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-draw-fill ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M5 21C5 9 37 3 160 3c86 0 139 3 151 8 9 4 7 14-1 26-11 17-56 22-150 22C68 59 13 54 7 41 5 35 5 27 5 21Z"
        fill="currentColor"
        opacity={0.18}
      />
    </svg>
  );
}

/** A curvy arrow. Rotate it with a Tailwind class to aim it anywhere. */
export function SketchArrow({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M7 11C14 40 30 62 56 72"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M33 72c8-1 16-1.6 23-0.6"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <path
        d="M38 56c6 5.4 12 10.4 18 15.8"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Hand-drawn tick for feature lists. */
export function SketchCheck({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M4 13.4c2.3 1.7 4.1 3.7 5.3 6.2C12 13 16 8 20.6 3.6"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Wavy divider — hand-drawn squiggle. */
export function SketchSquiggle({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 400 14"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M2 9c22-7 44 4 66 0s44-9 66-3 44 9 66 3 44-9 66-3 44 7 66 1"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Four-point sparkle, used as a small flourish next to headings. */
export function SketchSparkle({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`doodle-draw-fill ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M12 0c.7 6.1 5 10.3 12 11.9-7 1.6-11.3 5.9-12 12-.7-6.1-5-10.4-12-12C7 10.3 11.3 6.1 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Sketchy corner brackets — frames a card or a portrait. */
export function SketchCorners({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        <path d="M2 14C1.5 9 3 3.5 6 2.5" />
        <path d="M14 2C9 1.6 4 2.6 2 5" />
        <path d="M98 86c.5 5-1 10.5-4 11.5" />
        <path d="M86 98c5 .4 10-.6 12-3" />
      </g>
    </svg>
  );
}

/** Freehand underline flourish for the footer wordmark. */
export function SketchFlourish({ delay = 0, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 210 24"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`doodle-draw ${props.className ?? ""}`}
      style={drawStyle(delay)}
    >
      <path
        d="M3 15c30-8 66-11 104-9 30 1.6 56 4.4 78 8.6 4 .8 8 1.8 12 3"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
