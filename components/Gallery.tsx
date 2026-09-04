import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { blurProps } from "@/content/blur";
import { visuals } from "@/content/site";

export default function Gallery() {
  return (
    <section id="visuals" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="01 — Visuals"
          heading={visuals.heading}
          subheading={visuals.subheading}
        />

        {/* CSS multi-column masonry. Each image keeps its natural aspect ratio
            (rendered via next/image with its real width/height), so nothing is
            cropped or distorted — tiles simply flow into 2 columns on mobile
            and 3 on larger screens. */}
        <div className="columns-2 [column-gap:0.75rem] sm:columns-3 sm:[column-gap:1rem]">
          {visuals.images.map((img, i) => (
            <Reveal
              key={img.id}
              delay={i * 60}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              {img.src ? (
                <div className="group relative overflow-hidden rounded-lg bg-surface">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    // Derived from the actual masonry geometry, not estimated.
                    // `33vw` was 37% wider than a tile really is, and the
                    // browser believed it: it fetched a 640px file for a 347px
                    // slot. The container is max-w-6xl (1152px) with px-6 /
                    // sm:px-8 / lg:px-10 gutters, 2 columns and a 12px gap
                    // below 640px, 3 columns and a 16px gap above it — so a
                    // tile is (content width − gaps) ÷ columns, which is what
                    // each clause below spells out. Keep these in step with the
                    // column/gap/padding classes on the wrapper.
                    sizes="(min-width: 1232px) 347px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 96px) / 3), calc((100vw - 60px) / 2)"
                    // `eager`, deliberately, despite every tile starting below
                    // the fold. Chromium's lazy-loading miscomputes visibility
                    // for elements fragmented across a CSS multi-column
                    // container, and the last column here — two of the six
                    // photos on the 3-column desktop layout — was never
                    // fetched at all, at any scroll position or viewport
                    // height. (The 2-column mobile layout was unaffected,
                    // which is what gives the cause away.) Eager loading side-
                    // steps the bug; `fetchPriority="low"` then keeps these off
                    // the critical path, so the hero still paints first.
                    loading="eager"
                    fetchPriority="low"
                    {...blurProps(img.src)}
                    className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  {/* Hover veil for a touch of polish. Decorative only. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>
              ) : (
                <Placeholder index={i} label={img.label} />
              )}
            </Reveal>
          ))}
        </div>

        {/* Understated link through to the full gallery page. */}
        <Reveal className="mt-10 sm:mt-12">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 border-b border-line pb-1 text-sm font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:border-accent hover:text-bone"
          >
            View more
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Styled fallback tile shown when an image has no `src` yet.
 * Uses a subtle diagonal texture + the accent so the grid always reads as
 * intentional design rather than a broken image.
 */
function Placeholder({ index, label }: { index: number; label: string }) {
  return (
    <div className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg bg-surface p-4">
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
