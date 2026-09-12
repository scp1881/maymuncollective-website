import { site } from "@/content/site";

/** Intrinsic dimensions of public/logo-wordmark.svg. The traced lockup is
 *  trimmed to its own bounds, so this is its true aspect ratio (1.75). Passing
 *  both to the <img> lets the browser reserve the correct box from the ratio
 *  alone, so setting only a height in CSS keeps the width proportional and the
 *  nav does not shift as the file arrives. */
const W = 294;
const H = 168;

/**
 * The "MAYMUN COLLECTIVE" arched lockup, used in place of a text wordmark in
 * the header. Shared by the homepage nav and the /gallery header so the two
 * cannot drift apart.
 *
 * A plain <img>, not an inlined SVG: the traced path is ~9 KB, more than the
 * whole HTML document currently weighs, so inlining would pay that on every
 * page load rather than once into the browser cache.
 *
 * The site name lives in `alt`, which makes this the accessible name of
 * whichever link wraps it — so callers should not add their own `aria-label`,
 * or it would override this and duplicate the labelling. It also means the name
 * still renders as text if the SVG ever fails to load.
 *
 * Size it with a height class (e.g. `h-9 sm:h-10`); width follows.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-wordmark.svg"
      alt={site.name}
      width={W}
      height={H}
      className={`w-auto ${className}`}
    />
  );
}
