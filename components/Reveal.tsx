import type { CSSProperties } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Optional stagger delay in ms, for sequencing sibling reveals. */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li"). Defaults to "div". */
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Fades + lifts its children into view once, when scrolled near the viewport.
 *
 * This is a *server* component on purpose. It used to be a client component
 * that started at `opacity: 0` and only became visible once React had hydrated
 * — which meant everything below the hero was blank until the whole JS bundle
 * had downloaded, parsed and hydrated. A visitor who scrolled straight down was
 * looking at empty space for the best part of three seconds on a slow link.
 *
 * Now it renders nothing but a `data-reveal` marker. The hiding is done in CSS
 * (see globals.css) and only applies once the tiny inline script in the layout
 * has confirmed the browser can actually reveal things again, and the revealing
 * is driven by that same script's IntersectionObserver — which is running by
 * DOMContentLoaded rather than by hydration. Same animation, several times
 * sooner, and no JS in the bundle for it at all.
 *
 * Consequences worth knowing:
 *  - With JS off, or if IntersectionObserver is missing, content is simply
 *    visible with no animation, instead of being permanently invisible.
 *  - `prefers-reduced-motion` is honoured by the script, which leaves the
 *    content visible and never animates it.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const Component = Tag as React.ElementType;

  return (
    <Component
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Component>
  );
}
