import { hero } from "@/content/site";

/**
 * Hero: the name set bottom-left over a still of the stage.
 *
 * ── Why the headline works here and did not before ──────────────────────────
 * The previous frame put the collective's own hand-drawn wordmark dead centre
 * on the LED screen, so a set headline anywhere on the page said the same two
 * words twice, stacked. This frame is shot from the left: the band and the
 * IMAG screen fill the left two thirds and the backdrop's lockup sits over on
 * the right, at x 958–1735 of 1920. That separates the two horizontally — the
 * headline takes the left, the photograph's lockup keeps the right, and
 * neither crowds the other. It is the composition, not the type, that changed.
 *
 * The headline uses `container-page`, the same measure as every other section,
 * so its left edge lines up with the Gallery and Members headings below it
 * rather than floating at some hero-only margin.
 *
 * ── Two crops, because one cannot work ──────────────────────────────────────
 * Covering a 9:16 screen with a 16:9 frame shows a middle sliver about a
 * quarter of its width. Here that would keep the LED wall's lettering and throw
 * away the band — and a half-cut wordmark next to the page's own headline looks
 * like a mistake. So portrait gets its own cut: `hero-stage-tall` is the left
 * 950px of the frame, everything up to where the gold starts — the arch, the
 * IMAG screen, the band, the barrier, and no second wordmark at all. It runs as
 * a 7:8 band across the top with the type below it.
 *
 * <picture> picks exactly one of the two, before any script runs, so the crop a
 * visitor does not get costs them nothing.
 *
 * ── On the scrim ────────────────────────────────────────────────────────────
 * See the note beside the layers below. In short: landscape needs a real scrim
 * because the type sits *on* the photograph; portrait does not, because the
 * type sits under it on clean ink — so the landscape layers are hidden there
 * rather than dimming a photograph that needs no dimming. Getting that wrong is
 * what made the first pass at this frame look muddy on a phone.
 *
 * ── On nothing in here fading in ────────────────────────────────────────────
 * The headline is the LCP element and Chrome will not treat a transparent
 * element as an LCP candidate, so any fade on it costs LCP the length of the
 * animation — measured at +480ms when the tagline carried one. Both paint
 * immediately. The scroll cue keeps its fade; nothing is gated on that.
 */
export default function Hero() {
  return (
    // Landscape pins the type to the foot of the section. Portrait centres it
    // in what is left under the photo band: the band is 7:8, so it is
    // 100/7*8 = 114.29vw tall, and padding the section by that much turns
    // "centre the content" into "centre it in the space the photograph does
    // not occupy".
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-24 [@media(max-aspect-ratio:1/1)]:justify-center [@media(max-aspect-ratio:1/1)]:pb-28 [@media(max-aspect-ratio:1/1)]:pt-[114.29vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full [@media(max-aspect-ratio:1/1)]:aspect-[7/8] [@media(max-aspect-ratio:1/1)]:h-auto"
      >
        <picture>
          <source media="(max-aspect-ratio: 1/1)" srcSet="/images/hero-stage-tall.avif" type="image/avif" />
          <source media="(max-aspect-ratio: 1/1)" srcSet="/images/hero-stage-tall.webp" type="image/webp" />
          <source media="(max-aspect-ratio: 1/1)" srcSet="/images/hero-stage-tall.jpg" />
          <source srcSet="/images/hero-stage-wide.avif" type="image/avif" />
          <source srcSet="/images/hero-stage-wide.webp" type="image/webp" />
          <img
            src="/images/hero-stage-wide.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full select-none object-cover object-center"
          />
        </picture>
        {/* Portrait only. The type is below the band on clean ink, so all the
            photograph needs here is a whisper of ink to sit it into the page,
            and a feathered foot so it dissolves rather than ending on a line. */}
        <div className="absolute inset-0 bg-ink/12 [@media(min-aspect-ratio:1/1)]:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink [@media(min-aspect-ratio:1/1)]:hidden" />
      </div>

      {/* Scrim, landscape only — the type sits on the photograph there. Darkness
          at any point is 1 − Π(1−layer).

          This frame is shot in daylight with open sky in the top-left corner,
          the brightest thing in it by a wide margin, while the part worth seeing
          — the LED wall and its lockup — sits mid-right. So the vertical layer
          is a sandwich rather than a ramp: heavy at the foot (0.85) under the
          type, heavy again at the top (0.72) to put the sky and the trusses
          down, and light across the middle (0.45) where the wall is. A single
          ramp either blew out the sky or flattened the wall.

          The second layer is a left-to-right wash that only deepens the side the
          headline is on, so the type gets its bed without the photograph paying
          for it on the right. Bottom-left lands near 0.93, the lockup around
          0.53, the sky about 0.80. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/72 [@media(max-aspect-ratio:1/1)]:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/12 to-transparent [@media(max-aspect-ratio:1/1)]:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink/15 [@media(max-aspect-ratio:1/1)]:hidden"
      />
      {/* Keeps the fixed nav legible. Both orientations: the top of either crop
          is the brightest part of it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-ink/85 to-transparent"
      />
      {/* Bottom fade into the page background — the seam into Gallery. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-ink/80 to-ink"
      />

      <div className="container-page relative z-10">
        <h1 className="font-display text-[clamp(2.75rem,11.5vw,9.5rem)] font-extrabold uppercase leading-[0.84] tracking-[-0.035em] [@media(max-aspect-ratio:1/1)]:text-[13vw]">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-6 text-xs uppercase tracking-[0.32em] text-bone/60 sm:mt-7 sm:text-sm">
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
