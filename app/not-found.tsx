import { ArrowLeft } from "lucide-react";
import { SketchArrow, SketchSquiggle } from "@/components/doodles";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <SketchArrow className="absolute top-10 left-6 hidden h-16 w-16 -rotate-12 text-muted md:block" />
      <SketchSquiggle className="h-3 w-40 text-line-strong" />
      <p className="mt-6 font-mono text-xs tracking-[0.2em] text-muted uppercase">Error 404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
        That page wandered off.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted text-pretty">
        The link is broken or the page has moved. Either way, nothing to see here — head back home
        and we&apos;ll find something better.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </ButtonLink>
      </div>
    </Container>
  );
}
