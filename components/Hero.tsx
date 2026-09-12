import { hero } from "@/content/site";

/**
 * Hero: the name as a two-line stacked lockup, a tagline, and a scroll cue.
 *
 * The two lines are rendered as separate blocks at the same font size, with
 * `leading-[0.82]` closing the gap between them so "MAYMUN" and "COLLECTIVE"
 * read as one mass rather than two sentences. The size is driven by the longer
 * line: `clamp()` is tuned so COLLECTIVE lands just inside the container gutter
 * at every width, which is what makes the block feel sized *to* the hero
 * instead of floating in it.
 *
 * `tracking-[-0.03em]` is slightly tighter than the old setting — at this size
 * the default spacing reads loose, and pulling it in also buys the width that
 * lets the type run larger.
 *
 * The headline carries no animation delay on purpose. It is the LCP element, so
 * every millisecond before it is opaque is a millisecond of LCP; the tagline and
 * scroll cue keep a stagger behind it, just a much tighter one than before. See
 * the note on `fade-up` in tailwind.config.ts for the measurements.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* Subtle radial glow anchored bottom-left for depth. Purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-[-10rem] h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="container-page relative">
        <h1 className="animate-fade-up font-display text-[clamp(3.5rem,15.5vw,12rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] opacity-0">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-8 max-w-xl animate-fade-up text-lg text-muted opacity-0 [animation-delay:120ms] sm:mt-10 sm:text-xl">
          {hero.tagline}
        </p>
      </div>

      {/* Bottom fade: dissolves the section (and its glow) into the page
          background so the hand-off to the Gallery section reads as a smooth
          gradient rather than a hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
      />

      {/* Scroll cue */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-muted opacity-0 [animation-delay:260ms]"
        aria-label={`${hero.scrollCue} to gallery`}
      >
        <span className="text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-bone">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-10 w-px animate-pulse bg-gradient-to-b from-muted to-transparent"
        />
      </a>
    </section>
  );
}
