import HeroVideo from "@/components/HeroVideo";
import { hero } from "@/content/site";

/**
 * Hero: the name as a two-line stacked lockup over a drone pass of the stage.
 *
 * The two lines are rendered as separate blocks at the same font size, with
 * `leading-[0.82]` closing the gap between them so "MAYMUN" and "COLLECTIVE"
 * read as one mass rather than two sentences. The size is driven by the longer
 * line: `clamp()` is tuned so COLLECTIVE lands just inside the container gutter
 * at every width, which is what makes the block feel sized *to* the hero
 * instead of floating in it.
 *
 * The headline carries no animation delay on purpose. It is the LCP element, so
 * every millisecond before it is opaque is a millisecond of LCP; the tagline and
 * scroll cue keep a stagger behind it. See the note on `fade-up` in
 * tailwind.config.ts for the measurements.
 *
 * ── On the scrim ────────────────────────────────────────────────────────────
 * The footage has the collective's own wordmark on the stage screen, dead
 * centre, which is exactly where a left-aligned headline lands — left alone the
 * two would sit on top of each other and read as a mistake. So the scrim is
 * directional rather than a flat wash: near-solid at the left edge where the
 * type sits, thinning across to the right where the stage is left legible. The
 * headline gets a clean dark bed, the film still reads as film, and the two
 * wordmarks never compete.
 *
 * The other two gradients are structural: the top one keeps the nav readable
 * over whatever the video happens to be showing, and the bottom one dissolves
 * the section into the page background so the hand-off to Gallery stays as
 * smooth as it was before there was a video here.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden bg-ink"
    >
      <HeroVideo />

      {/* Directional scrim — heavy behind the type, open over the stage.
          Two stacked ink layers, so the darkness at any point is
          1 − (1−gradient)(1−flat). With the flat layer at 0.15 that puts the
          left edge near 0.87, the middle around 0.66 and the right about 0.40:
          enough for bone type on the left, light enough on the right that the
          film still reads as film rather than a grey wash. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/30"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/15" />
      {/* Keeps the fixed nav legible over the film. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/75 to-transparent"
      />
      {/* Top-left corner wash. The clip is cropped to avoid the stage's own
          wordmark, but the very tail of its lettering drifts through this one
          corner at the start of the loop. This buries it, and doubles as a bed
          for the nav's logo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[45%] w-[45%] bg-[radial-gradient(ellipse_at_top_left,theme(colors.ink)_0%,transparent_70%)]"
      />

      <div className="container-page relative z-10">
        <h1 className="animate-fade-up font-display text-[clamp(3.5rem,15.5vw,12rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] opacity-0">
          {hero.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-8 max-w-xl animate-fade-up text-lg text-bone/70 opacity-0 [animation-delay:120ms] sm:mt-10 sm:text-xl">
          {hero.tagline}
        </p>
      </div>

      {/* Bottom fade into the page background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink"
      />

      {/* Scroll cue */}
      <a
        href="#gallery"
        className="group absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-bone/60 opacity-0 [animation-delay:260ms]"
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
