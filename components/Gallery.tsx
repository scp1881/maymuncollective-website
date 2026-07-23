import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { visuals } from "@/content/site";

// Maps the `span` value from content to grid-span classes (masonry-like grid).
const spanClasses: Record<string, string> = {
  tall: "sm:row-span-2",
  wide: "sm:col-span-2",
  square: "",
};

export default function Gallery() {
  return (
    <section id="visuals" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="01 — Visuals"
          heading={visuals.heading}
          subheading={visuals.subheading}
        />

        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:auto-rows-[260px]">
          {visuals.images.map((img, i) => (
            <Reveal
              key={img.id}
              delay={i * 60}
              className={`group relative overflow-hidden rounded-lg bg-surface ${
                spanClasses[img.span] ?? ""
              }`}
            >
              {img.src ? (
                <>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </>
              ) : (
                <Placeholder index={i} label={img.label} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Styled fallback tile shown until a real image `src` is provided.
 * Uses a subtle diagonal texture + the accent so the grid always reads as
 * intentional design rather than a broken image.
 */
function Placeholder({ index, label }: { index: number; label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4">
      {/* Faint diagonal hatch texture. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #f5f3ef 0, #f5f3ef 1px, transparent 1px, transparent 12px)",
        }}
      />
      <span className="relative font-display text-sm font-medium text-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="font-display text-base font-semibold text-bone">
          {label}
        </span>
      </div>
    </div>
  );
}
