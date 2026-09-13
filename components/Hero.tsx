import { hero } from "@/content/site";

/**
 * Hero: the photograph carries the name; the page adds only a tagline.
 *
 * ── Why there is no visible headline ────────────────────────────────────────
 * The stage's LED screen shows the collective's own hand-drawn wordmark, large
 * and dead centre. Setting the same two words underneath it in a grotesque said
 * everything twice, and every version of that — left-aligned, centred, sized to
 * clear the lettering — was really just damage control on the repetition. So
 * the set headline is gone and the photograph's own lockup is the title.
 *
 * The <h1> itself is NOT gone, only its pixels. It carries `sr-only`, so the
 * document still has exactly one first-level heading. That matters more than it
 * looks: the photograph is decorative (`alt=""`, as it must be — it is a
 * backdrop, not content), so without this element a screen reader would meet a
 * page with no name at all, and a search result would have nothing to show
 * beneath the title tag. Deleting the element rather than hiding it is the one
 * change here that would actually break something.
 *
 * ── On the backdrop ─────────────────────────────────────────────────────────
 * This was a looping drone video until it turned out not to play reliably on
 * real devices. The still does everything the loop was there for at a fraction
 * of the weight, with no client component, no effect and no playback to fail.
 * It is a hand-rolled <picture> so the format ladder is explicit and the file
 * static: AVIF first, WebP next, JPEG last, one request, chosen before any
 * script runs and found by the preload scanner immediately.
 *
 * The lockup is now the only thing naming the collective on this screen, so it
 * must never be cropped. Measured off the frame, the gold spans x 528–1344 of
 * 1920, which needs 864px of centred width — so any container down to a 4:5
 * aspect still shows it whole. Landscape fills the section; portrait gets a 6:7
 * band, which is as tall as the crop allows with margin to spare and covers far
 * more of a phone screen than the 4:3 band it replaces.
 *
 * The crop is centred on the lockup rather than on the frame. The gold is not
 * quite centred in the photograph — its midpoint is x 936 of 1920, 48.75% —
 * and at the portrait band's aspect that 1.25% offset is the difference
 * between 31px of clearance on the left and 55px on both sides.
 *
 * The scrim is lighter than it was, because it no longer has to be a bed for
 * bone type at 10vw — only to keep the nav legible and to hand off to the page.
 *
 * ── On the tagline not fading in ────────────────────────────────────────────
 * With the headline gone it is the largest text on the first screen, which
 * makes it the LCP element — and Chrome will not treat a transparent element as
 * an LCP candidate, so a fade on it pushed LCP from 672ms out to ~1150ms,
 * gated on Inter arriving. It paints immediately instead. The scroll cue keeps
 * its fade; nothing is gated on that.
 */
export default function Hero() {
  return (
    // Landscape pins the tagline to the foot of the section. Portrait centres
    // it in what is left under the photo band: the band is 6:7, so it is
    // 100/6*7 = 116.67vw tall, and padding the section by that much turns
    // "centre the content" into "centre it in the space the photograph does
    // not occupy".
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-32 [@media(max-aspect-ratio:1/1)]:justify-center [@media(max-aspect-ratio:1/1)]:pb-32 [@media(max-aspect-ratio:1/1)]:pt-[116.67vw]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full [@media(max-aspect-ratio:1/1)]:aspect-[6/7] [@media(max-aspect-ratio:1/1)]:h-auto"
      >
        <picture>
          <source srcSet="/images/hero-stage.avif" type="image/avif" />
          <source srcSet="/images/hero-stage.webp" type="image/webp" />
          <img
            src="/images/hero-stage.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full select-none object-cover object-[48.75%_50%]"
          />
        </picture>
        {/* Feathers the foot of the band into the page on portrait, so it reads
            as a photograph the page fades out of rather than a pasted-in strip.
            Harmless on landscape, where it sits off the bottom of the section. */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-ink [@media(min-aspect-ratio:1/1)]:hidden" />
      </div>

      {/* Scrim. Two stacked ink layers, so the darkness at any point is
          1 − (1−gradient)(1−flat). It runs bottom-to-top and is deliberately
          light: with the headline gone there is no large type to bed, and the
          lockup in the photograph is now the thing worth seeing. With the flat
          layer at 0.10 this leaves the top around 0.19 — barely touched — and
          the foot near 0.86, which is all the tagline needs. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/38 to-ink/10"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/10" />
      {/* Keeps the fixed nav legible over the brightest part of the shot. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent"
      />
      {/* Bottom fade into the page background — the seam into Gallery. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent via-ink/85 to-ink"
      />

      <div className="container-page relative z-10 text-center">
        {/* Present for the document outline and for screen readers; the
            photograph behind it is what a sighted visitor reads. */}
        <h1 className="sr-only">{hero.titleLines.join(" ")}</h1>

        <p className="text-sm uppercase tracking-[0.34em] text-bone/70 sm:text-base">
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
