"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowRight, Paren } from "@/components/k/bits";
import type { Photo } from "@/content/site";
import { ui } from "@/content/site";

/**
 * /gallery in the reference's card language: a bordered grid of numbered
 * cards, photographs in greyscale that turn to colour under the pointer
 * (the reference's artist cards), each opening a native <dialog> lightbox
 * with the original colour image. The painting is shown as made — never
 * greyscaled, never cropped. Arrow keys step through; closing returns focus
 * to the tile that opened it.
 */
export default function GalleryWall({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const step = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () =>
      setIndex((i) => {
        if (i !== null) tiles.current[i]?.focus();
        return null;
      });
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
      <ul className="k-gwall">
        {photos.map((p, i) => (
          <li key={p.id} style={{ display: "contents" }}>
            <button
              ref={(el) => {
                tiles.current[i] = el;
              }}
              type="button"
              className="k-gtile rv"
              style={{ "--i": i } as CSSProperties}
              aria-haspopup="dialog"
              onClick={() => {
                setIndex(i);
                dialog.current?.showModal();
              }}
            >
              <span className="cap">
                <sup>
                  <Paren>{i + 1}</Paren>
                </sup>
                <span>{p.label ?? " "}</span>
              </span>
              <span className="ph">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className={p.artwork ? "contain" : ""}
                  style={p.position ? { objectPosition: p.position.lg } : undefined}
                  priority={i < 3}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="k-lightbox"
        aria-label={current?.alt}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {current ? (
          <>
            <div className="bar">
              <button type="button" onClick={() => step(-1)} aria-label={ui.previous}>
                <ArrowRight className="h-5 w-5 rotate-180" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label={ui.next}>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => dialog.current?.close()} autoFocus>
                {ui.close}
              </button>
            </div>
            <figure>
              <Image key={current.id} src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" />
              <figcaption>{current.alt}</figcaption>
            </figure>
          </>
        ) : null}
      </dialog>
    </>
  );
}
