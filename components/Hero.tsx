import { hero } from "@/content/site";

/**
 * Hero: the name, set large on the page's own ink. No backdrop.
 *
 * There was a film here, and a still before that. Both are gone — see the
 * README for the history, which is worth reading before anyone puts a
 * background back. What is left is deliberately plain: one block of type on the
 * flat page colour, set flush left against the page's own edge padding and
 * centred in the viewport: name, then a rule the width of the name, then the
 * tagline, each starting again from the same left rail. The scroll cue is the
 * one thing centred on the screen — it belongs to the viewport rather than to
 * the lockup, and it is the only element a visitor is meant to aim at.
 *
 * This is the one place on the site that is deliberately NOT on the max-w-6xl
 * measure the sections use. The name is the largest thing on the page and it is
 * meant to run to the edges; constraining it to the body measure put it in a
 * centred column and cost it all of its authority. Everything below the hero
 * still lines up with the nav.
 *
 * ── Sizing ────────────────────────────────────────────────────────────────
 * Both lines share one font-size, chosen so the longer one (COLLECTIVE) very
 * nearly fills the measure and the shorter one rags naturally short. The
 * divisor comes from measurement, not guesswork: at the weight and tracking
 * below, COLLECTIVE renders 5.581x its font-size wide (scripts aside, measured
 * with Range.getBoundingClientRect, which is the only way to get the real glyph
 * run — the spans are display:block and so always report the full container).
 * 5.75 is that number plus ~3% slack, which absorbs a classic 15px scrollbar
 * (100vw includes it, the content box does not) and any font fallback drift.
 * Change the weight, the tracking, or the word and this number is wrong.
 *
 * The 30vh ceiling only ever engages on short, wide viewports (roughly 21:9 and
 * flatter), where the width-derived size would make two lines taller than the
 * screen. At ordinary laptop and phone ratios the width term always wins.
 *
 * ── LCP ───────────────────────────────────────────────────────────────────
 * The headline does not fade in. Chrome will not treat a transparent element as
 * an LCP candidate, so a fade on the largest text on the first screen pushes LCP
 * out by the length of the animation — measured at +480ms when the tagline
 * briefly carried one. The scroll cue keeps its fade; nothing is gated on that.
 */

// (100vw − both gutters) ÷ 5.75, capped so it cannot outgrow a short viewport.
// Must stay in step with .container-rail's gutters in globals.css: 24px, 32px,
// then 64px. The subtracted value is both gutters together.
const HEADLINE_SIZE =
  "text-[min(calc((100vw-3rem)/5.75),30vh)] sm:text-[min(calc((100vw-4rem)/5.75),30vh)] lg:text-[min(calc((100vw-8rem)/5.75),30vh)]";

export default function Hero() {
  return (
    <section
      id="top"
      // The bottom padding is an optical correction, not a layout one: a block
      // centred by measurement reads as sitting low, because the eye weights
      // the empty space above it more heavily than the space below. 7% of the
      // viewport lifts it to where it looks centred. The scroll cue is
      // positioned against the section edge and so is unaffected.
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-ink pb-[7svh]"
    >
      <div className="container-rail relative z-10">
        <h1
          className={`font-display ${HEADLINE_SIZE} font-extrabold uppercase leading-[0.84] tracking-[-0.035em]`}
        >
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        {/* A rule the full width of the headline, then the tagline beneath it.
            The rule runs the whole measure rather than filling the gap beside
            the tagline, so it reads as the underline of the name — it closes
            the lockup off at the same width the type sets, and the line below
            it starts again from the left rail.

            Decorative, so a <span> rather than an <hr>: an <hr> is a semantic
            break between sections of content, which this is not, and it would
            announce itself to a screen reader in the middle of the name. */}
        <span
          aria-hidden="true"
          className="mt-7 block h-px w-full bg-bone/20 sm:mt-9"
        />

        <p className="mt-5 text-xs uppercase tracking-[0.32em] text-bone/65 sm:mt-6 sm:text-sm">
          {hero.tagline}
        </p>
      </div>

      {/* Scroll cue, centred on the screen — label and stroke both. */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-7 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-bone/50 opacity-0 [animation-delay:140ms]"
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
