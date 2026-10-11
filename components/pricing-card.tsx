import { ArrowUpRight } from "lucide-react";
import { SketchCheck } from "@/components/doodles";
import { Scribbled } from "@/components/ui";
import { site } from "@/content/site";

export type PricingTier = {
  name: string;
  price: string;
  priceNote: string;
  for: string;
  turnaround: string;
  popular: boolean;
  features: readonly string[];
  cta: string;
};

export function PricingCard({ tier, delay = 0 }: { tier: PricingTier; delay?: number }) {
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`${tier.name} — project enquiry`)}`;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-paper p-7 transition-all duration-300 ${
        tier.popular
          ? "border-ink shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_60px_-32px_rgba(0,0,0,0.45)] md:-mt-2 md:mb-2"
          : "border-line hover:border-line-strong"
      }`}
    >
      {tier.popular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-paper uppercase">
          Most popular
        </span>
      ) : null}

      <h3 className="text-sm font-medium tracking-tight">{tier.name}</h3>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-[-0.04em]">
          {tier.popular ? (
            <Scribbled delay={delay + 200}>{tier.price}</Scribbled>
          ) : (
            tier.price
          )}
        </span>
      </p>
      <p className="mt-2 font-mono text-[11px] tracking-wide text-muted uppercase">
        {tier.priceNote}
      </p>

      <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-muted text-pretty">
        {tier.for}
      </p>

      <ul className="mt-5 flex-1 space-y-3">
        {tier.features.map((feature, index) => (
          <li key={feature} className="flex gap-3 text-sm text-ink-soft">
            <SketchCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-ink"
              delay={delay + index * 60}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <a
          href={mailto}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
            tier.popular
              ? "bg-ink text-paper hover:bg-ink-soft"
              : "border border-line-strong bg-paper text-ink hover:border-ink hover:bg-mist"
          }`}
        >
          {tier.cta}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
        <p className="mt-3 text-center font-mono text-[11px] tracking-wide text-muted">
          {tier.turnaround}
        </p>
      </div>
    </div>
  );
}
