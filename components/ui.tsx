import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SketchSparkle, SketchUnderline } from "@/components/doodles";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}

export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`border-t border-line py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-muted uppercase">
      <SketchSparkle className="h-2.5 w-2.5 text-warm" delay={120} />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted text-pretty md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** Word with a hand-drawn underline underneath it. */
export function Scribbled({
  children,
  className = "",
  delay = 500,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <SketchUnderline
        delay={delay}
        className="absolute left-0 -bottom-[0.1em] h-[0.4em] w-full text-ink"
      />
    </span>
  );
}

const tagTones = {
  neutral: "text-muted",
  warm: "text-warm-deep",
  plum: "text-plum",
  mint: "text-mint",
} as const;

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: keyof typeof tagTones;
}) {
  return (
    <span
      className={`chip3d inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[11px] tracking-wide uppercase ${tagTones[tone]}`}
    >
      {tone !== "neutral" ? (
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 rounded-full ${
            tone === "warm" ? "bg-warm" : tone === "plum" ? "bg-plum" : "bg-mint"
          }`}
        />
      ) : null}
      {children}
    </span>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "sm";
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  const base =
    "btn3d group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    sm: "px-4 py-2 text-[13px]",
  };
  const variants = {
    primary: "btn3d-dark text-paper",
    secondary: "btn3d-light border border-line-strong text-ink",
    ghost: "text-muted hover:text-ink",
  };
  return (
    <Link className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

/** Monospaced label/value pair used in sidebars and footers. */
export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0">
      <dt className="font-mono text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className="text-right text-sm text-ink">{value}</dd>
    </div>
  );
}
