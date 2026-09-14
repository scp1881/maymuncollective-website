import HeroMotionGuard from "@/components/HeroMotionGuard";
import { hero } from "@/content/site";

/**
 * Bump when scripts/build-hero-video.sh is re-run. The encodes keep stable
 * filenames, so without this a new cut is indistinguishable from the old one to
 * any cache holding the previous bytes — and at 5 MB that is not a mistake you
 * want people to have to clear their cache to escape. It is also what lets
 * next.config.mjs pin /video as immutable for a year.
 */
const CUT = "3";

/**
 * Hero: the name set bottom-left over the drone film of the stage.
 *
 * ── Playback needs no JavaScript ────────────────────────────────────────────
 * This is the third attempt at a video here, and the first two failed in the
 * same way: they were clever. The source was withheld until `requestIdleCallback`
 * fired and then attached by an effect, to keep the download off the critical
 * path — which meant that if anything went wrong in that chain, visitors got a
 * still frame forever, and that is exactly what happened.
 *
 * So the element is now plain HTML: `<source>` children in the markup,
 * `autoplay muted loop playsinline`. No effect, no `src` assignment, nothing
 * between the server and the first frame. A browser with JavaScript disabled
 * entirely still plays it. (There is one client component here — the
 * reduced-motion guard — but it can only ever STOP the film, never start it,
 * so a failure there leaves playback untouched.) The cost
 * is that the film now competes for bandwidth from the start rather than
 * waiting its turn; the measured effect on FCP/LCP is in the README, and it is
 * smaller than it sounds because the headline is text and its font is 4.6 KB.
 *
 * `muted` is required for autoplay everywhere and the film is silent anyway.
 * iOS Low Power Mode still refuses autoplay — in that case the poster stays,
 * which is a fine result and the reason the poster is the film's own first
 * frame rather than a designed still.
 *
 * ── Two framings ────────────────────────────────────────────────────────────
 * A 16:9 film `object-cover`-ed into a 9:16 phone shows about a quarter of its
 * width — here, a sliver of stage floor with the band and the backdrop both cut
 * away, upscaled 2.8x. So phones get a true 9:16 centre crop of the same
 * footage, full length, at native height.
 *
 * The `media` attribute on `<source>` does the switching, which works in
 * Chromium and Safari. The wide pair is listed FIRST and is itself
 * media-qualified, so a browser that ignores `media` on media elements falls
 * back to the wide film everywhere rather than stretching the phone crop across
 * a desktop — the safe direction to fail in.
 *
 * The poster is a <picture> behind the video rather than the `poster`
 * attribute, because `poster` takes one URL and cannot be art-directed; this
 * way each orientation gets a first frame that matches its own crop.
 *
 * ── Why the headline works over this footage ────────────────────────────────
 * The film is a drone orbit, and the LED wall carries the collective's own
 * hand-drawn wordmark. For most of the orbit that wordmark sits right of centre
 * while the band holds the left, so the page's headline takes the left and the
 * two never stack. The scrim below is measured against the brightest moment of
 * the whole 17 seconds, not against frame one.
 *
 * Nothing in here fades in: Chrome will not treat a transparent element as an
 * LCP candidate, so a fade on the headline costs LCP the length of the
 * animation. The scroll cue keeps its fade; nothing is gated on that.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink pb-24 sm:pb-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <picture>
          <source
            media="(max-aspect-ratio: 1/1)"
            srcSet={`/video/hero-poster-tall.webp?v=${CUT}`}
            type="image/webp"
          />
          <img
            src={`/video/hero-poster-wide.webp?v=${CUT}`}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full select-none object-cover"
          />
        </picture>
        <video
          id="hero-film"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            media="(min-aspect-ratio: 1/1)"
            src={`/video/hero-wide.webm?v=${CUT}`}
            type="video/webm"
          />
          <source
            media="(min-aspect-ratio: 1/1)"
            src={`/video/hero-wide.mp4?v=${CUT}`}
            type="video/mp4"
          />
          <source
            media="(max-aspect-ratio: 1/1)"
            src={`/video/hero-tall.webm?v=${CUT}`}
            type="video/webm"
          />
          <source
            media="(max-aspect-ratio: 1/1)"
            src={`/video/hero-tall.mp4?v=${CUT}`}
            type="video/mp4"
          />
        </video>
        {/* Reduced motion, as a pure enhancement — it only ever stops the film,
            never starts it. See components/HeroMotionGuard. */}
        <HeroMotionGuard />
      </div>

      {/* Scrim. Darkness at any point is 1 − Π(1−layer).

          Tuned against the film rather than a single frame: the composite was
          sampled at eight points across the 17s orbit and the worst case is
          what these numbers answer to. The vertical layer is a sandwich, not a
          ramp — heavy at the foot (0.88) under the type, heavy again at the top
          (0.70) because the clip opens on blown-out daylight sky, and light
          across the middle (0.50) where the LED wall is. The left-to-right wash
          deepens only the side the headline is on, so the type gets its bed
          without the film paying for it on the right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/50 to-ink/70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/12 to-transparent [@media(max-aspect-ratio:1/1)]:hidden"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/15" />
      {/* Keeps the fixed nav legible over the brightest part of the orbit. */}
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
