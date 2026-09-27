"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Print from "@/components/Print";
import type { Photo } from "@/content/site";
import { ui } from "@/content/site";

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square">
      {direction === "left" ? <path d="M15 5l-7 7 7 7M8 12h13" /> : <path d="M9 5l7 7-7 7M16 12H3" />}
    </svg>
  );
}

/**
 * Where each photograph sits on the /gallery wall from lg up (12 columns), and
 * its frame. Phones stack everything in one column at the photo's own ratio,
 * except the two tall portraits, which crop to 4:5.
 */
const LAYOUT: Record<string, { span: string; ratio?: { sm: string; lg?: string }; sizes: string }> = {
  live: { span: "lg:col-span-5", ratio: { sm: "4 / 5", lg: "2 / 3" }, sizes: "(min-width: 1024px) 40vw, 100vw" },
  backstage: { span: "lg:col-span-4 lg:col-start-7 lg:mt-40", ratio: { sm: "4 / 5", lg: "2 / 3" }, sizes: "(min-width: 1024px) 32vw, 100vw" },
  crew: { span: "lg:col-span-12", sizes: "(min-width: 1536px) 1424px, 100vw" },
  room: { span: "lg:col-span-4", sizes: "(min-width: 1024px) 32vw, 100vw" },
  // 851px wide at source: never shown wider than it can stay sharp.
  studio: { span: "lg:col-span-4 lg:mt-24 max-w-[425px]", sizes: "(min-width: 1024px) 425px, 100vw" },
  painting: { span: "lg:col-span-4", sizes: "(min-width: 1024px) 32vw, 100vw" },
};

/**
 * The full wall. Every tile is a button that opens the photograph in a
 * lightbox — in its original colour, which is where the stage light the
 * prints leave out comes back.
 *
 * The lightbox is a native <dialog> opened with showModal(): the rest of the
 * page becomes inert, Escape closes it, and the browser keeps focus inside.
 * Arrow keys move between photographs; closing returns focus to the tile.
 */
export default function GalleryWall({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  // The photograph the pointer or focus is on: its full-size image starts
  // loading before the click, so the lightbox opens on a loaded picture.
  const [warm, setWarm] = useState<number | null>(null);

  const openAt = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () => {
      setIndex((i) => {
        if (i !== null) tiles.current[i]?.focus();
        return null;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    node.addEventListener("close", onClose);
    node.addEventListener("keydown", onKey);
    return () => {
      node.removeEventListener("close", onClose);
      node.removeEventListener("keydown", onKey);
    };
  }, [step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-24">
        {photos.map((photo, i) => {
          const layout = LAYOUT[photo.id] ?? { span: "lg:col-span-6", sizes: "(min-width: 1024px) 50vw, 100vw" };
          return (
            <li key={photo.id} className={layout.span}>
              <button
                ref={(el) => {
                  tiles.current[i] = el;
                }}
                type="button"
                onClick={() => openAt(i)}
                onPointerEnter={() => setWarm(i)}
                onFocus={() => setWarm(i)}
                className="print-trigger block w-full text-left"
                aria-haspopup="dialog"
              >
                {photo.artwork ? (
                  // Artwork is shown as made: never printed, never cropped.
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes={layout.sizes}
                    className="block h-auto w-full"
                  />
                ) : (
                  // The first tile is the page's largest paint: load it now. (Both
                  // first-row tiles at high priority only fought for bandwidth.)
                  <Print photo={photo} ratio={layout.ratio} sizes={layout.sizes} priority={i === 0} />
                )}
              </button>
              {photo.label ? <p className="mt-3 text-small text-ink-soft">{photo.label}</p> : null}
            </li>
          );
        })}
      </ul>

      {warm !== null && warm !== index ? (
        <div hidden>
          <Image
            src={photos[warm].src}
            alt=""
            width={photos[warm].width}
            height={photos[warm].height}
            sizes="100vw"
            loading="eager"
          />
        </div>
      ) : null}

      <dialog
        ref={dialog}
        aria-label={current?.alt}
        className="lightbox m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-stock/95"
        onClick={(e) => {
          // A click on the backdrop (the dialog itself, not its content) closes.
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {current ? (
          <div className="flex h-full flex-col">
            <div className="container-page flex h-[72px] shrink-0 items-center justify-end gap-3">
              <button type="button" className="lightbox-btn" onClick={() => step(-1)} aria-label={ui.previous}>
                <Arrow direction="left" />
              </button>
              <button type="button" className="lightbox-btn" onClick={() => step(1)} aria-label={ui.next}>
                <Arrow direction="right" />
              </button>
              <button type="button" className="lightbox-btn px-4" onClick={() => dialog.current?.close()} autoFocus>
                {ui.close}
              </button>
            </div>
            <figure className="container-page flex min-h-0 flex-1 flex-col items-center justify-center pb-6">
              <Image
                key={current.id}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes="100vw"
                className="lightbox-img h-auto max-h-[calc(100dvh-160px)] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 max-w-[60ch] text-center text-small text-ink-soft">{current.alt}</figcaption>
            </figure>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
