"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger the animation, in milliseconds. */
  delay?: number;
  variant?: "up" | "fade" | "left" | "right";
  /** Element to render, so list items stay list items. */
  as?: "div" | "li" | "article" | "section";
};

/**
 * Fades and lifts its children into view on scroll.
 *
 * Only elements that start below the fold are hidden, and only once the
 * observer is running — so the page stays fully readable without JavaScript and
 * content already on screen keeps its normal entrance animation.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  as = "div",
}: RevealProps) {
  const Tag = as as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Anything already visible on load stays visible.
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setHidden(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setHidden(false);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={hidden ? "hidden" : "visible"}
      data-variant={variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
