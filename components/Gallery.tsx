import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { blurProps } from "@/content/blur";
import { gallery } from "@/content/site";

/** An image at least this wide relative to its height leaves the column and
 *  runs the width of the screen. Derived from the photo itself rather than
 *  hard-coded per tile, so swapping a portrait for a landscape re-lays-out on
 *  its own. */
const WIDE_RATIO = 1.5;

/* Widths the browser should actually fetch. The content column is 8 of 12 with
   a 2.5rem gap inside a rail that is 4rem either side, so at 1440 it is ~860px
   and a half tile in it is ~420px. The panorama is a different case: it spans
   the viewport, so it is 100vw everywhere. Slight over-estimates on purpose —
   an image fetched one size too large is a rounding error; one fetched too
   small is visibly soft. */
const HALF_SIZES =
  "(min-width: 1024px) 440px, (min-width: 640px) calc((100vw - 5rem) / 2), 100vw";

/**
 * Gallery.
 *
 * The photos are three specific shapes — two 1708x2560 portraits and one
 * 2560x1044 panorama — and the old layout ignored that, pouring all three into
 * equal rounded tiles so the panorama carried the same visual weight as a
 * portrait and none of them looked like a decision.
 *
 * Here the panorama gets what its 2.45:1 ratio is for: it is not in the grid at
 * all. It sits between this section and the next, spanning the screen, and it
 * is the only divider on the site — a break made out of the band's own material
 * instead of a hairline borrowed from a newspaper. That one photograph is where
 * the page spends its boldness, so everything around it is kept quiet.
 *
 * Which photo that is comes from the data, not from a hard-coded index: any
 * image wider than WIDE_RATIO leaves the grid. Putting a second panorama in
 * content/site.ts gives you a second hinge with no code change.
 *
 * (An earlier attempt kept it inside the grid and broke it out with
 * `width: 100vw; margin-inline: calc(50% - 50vw)`. That formula centres a
 * viewport-wide box on its *parent's* centre, which only equals the viewport's
 * centre when the parent is itself centred — this content column is the right
 * eight of twelve, so the photo landed 225px off the right edge of the page.
 * Taking it out of the grid is both the correct fix and the better structure.)
 *
 * The second portrait is dropped by 3rem from `lg` up. A pair of identical
 * portraits set level reads as a contact sheet; offsetting one makes it a
 * composition. On phones both break their gutter and run to the screen edge —
 * a 24px margin around a photo on a 390px screen spends 12% of the width on
 * nothing.
 */
export default function Gallery() {
  const inGrid = gallery.images.filter((i) => i.width / i.height < WIDE_RATIO);
  const hinges = gallery.images.filter((i) => i.width / i.height >= WIDE_RATIO);

  return (
    <>
      <Section id="gallery" heading={gallery.heading} lede={gallery.subheading}>
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-y-12">
          {inGrid.map((img, i) => (
            <figure key={img.id} className={`group ${i === 1 ? "lg:mt-12" : ""}`}>
              {img.src ? (
                <>
                  <div className="relative -mx-6 overflow-hidden bg-surface sm:mx-0">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes={HALF_SIZES}
                      loading="lazy"
                      fetchPriority="low"
                      {...blurProps(img.src)}
                      // Brightness, not scale. A photo that grows on hover is
                      // the gesture every card grid on the web makes; one that
                      // comes up slightly looks like a light being brought up
                      // on it, which is at least about this subject.
                      className="h-auto w-full brightness-[0.88] transition-[filter] duration-500 ease-out group-hover:brightness-100"
                    />
                  </div>
                  <figcaption className="note mt-4">{img.label}</figcaption>
                </>
              ) : (
                <Placeholder index={i} label={img.label} />
              )}
            </figure>
          ))}
        </div>

        <div className="mt-10 sm:mt-16">
          <Link
            href="/gallery"
            // The padding is the tap target — 44px of height on a link whose
            // text is 16px tall — and the negative margin keeps it from moving
            // anything around it.
            className="-my-3 inline-block py-3 text-bone underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-stage focus-visible:decoration-stage"
          >
            See the rest of the gallery
          </Link>
        </div>
      </Section>

      {hinges.map(
        (img) =>
          img.src && (
            <figure key={img.id} className="w-full">
              {/* Recomposed for the device, not resized for it. At 2.45:1 this
                  photograph is the boldest thing on the desktop page and a
                  159px-tall strip on a phone — the same asset arriving as the
                  weakest element in the layout instead of the strongest.

                  3:2 is not a taste call, it is what the frame holds. A centre
                  crop keeps `target ÷ 2.45` of the width: 4:5 keeps 33% and
                  cuts the band from four people to two, 5:4 keeps 51% and
                  still clips the outer two at the shoulder, 3:2 keeps 61% and
                  holds all four with room around them. That renders 390x260 on
                  a phone — 31% of the screen against 19% before. From `sm` up
                  the photograph returns to its own ratio, untouched. */}
              <div className="relative aspect-[3/2] bg-surface sm:aspect-auto">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="100vw"
                  loading="lazy"
                  fetchPriority="low"
                  {...blurProps(img.src)}
                  className="h-full w-full object-cover object-center sm:h-auto"
                />
              </div>
              <figcaption className="container-rail note mt-4">
                {img.label}
              </figcaption>
            </figure>
          )
      )}
    </>
  );
}

/**
 * Styled fallback shown when an image has no `src` yet, so a missing photo
 * still reads as a deliberate slot rather than as a broken page.
 */
function Placeholder({ index, label }: { index: number; label: string }) {
  return (
    <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-surface p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #f5f3ef 0, #f5f3ef 1px, transparent 1px, transparent 12px)",
        }}
      />
      <span className="note relative">{String(index + 1).padStart(2, "0")}</span>
      <span className="relative font-display text-base font-semibold text-bone">
        {label}
      </span>
    </div>
  );
}
