import { hero } from "@/content/site";

/**
 * Hero: the name as a two-line stacked lockup over a still of the stage.
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
 * ── On the two wordmarks ────────────────────────────────────────────────────
 * The photograph has the collective's own wordmark on the stage LED screen,
 * large and dead centre, and the site's headline is the same two words. They
 * cannot overlap — a headline slicing through the backdrop's "COLLECTIVE" reads
 * as a bug, not a design. The gold lettering ends at 47% of the frame's height,
 * so on landscape the section anchors its content to the bottom and the
 * headline is sized to clear it: `clamp(3.25rem,10.5vw,8rem)` keeps the top of
 * "MAYMUN" below that at every landscape width. It used to be 15.5vw, which
 * cut straight through the backdrop. Stacked rather than overlapping, the
 * repetition reads as an echo — the banner they play under, then their name.
 *
 * The headline carries no animation delay on purpose. It is the LCP element, so
 * every millisecond before it is opaque is a millisecond of LCP; the tagline and
 * scroll cue keep a stagger behind it. See the note on `fade-up` in
 * tailwind.config.ts for the measurements.
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
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-24 sm:pb-28 [@media(max-aspect-ratio:1/1)]:justify-center [@media(max-aspect-ratio:1/1)]:pt-[75vw]"
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
          1 − (1−gradient)(1−flat). The gradient runs bottom-to-top rather than
          left-to-right: what has to stay legible is the type in the lower half,
          and what is worth showing is the lit stage above it. With the flat
          layer at 0.20 that puts the foot of the section near 0.88 and the top
          around 0.36 — enough to sit the backdrop's lettering back into the
          photograph without flattening the stage lights into grey. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/55 to-ink/20"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/20" />
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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-ink/75 to-ink"
      />

      <div className="container-page relative z-10">
        <h1 className="animate-fade-up font-display text-[clamp(3.25rem,10.5vw,8rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] opacity-0">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up text-lg text-bone/70 opacity-0 [animation-delay:120ms] sm:mt-8 sm:text-xl">
          {hero.tagline}
        </p>
      </div>

      {/* Scroll cue */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-bone/60 opacity-0 [animation-delay:260ms]"
        aria-label={`${hero.scrollCue} to gallery`}
      >
        <span className="text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-bone">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-10 w-px animate-pulse bg-gradient-to-b from-bone/60 to-transparent"
        />
      </a>
    </section>
  );
}
