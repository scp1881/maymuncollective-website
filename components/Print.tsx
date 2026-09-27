import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/content/site";

type Props = {
  photo: Photo;
  /** next/image `sizes` — how wide this print renders at each breakpoint. */
  sizes: string;
  /** CSS aspect-ratio of the frame on phones / from lg up. Defaults to the
   *  photo's own ratio (no crop). */
  ratio?: { sm: string; lg?: string };
  priority?: boolean;
  className?: string;
};

/**
 * A photograph printed in two inks (see DESIGN.md → Photographs, and the
 * `.print` rules in globals.css): a greyscale ink plate on the page's stock,
 * and a violet plate over it, a few pixels out of register.
 *
 * Both plates are the same file at the same `sizes`, so the browser fetches it
 * once. The violet copy is decorative and hidden from assistive tech; the alt
 * text lives on the ink plate only.
 */
export default function Print({ photo, sizes, ratio, priority = false, className = "" }: Props) {
  const natural = `${photo.width} / ${photo.height}`;
  const style = {
    "--ratio-sm": ratio?.sm ?? natural,
    "--ratio-lg": ratio?.lg ?? ratio?.sm ?? natural,
    "--pos-sm": photo.position?.sm ?? "50% 50%",
    "--pos-lg": photo.position?.lg ?? photo.position?.sm ?? "50% 50%",
    ...(photo.tone?.channel === "red" ? { "--ink-pre": "url(#print-red)" } : {}),
    ...(photo.tone?.brightness ? { "--ink-brightness": photo.tone.brightness } : {}),
    ...(photo.tone?.contrast ? { "--ink-contrast": photo.tone.contrast } : {}),
  } as CSSProperties;

  return (
    <div className={`print print-frame ${className}`} style={style}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        priority={priority}
        className="print-ink"
      />
      <div className="print-plate" aria-hidden="true">
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    </div>
  );
}
