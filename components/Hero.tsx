import { hero } from "@/content/site";

/**
 * Hero: the name, set large on the page's own ink. No backdrop.
 *
 * There was a film here, and a still before that. Both are gone — see the
 * README for the history, which is worth reading before anyone puts a
 * background back. What is left is deliberately plain: one block of type on the
 * flat page colour, anchored bottom-left on the same measure as every section
 * below it, so the hero reads as the first item in the page's rhythm rather
 * than a separate slab with its own rules.
 *
 * With nothing behind the type, the whole scrim stack went too — four layered
 * gradients existed only to keep bone type legible over moving footage, and
 * over `bg-ink` they did nothing but cost paint.
 *
 * The headline does not fade in. Chrome will not treat a transparent element as
 * an LCP candidate, so a fade on the largest text on the first screen pushes LCP
 * out by the length of the animation — measured at +480ms when the tagline
 * briefly carried one. The scroll cue keeps its fade; nothing is gated on that.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-24 sm:pb-28"
    >
      <div className="container-page relative z-10">
        <h1 className="font-display text-[clamp(2.75rem,11.5vw,9.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.035em] [@media(max-aspect-ratio:1/1)]:text-[13vw]">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-6 text-xs uppercase tracking-[0.32em] text-bone/65 sm:mt-7 sm:text-sm">
          {hero.tagline}
        </p>
      </div>

      {/* Scroll cue */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-bone/50 opacity-0 [animation-delay:140ms]"
        aria-label={`${hero.scrollCue} to gallery`}
      >
        <span className="text-[0.65rem] uppercase tracking-[0.25em] transition-colors group-hover:text-bone">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-8 w-px animate-pulse bg-gradient-to-b from-bone/50 to-transparent"
        />
      </a>
    </section>
  );
}
