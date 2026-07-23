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
        {hero.kicker && (
          <p className="eyebrow mb-6 animate-fade-up opacity-0 [animation-delay:100ms]">
            {hero.kicker}
          </p>
        )}

        <h1 className="animate-fade-up whitespace-pre-line font-display text-[clamp(3rem,12vw,9rem)] font-bold leading-[0.92] tracking-tightest opacity-0 [animation-delay:200ms]">
          {hero.title}
        </h1>

        <p className="mt-8 max-w-xl animate-fade-up text-lg text-muted opacity-0 [animation-delay:400ms] sm:text-xl">
          {hero.tagline}
        </p>

        {hero.intro && (
          <p className="mt-4 max-w-xl animate-fade-up text-base leading-relaxed text-muted/80 opacity-0 [animation-delay:500ms]">
            {hero.intro}
          </p>
        )}
      </div>

      {/* Scroll cue */}
      <a
        href="#visuals"
        className="group absolute inset-x-0 bottom-8 mx-auto flex w-fit animate-fade-up flex-col items-center gap-2 text-muted opacity-0 [animation-delay:700ms]"
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
