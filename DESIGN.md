# Design system: v3 (adapted from the Kurate reference)

This branch (`redesign/v3-kurate`) adapts the structure, motion and interactions of kurate-label.vercel.app to Maymun Collective's own content. The reference study is `_redesign/KURATE_STUDY.md`. `redesign/v2` (the two-ink poster) is unchanged.

Tokens live as CSS custom properties at the top of `app/globals.css`. Sizes are in vw, like the reference, and clamped where they would fall below legible sizes.

## Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0e0f0f` | Page |
| `--panel` / `--panel-2` | `#121313` / `#181a1a` | Player plate, menu glass (at 72–78% opacity plus blur) |
| `--fg` | `#fafafa` | Text, lines, wordmark (≈ 18 : 1 on bg) |
| `--muted` | 62% white | Paragraphs (the reference used 50%; lifted for AA) |
| `--faint` | 55% white | Small labels (the reference used 30–40%; lifted for AA) |
| `--line` | `rgba(252,252,252,.25)` | Card and footer borders |
| `--teal` | `#95b6c5` | Equaliser bars on hover |
| Vinyl | `#082a34` → `#1f7a93` | The splitting disc |

## Type

**Archivo** at width 100 stands in for the reference's licensed Helvetica Now Display (closest free match; tested side by side). Self-hosted and subset (`npm run fonts`).

| Role | Size | Weight |
|---|---|---|
| `k-h1` (Members title, Gallery) | 10.58vw (16.41vw on phones) | 400 |
| `k-h2` (Music titles) | 7.28vw (12.4vw) | 400 |
| `k-h3` (about statement) | 4.76vw (9.23vw) | 400 |
| `k-p` | 1.19vw, min 14px | 400 |
| `k-label` "(Section)" | 1.32vw, min 13px | 400 |
| Links, menu | 0.93–1.06vw, min 13px | 500 |

## Motion (all off under `prefers-reduced-motion`, and nothing hidden without JS)

| Piece | Timing (from the reference's own CSS/JS) |
|---|---|
| Smooth scroll | GSAP ScrollSmoother, smooth 1.5 |
| Section reveal | `.animated` when the section top reaches 60% of the viewport. `.rv` children translate/fade over 1–1.25 s, staggered |
| Line drawings | stroke-dashoffset 1000 → 0, 2 s, cubic-bezier(.65,0,.35,1) |
| Letters | per-letter fade, 30–75 ms steps |
| Preloader | wipe 2.2 s linear; curtain 1.5 s cubic-bezier(.65,0,.35,1) after 0.5 s. First homepage visit only |
| Hero logo | clip reveal 1.2 s; water ripple (64 px trail texture, age 64 frames); scrubbed lift and fade on exit |
| 3D cards | tilt = offset ÷ 100 deg; fan out ±6° on hover, 1 s |
| Vinyl | pieces slide out over 3 s, cubic-bezier(.22,1,.36,1); centre spins every 2 s |
| Menu | rises 1 s expo-out after load; dropdown 0.4 s; player flip 1 s rotateX |
| Cursor / grid | lerp 0.3 / 0.1 toward the pointer |
| Marquee | 30 s linear loop |

## Rules kept from the approved brief

- Only Maymun's six photographs. Member cards use equaliser tiles because there are no member portraits.
- No invented copy: see `_redesign/CONTENT.md` §9c.
- Accessibility:
  - Visible focus rings.
  - A skip link.
  - Keyboard-operable menu and player (Escape returns focus).
  - A focusable, labelled slider.
  - Hidden steps are removed from the accessibility tree.
  - The cursor and the water ripple only run on fine pointers with motion allowed.
