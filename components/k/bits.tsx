import type { CSSProperties, ReactNode } from "react";

/* Small shared pieces of the v3 design: icons, hand-drawn lines, the
   equaliser, letter splitting. All decorative SVGs are aria-hidden. */

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDownLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M18 6 6 18M6 8v10h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 28" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 1v25M1 21l5 5 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Burger() {
  return (
    <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 1h14M0 5h14M0 9h14" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path d="M1 1l10 10M11 1 1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** The reference's cross: two offset corner marks. */
export function Cross({ className = "" }: { className?: string }) {
  return (
    <svg className={`k-cross ${className}`} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M13 4v9H4" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.7" />
      <path d="M19 28v-9h9" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.7" />
    </svg>
  );
}

/** Spotify's mark (the brand glyph, used only to link to Spotify). */
export function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`spotify ${className}`} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

/* ── Hand-drawn lines. Each path is normalised to pathLength 1000 so the
      shared `.draw` rule can draw any of them in with the same dash values. */
type LineProps = { className?: string; style?: CSSProperties };

const stroke = { stroke: "#fafafa", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

export function LoopLine({ className = "", style }: LineProps) {
  return (
    <svg className={`draw ${className}`} style={style} viewBox="0 0 89 80" aria-hidden="true" focusable="false">
      <path pathLength={1000} {...stroke} d="M84 9c4 2 3 5-2 8C70 25 44 28 30 39 16 50 21 70 40 68c17-2 12-20-4-14-11 4-18 16-32 21" />
    </svg>
  );
}

export function SwooshLine({ className = "", style }: LineProps) {
  return (
    <svg className={`draw ${className}`} style={style} viewBox="0 0 300 244" aria-hidden="true" focusable="false">
      <path pathLength={1000} {...stroke} d="M292 10C244 32 176 70 128 118 95 151 74 190 84 214c8 18 30 16 30 0 2-22-28-26-50-8-18 15-34 30-56 36" />
    </svg>
  );
}

export function DropLine({ className = "", style }: LineProps) {
  return (
    <svg className={`draw ${className}`} style={style} viewBox="0 0 140 420" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path pathLength={1000} {...stroke} d="M18 14c30-8 78-10 104-4M70 12c-6 30-44 34-36 62 8 30 66 36 58 84-8 46-62 54-56 110 6 52 58 64 44 118-6 22-18 26-20 20" />
    </svg>
  );
}

export function ArcLine({ className = "", style }: LineProps) {
  return (
    <svg className={`draw ${className}`} style={style} viewBox="0 0 460 270" aria-hidden="true" focusable="false">
      <path pathLength={1000} {...stroke} d="M12 258C58 150 150 46 262 34c92-10 158 40 186 116M430 128c8 10 14 20 18 22 6-10 8-24 6-38" />
    </svg>
  );
}

export function Ring({ className = "" }: { className?: string }) {
  return (
    <svg className={`draw ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path pathLength={1000} {...stroke} strokeWidth={0.9} d="M50 2a48 48 0 1 1-.1 0" />
    </svg>
  );
}

/** Equaliser bars ("spectograph" in the reference). `live` animates them. */
export function Eq({ bars = 20, live = true, className = "", style }: { bars?: number; live?: boolean; className?: string; style?: CSSProperties }) {
  return (
    <span className={`k-eq ${live ? "is-live" : ""} ${className}`} style={style} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} style={{ "--i": i, "--rest": `${[30, 55, 15, 70, 40][i % 5]}%` } as CSSProperties} />
      ))}
    </span>
  );
}

/**
 * Splits text into per-letter spans with staggered delays (the reference's
 * letter-by-letter reveals). Screen readers get the whole string from a
 * visually hidden copy; the letters themselves are aria-hidden.
 */
export function Letters({
  text,
  start = 0,
  step = 0.04,
  className = "",
  as: Tag = "span",
}: {
  text: string;
  start?: number;
  step?: number;
  className?: string;
  as?: "span" | "b" | "p";
}) {
  return (
    <Tag className={`rv-letters ${className}`}>
      <span className="sr-only">{text}</span>
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true" style={{ transitionDelay: `${start + i * step}s` }}>
          {ch}
        </span>
      ))}
    </Tag>
  );
}

/** "(Label)" with the parentheses hidden from screen readers. */
export function Paren({ children }: { children: ReactNode }) {
  return (
    <>
      <span aria-hidden="true">(</span>
      {children}
      <span aria-hidden="true">)</span>
    </>
  );
}
