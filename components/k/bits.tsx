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

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
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
