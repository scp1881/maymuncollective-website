/**
 * Skip link — the first thing in the tab order, invisible until focused.
 *
 * Without it a keyboard or screen-reader visitor lands on the page and has to
 * tab through the wordmark and four nav links before reaching any content, on
 * every page, every time. It is the cheapest accessibility fix there is and
 * almost nobody who is not using it will ever see it.
 *
 * Not `hidden` and not `sr-only` alone: it has to be focusable, so it is
 * positioned off-screen and brought back on `:focus-visible`. The colours are
 * inverted (bone ground, ink type) so it reads as a system affordance rather
 * than as part of the page, and so it is legible over whatever it lands on.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-sm bg-bone px-4 py-3 text-sm font-medium text-ink transition-transform focus-visible:translate-y-0"
    >
      Skip to content
    </a>
  );
}
