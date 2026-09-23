import { hero } from "@/content/site";

/**
 * Hero: the name, set large on the page's own ink. No backdrop.
 *
 * There was a film here, and a still before that. Both are gone — see the
 * README for the history, which is worth reading before anyone puts a
 * background back. What is left is deliberately plain: one block of type on the
 * flat page colour, set flush left against the page's own edge padding and
 * centred in the viewport, with the scroll cue on the same left rail so the
 * whole screen reads off a single vertical line.
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

        {/* Tagline on a rule that runs out to the right margin. The headline
            already draws a hard left edge and a ragged right one; this single
            hairline closes the block off and gives the empty half of the screen
            something to be, without adding another thing to read. */}
        <div className="mt-7 flex items-center gap-5 sm:mt-9 sm:gap-8">
          <p className="shrink-0 text-xs uppercase tracking-[0.32em] text-bone/65 sm:text-sm">
            {hero.tagline}
          </p>
          {/* Hidden on phones, where the tagline nearly fills the measure and
              what is left of the rule reads as a stray dash. */}
          <span aria-hidden="true" className="hidden h-px flex-1 bg-bone/15 sm:block" />
        </div>
      </div>

      {/* Scroll cue, on the same left rail as the type rather than centred, so
          the hero has exactly one vertical alignment. */}
      <a
        href="#gallery"
        className="group absolute bottom-7 left-6 z-10 flex w-fit animate-fade-up flex-col items-start gap-2 text-bone/50 opacity-0 [animation-delay:140ms] sm:left-8 lg:left-16"
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
