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

/* ── The lockup ────────────────────────────────────────────────────────────
 * Both lines are justified to the same measure, and they get there at
 * different weights rather than at the same one. Measured at 200px with this
 * tracking, a capital MAYMUN is 4.511x its font-size wide at weight 800 and
 * 4.266x at 500; COLLECTIVE is 5.581x at 800 and 5.388x at 500. Setting the
 * name at 800 and the qualifier at 500, each divided by its own factor, fills
 * the measure twice over and makes the heavier word the larger one — 291px
 * against 244px at a 1440 viewport. Two lines of identical weight and size was
 * the type acting as a delivery vehicle; this is the type doing the work.
 *
 * The divisors carry ~2% slack over the measured factors, which absorbs the
 * scrollbar that 100vw counts and the content box does not.
 *
 * The vh ceilings are in the same 4.60 : 5.49 proportion as the divisors, so
 * on a short, wide viewport the two lines shrink together and stay flush
 * instead of one of them clipping first. 37vh rather than 30: at 30 the cap bound at
 * both 1440x900 and 1920x1080 — the two most ordinary laptop sizes — and the
 * lockup stopped 94px short of the right gutter while sitting 64px from the
 * left, which reads as a mistake rather than as a margin. At 37 the width term
 * governs at every ordinary ratio and the cap only engages on genuinely short
 * viewports, which is what it is for.
 */
const NAME_SIZE =
  "text-[min(calc((100vw-3rem)/4.60),37vh)] sm:text-[min(calc((100vw-4rem)/4.60),37vh)] lg:text-[min(calc((100vw-8rem)/4.60),37vh)]";
const QUALIFIER_SIZE =
  "text-[min(calc((100vw-3rem)/5.49),31vh)] sm:text-[min(calc((100vw-4rem)/5.49),31vh)] lg:text-[min(calc((100vw-8rem)/5.49),31vh)]";

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
        {/* Tracking is set per line, not on the h1. `letter-spacing` in `em`
            resolves against the element's own font-size and then inherits as
            that computed pixel value, so one declaration on the parent would
            give both lines the same px tracking despite their different sizes
            — which is what made an earlier version of this lockup overflow. */}
        <h1 className="font-display uppercase leading-[0.84]">
          <span
            className={`block ${NAME_SIZE} font-extrabold tracking-[-0.035em]`}
          >
            {hero.titleLines[0]}
          </span>
          <span
            className={`block ${QUALIFIER_SIZE} font-medium tracking-[-0.035em]`}
          >
            {hero.titleLines[1]}
          </span>
        </h1>

        {/* The line the collective actually leads with, in the three languages
            it works in. It was set at 11px in tracked-out capitals, which is
            the one piece of template chrome left on the site and made the most
            characteristic thing the brand says the smallest thing on screen.
            Sentence case, at a size you read rather than scan, in the body face
            so it reads as a voice under the logotype rather than as part of it.

            The rule that used to sit above it is gone. It encoded nothing — it
            was a line drawn under the name because the name looked like it
            wanted one. */}
        <p className="mt-8 text-lg text-bone/60 sm:mt-10 sm:text-xl lg:text-2xl">
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
        <span className="text-sm transition-colors group-hover:text-bone">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-8 w-px bg-gradient-to-b from-bone/50 to-transparent"
        />
      </a>
    </section>
  );
}
