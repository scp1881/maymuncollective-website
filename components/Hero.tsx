import { hero } from "@/content/site";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* Subtle radial glow anchored bottom-left for depth. Purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-[-10rem] h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="container-page relative">
        <h1 className="animate-fade-up whitespace-pre-line font-display text-[clamp(3.25rem,13vw,10rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] opacity-0 [animation-delay:150ms]">
          {hero.title}
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up text-lg text-muted opacity-0 [animation-delay:350ms] sm:mt-8 sm:text-xl">
          {hero.tagline}
        </p>
      </div>

      {/* Bottom fade: dissolves the section (and its glow) into the page
          background so the hand-off to the Visuals section reads as a smooth
          gradient rather than a hard edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink"
      />

      {/* Scroll cue */}
      <a
        href="#visuals"
        className="group absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-muted opacity-0 [animation-delay:600ms]"
        aria-label={`${hero.scrollCue} to visuals`}
      >
        <span className="text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-bone">
          {hero.scrollCue}
        </span>
        <span
          aria-hidden="true"
          className="block h-10 w-px animate-pulse bg-gradient-to-b from-muted to-transparent"
        />
      </a>
    </section>
  );
}
