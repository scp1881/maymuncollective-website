import type { CSSProperties } from "react";
import { tagline } from "@/content/site";

/**
 * "müzik, música, music." — one family at three widths, one line per language,
 * each fitted to the same column in pure CSS (see `.tongue` in globals.css).
 * `lang` on each word makes screen readers switch pronunciation; `--i` staggers
 * the load sweep.
 */
export default function Tagline({ className = "" }: { className?: string }) {
  return (
    <p className={`tongues ${className}`}>
      {tagline.map((t, i) => (
        <span
          key={t.voice}
          lang={t.lang}
          data-voice={t.voice}
          className="tongue"
          style={{ "--i": i } as CSSProperties}
        >
          {t.text}
          {/* A space between words for anything that reads the text flat
              (copy/paste, reader mode); the lines break by display:block. */}
          {i < tagline.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
