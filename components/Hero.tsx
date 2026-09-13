import { hero } from "@/content/site";

/**
 * Hero: the name set as a centred poster over a still of the stage.
 *
 * ── On the backdrop ─────────────────────────────────────────────────────────
 * This was a looping drone video until it turned out not to play reliably on
 * real devices. The still does everything the loop was there for at a fraction
 * of the weight — 126 KB against 843 KB — and there is no client component, no
 * effect and no playback left to fail.
 *
 * It is a hand-rolled <picture> rather than next/image so the format ladder is
 * explicit and the file is static: AVIF (126 KB) first, WebP (158 KB) next,
 * JPEG (246 KB) last, one request, chosen before any script runs and found by
 * the preload scanner immediately.
 *
 * ── Why centred ─────────────────────────────────────────────────────────────
 * The photograph is a head-on, symmetrical shot: the arch, the LED backdrop and
 * the barrier all mirror around the centre line. A left-aligned headline over
 * it fought that symmetry and left the right-hand third of the frame empty.
 * Centring the type puts it on the same axis as the stage, so the photograph
 * and the words read as one composition rather than two layers that happen to
 * overlap.
 *
 * ── On the two wordmarks ────────────────────────────────────────────────────
 * The photograph has the collective's own hand-drawn wordmark on the LED
 * screen, and the headline is the same two words. They cannot overlap — a
 * headline slicing through the backdrop's "COLLECTIVE" reads as a bug. The gold
 * lettering ends at 47% of the frame's height, so on landscape the content is
 * anchored to the foot of the section and the headline is sized to clear it.
 *
 * What makes the repetition work rather than merely not-break is the size gap:
 * the headline runs nearly the full width of the viewport, so the hand-drawn
 * mark above it reads as what it is — a banner in a photograph — while the set
 * type reads as the page's own voice. Shrinking the headline is what would make
 * it look like a mistake.
 *
 * The tagline sits under the name as a letterspaced kicker rather than above
 * it: above, it landed in the gap between the two wordmarks with nowhere to
 * breathe.
 *
 * ── On the headline not fading in ───────────────────────────────────────────
 * It used to. The problem is that Chrome will not treat an element as an LCP
 * candidate while it is transparent, so a fade — however short — pushes LCP out
 * by the length of the animation, and on this page it pushed it far enough that
 * a 20px-tall tagline became the largest *eligible* element and LCP ended up
 * gated on Inter arriving instead. Painting the headline immediately makes the
 * biggest thing on the page also the earliest: LCP collapses onto FCP.
 * The tagline and scroll cue keep their stagger; nothing is gated on them.
 */
export default function Hero() {
  return (
    // Landscape pins the type to the foot of the section, below the backdrop's
    // lockup. Portrait instead centres it in whatever is left under the photo
    // band: the band is 4:3, so it is exactly 75vw tall, and padding the
    // section by that much turns "centre the content" into "centre it in the
    // space the photograph does not occupy".
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-28 [@media(max-aspect-ratio:1/1)]:justify-center [@media(max-aspect-ratio:1/1)]:pb-36 [@media(max-aspect-ratio:1/1)]:pt-[75vw]"
    >
      {/* On a landscape viewport the photograph fills the section. On a portrait
          one it cannot: covering a 9:16 screen with a 16:9 frame shows only its
          middle sliver, which cuts the backdrop's lockup in half — the one thing
          in the shot that must not be cropped. So on portrait it becomes a 4:3
          band across the top instead, dissolving into the page, with the type
          below it on clean ink. The photograph keeps its shape either way. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full [@media(max-aspect-ratio:1/1)]:aspect-[4/3] [@media(max-aspect-ratio:1/1)]:h-auto"
      >
        <picture>
          <source srcSet="/images/hero-stage.avif" type="image/avif" />
          <source srcSet="/images/hero-stage.webp" type="image/webp" />
          <img
            src="/images/hero-stage.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full select-none object-cover object-center"
          />
        </picture>
        {/* Feathers the foot of the band into the page on portrait, so it reads
            as a photograph the page fades out of rather than a pasted-in strip.
            Harmless on landscape, where it sits off the bottom of the section. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink [@media(min-aspect-ratio:1/1)]:hidden" />
      </div>

      {/* Scrim. Two stacked ink layers, so the darkness at any point is
          1 − (1−gradient)(1−flat). The gradient runs bottom-to-top: what has to
          stay legible is the type in the lower half, and what is worth showing
          is the lit stage above it. With the flat layer at 0.18 that puts the
          foot of the section near 0.93 and the top around 0.33 — dark enough
          under the type that the headline never has to fight a stage light,
          open enough at the top that the arch and the LED wall keep colour. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/62 to-ink/18"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/18" />
      {/* Keeps the fixed nav legible over the brightest part of the shot. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent"
      />
      {/* Bottom fade into the page background — the seam into Gallery. Deeper
          than the video's was: a still has no motion to pull the eye past a
          hard edge, so it has to actually dissolve. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-ink/85 to-ink"
      />

      {/* Wider than `container-page`, with a tighter gutter: the headline is
          meant to run to the edges of the viewport, not to sit inside the same
          measure as body copy. */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 text-center sm:px-8">
        <h1 className="font-display text-[clamp(2.75rem,11.8vw,10rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.035em] [@media(max-aspect-ratio:1/1)]:text-[14vw]">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mx-auto mt-6 animate-fade-up text-xs uppercase tracking-[0.32em] text-bone/55 opacity-0 [animation-delay:120ms] sm:mt-8 sm:text-sm">
          {hero.tagline}
        </p>
      </div>

      {/* Scroll cue */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-5 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-bone/50 opacity-0 [animation-delay:260ms]"
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
