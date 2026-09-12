import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { blurProps } from "@/content/blur";
import { gallery } from "@/content/site";

/** An image at least this wide relative to its height takes the full row
 *  instead of sharing it. Derived from the photo itself rather than hard-coded
 *  per tile, so swapping a portrait for a landscape re-lays-out on its own. */
const WIDE_RATIO = 1.5;

// A half-width tile at each breakpoint, and a full-width one. Both spell out
// (content width − gaps) ÷ columns for the layout below: a max-w-6xl (1152px)
// container with px-6 / sm:px-8 / lg:px-10 gutters, one column below 640px and
// two above it, with a 16px gap. Keep these in step with the grid classes.
const HALF_SIZES =
  "(min-width: 1232px) 528px, (min-width: 1024px) calc((100vw - 96px) / 2), (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 48px)";
const FULL_SIZES =
  "(min-width: 1232px) 1072px, (min-width: 1024px) calc(100vw - 80px), (min-width: 640px) calc(100vw - 64px), calc(100vw - 48px)";

export default function Gallery() {
  return (
    <section id="gallery" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="01 — Gallery"
          heading={gallery.heading}
          subheading={gallery.subheading}
        />

        {/* An explicit two-column grid rather than the CSS multi-column masonry
            this section used to use. With three photos, column balancing put
            them at unrelated sizes; a grid lets the two portraits — which share
            an identical 1708x2560 ratio — sit level as a pair, with the wide
            crowd shot spanning the row beneath.

            Dropping multi-column also means `loading="lazy"` is safe again.
            Chromium fails to load images stranded in the trailing column of a
            multi-column container, which is why these were previously forced
            eager; in a grid they lazy-load correctly, verified at both
            breakpoints. */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {gallery.images.map((img, i) => {
            const wide = img.width / img.height >= WIDE_RATIO;
            return (
              <Reveal
                key={img.id}
                delay={i * 80}
                className={wide ? "sm:col-span-2" : undefined}
              >
                {img.src ? (
                  <div className="group relative h-full overflow-hidden rounded-lg bg-surface">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes={wide ? FULL_SIZES : HALF_SIZES}
                      loading="lazy"
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
            );
          })}
        </div>

        {/* Understated link through to the full gallery page. */}
        <Reveal className="mt-10 sm:mt-12">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 border-b border-line pb-1 text-sm font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:border-accent hover:text-bone"
          >
            See more
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
