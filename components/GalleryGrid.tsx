"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { blurProps } from "@/content/blur";

/**
 * One tile. Either:
 *   - an image: `type: "image"`, `src` a file in /public, `poster` unused ("")
 *   - a video:  `type: "video"`, `src` an .mp4/.webm in /public and `poster` a
 *               still image. Leave `src: ""` to show the poster as a
 *               placeholder (with a play affordance and a "coming soon" state)
 *               until the real clip exists.
 *
 * `width`/`height` must be the real pixel dimensions of whichever file is shown
 * as the thumbnail — the masonry uses them to reserve the right space and hold
 * the aspect ratio.
 */
export type GalleryItem = {
  id: number;
  type: string;
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
};

type Item = GalleryItem;

/**
 * Masonry grid with an image/video lightbox.
 *
 * NOTE: currently unrendered. /gallery is a holding page while the real
 * collection is put together, so nothing mounts this today — it is kept, and
 * kept compiling, because it is the finished implementation for when that
 * lands. Pass it an `items` array and it works as before; see the note on
 * `galleryPage` in content/site.ts.
 */
export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  const active = items.find((it) => it.id === openId) ?? null;
  const close = useCallback(() => setOpenId(null), []);

  // Close on Escape and lock background scroll while the lightbox is open.
  useEffect(() => {
    if (openId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openId, close]);

  return (
    <>
      {/* Same CSS multi-column masonry as the homepage gallery: natural aspect
          ratios, no cropping, 2 columns on mobile and 3 on larger screens. */}
      <div className="columns-2 [column-gap:0.75rem] sm:columns-3 sm:[column-gap:1rem]">
        {items.map((item, i) => {
          const thumb = item.type === "video" ? item.poster : item.src;
          // The top of this grid IS the fold, so the first tile is the likely
          // LCP and gets fetched at high priority. Everything after it loads
          // eagerly but at low priority — eagerly because this grid uses the
          // same CSS multi-column masonry as the homepage, and Chromium's
          // lazy-loading strands images in the trailing column there (see the
          // note in Gallery.tsx); low priority so they still queue behind the
          // things that actually gate the first paint.
          const isLcp = i === 0;
          return (
            <div key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
              <button
                type="button"
                onClick={() => setOpenId(item.id)}
                aria-label={
                  item.type === "video" ? `Play video: ${item.alt}` : `View: ${item.alt}`
                }
                className="group relative block w-full overflow-hidden rounded-lg bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <Image
                  src={thumb}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  // Same masonry geometry as the homepage grid — see the note
                  // in Gallery.tsx. Must stay in step with the column, gap and
                  // padding classes on the wrapper above.
                  sizes="(min-width: 1232px) 347px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 96px) / 3), calc((100vw - 60px) / 2)"
                  priority={isLcp}
                  loading="eager"
                  {...(isLcp ? {} : { fetchPriority: "low" as const })}
                  {...blurProps(thumb)}
                  className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                {item.type === "video" && <PlayBadge />}
              </button>
            </div>
          );
        })}
      </div>

      {active && <Lightbox item={active} onClose={close} />}
    </>
  );
}

/** Play affordance shown over video tiles. */
function PlayBadge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/70 bg-ink/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-bone">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </span>
  );
}

/** Full-viewport viewer for a single image or video. */
function Lightbox({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        autoFocus
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-stage hover:text-stage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stage"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" fill="none" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Stop propagation so clicks on the media don't close the viewer. */}
      <div className="flex max-h-full max-w-5xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {item.type === "video" && item.src ? (
          <video
            src={item.src}
            poster={item.poster || undefined}
            controls
            autoPlay
            playsInline
            className="max-h-[85vh] w-auto max-w-full rounded-lg"
          />
        ) : (
          <>
            {/* Served through next/image rather than a bare <img>: a raw tag
                here pulled the full-resolution original (up to ~580 KB) on
                every open, where the optimizer delivers AVIF/WebP sized to the
                viewer's screen for a fraction of that. The blur preview is
                already cached from the thumbnail, so it fills the frame
                instantly while the large version arrives. */}
            <Image
              src={item.type === "video" ? item.poster : item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 1024px, 100vw"
              {...blurProps(item.type === "video" ? item.poster : item.src)}
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
            />
            {item.type === "video" && (
              <p className="mt-3 text-sm text-muted">Video coming soon</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
