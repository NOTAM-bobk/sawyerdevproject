import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SketchCheck } from "@/components/doodles";
import { Scribbled } from "@/components/ui";

export type PricingOption = {
  name: string;
  price: string;
  priceNote: string;
  for: string;
  turnaround: string;
  highlight?: string;
  features: readonly string[];
  cta: string;
};

export function PricingCard({
  option,
  delay = 0,
  variant = "compact",
}: {
  option: PricingOption;
  delay?: number;
  /** "wide" splits the card into details + feature list for the pricing page. */
  variant?: "compact" | "wide";
}) {
  const wide = variant === "wide";

  const details = (
    <>
      {option.highlight ? (
        <span className="inline-flex w-fit rounded-full bg-ink px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-paper uppercase">
          {option.highlight}
        </span>
      ) : null}

      <h3 className={`font-mono text-[11px] tracking-[0.18em] text-muted uppercase ${option.highlight ? "mt-6" : ""}`}>
        {option.name}
      </h3>

      <p className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
        <Scribbled delay={delay + 200}>{option.price}</Scribbled>
      </p>
      <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
        {option.priceNote}
      </p>

      <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-muted text-pretty">
        {option.for}
      </p>

      <div className={wide ? "mt-8 flex flex-wrap items-center gap-3" : "mt-8"}>
        <Link
          href="/start"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
        >
          {option.cta}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <p className="font-mono text-[11px] tracking-wide text-muted">{option.turnaround}</p>
      </div>
    </>
  );

  const featureList = (
    <ul className={wide ? "space-y-3.5" : "space-y-3"}>
      {option.features.map((feature, index) => (
        <li key={feature} className="flex gap-3 text-sm text-ink-soft">
          <SketchCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-ink"
            delay={delay + index * 60}
          />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative rounded-2xl bg-ink/[0.04] p-px shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_60px_-40px_rgba(0,0,0,0.5)]">
      <div className="flex h-full flex-col rounded-[calc(1rem-1px)] border border-ink/10 bg-paper p-7 md:p-9">
        {wide ? (
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
            <div className="flex flex-col">{details}</div>
            <div className="self-start rounded-xl border border-line bg-mist/60 p-6">
              <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
                What&apos;s included
              </p>
              <div className="mt-4">{featureList}</div>
            </div>
          </div>
        ) : (
          <>
            {details}
            <div className="mt-7 border-t border-line pt-7">{featureList}</div>
          </>
        )}
      </div>
    </div>
  );
}
