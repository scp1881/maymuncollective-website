import { hero } from "@/content/site";

/**
 * Hero: the name, set large on the page's own ink. No backdrop.
 *
 * There was a film here, and a still before that. Both are gone — see the
 * README for the history, which is worth reading before anyone puts a
 * background back. What is left is deliberately plain: one block of type on the
 * flat page colour, set flush left against the page's own edge padding: name,
 * then a rule the width of the name, then the tagline, each starting again from
 * the same left rail.
 *
 * ── Two compositions ──────────────────────────────────────────────────────
 * The type is sized by WIDTH (see Sizing), so how much of the screen it fills
 * depends entirely on the aspect ratio. On a laptop the lockup is ~43% of the
 * viewport height; on a phone the same lockup is ~19%, because the longest word
 * is ten characters and a 390px-wide screen caps it at about 60px. Measured on
 * an iPhone 14 viewport, that left 245px of air above it and 285px below — the
 * block read as stranded rather than placed, and no amount of enlarging fixes
 * it without breaking a word across lines.
 *
 * So the phone gets a different composition rather than a shrunken copy of the
 * desktop one. Below `sm` the lockup is anchored to the bottom and the scroll
 * cue joins it on the same left rail, so every element on the screen — the
 * wordmark included — hangs off one vertical line and all the negative space
 * collects in a single field above. At `sm` and up nothing changes: the lockup
 * is centred and the cue is centred on the viewport, which is what the wider
 * ratio wants. Verified pixel-identical to the previous layout at 1440x900,
 * 1920x1080, 1280x720, 768x1024 and 640x900.
 *
 * The `sm:pt-16 sm:pb-[calc(7svh+4rem)]` pair exists for short, wide viewports
 * — a phone held sideways is 844x390 — where the centred lockup used to run
 * underneath the fixed nav. The top padding reserves the nav's 4rem; the same
 * 4rem is added to the bottom so the net offset, and therefore the composition
 * on every ordinary screen, is exactly what it was before.
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
      // Phone: bottom-anchored, with pb-40 leaving the scroll cue room to sit
      // under the tagline on the same rail. From sm up: centred, where the 7svh
      // of bottom padding is an optical correction rather than a layout one — a
      // block centred by measurement reads as sitting low, because the eye
      // weights the empty space above it more heavily than the space below.
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-40 sm:justify-center sm:pt-16 sm:pb-[calc(7svh+4rem)]"
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

      {/* Scroll cue. On a phone it sits on the left rail as the last item in
          the stack, so the screen has exactly one alignment; from sm up it is
          centred on the viewport, where it belongs to the screen rather than to
          the lockup and is the one thing a visitor is meant to aim at. */}
      <a
        href="#gallery"
        className="group absolute bottom-7 left-6 right-auto z-10 flex w-fit animate-fade-up flex-col items-start gap-2 text-bone/50 opacity-0 [animation-delay:140ms] sm:inset-x-0 sm:left-0 sm:right-0 sm:mx-auto sm:items-center"
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
