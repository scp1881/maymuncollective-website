# Design system: v3 (adapted from the Kurate reference)

The live design adapts the structure, motion and interactions of kurate-label.vercel.app to Maymun Collective's own content. The reference study is `_redesign/KURATE_STUDY.md`. The alternate design (the two-ink poster) is kept unchanged on the `alternate-design` branch.

Tokens live as CSS custom properties at the top of `app/globals.css`. Sizes are in vw, like the reference, and clamped where they would fall below legible sizes.

## Colour

| Token | Value | Role |
|---|---|---|
| `--bg` | `#0e0f0f` | Page |
| `--panel` / `--panel-2` | `#121313` / `#181a1a` | Player plate, menu glass (at 72–78% opacity plus blur) |
| Spotify mark | `#1ed760` | The icon beside "Listen Now" in the menu (Spotify's own green) |
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

## Motion (on for every visitor; `?motion=off` turns it off; nothing hidden without JS)

Everything animated is keyed to `html.motion`, which the boot script in `app/layout.tsx` sets before first paint for every visitor; the system's reduced-motion setting is deliberately not consulted, as on the Kurate reference (`?motion=off|on` switches it for the browser session; see `components/k/motion.ts`).

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
| Menu | rises 1 s expo-out after load; dropdown 0.4 s. "Listen Now" links straight to Spotify |
| Cursor / grid | lerp 0.3 / 0.1 toward the pointer |
| Marquee | 30 s linear loop |

### Keeping it smooth

ScrollTrigger keeps a requestAnimationFrame loop alive, so the page renders every frame and each running CSS animation costs a style pass per frame even when the compositor draws it. The rules that follow from that, measured with `_redesign/tools/perf.mjs` and `idle-diag.mjs`:

- **Animate HTML boxes, not SVG internals or `<svg>` elements.** Chrome can't composite those, and the circle's spin was re-laying out the page every frame. The ring, vinyl and play-mark pulse spin/scale on HTML wrappers.
- **Few animated elements.** Tickers slide one strip holding two copies of the text (by −50%), not each copy.
- **Loops pause off screen.** Sections outside the viewport get `.is-off`, which pauses their ring, equaliser, vinyl and ticker.
- **JS loops sleep when settled.** The cursor, grid spot and card tilt ease in requestAnimationFrame loops that stop once they arrive; the water ripple draws only while its trail is alive or the logo is moving.
- **Watch class names against Tailwind.** `ring`, `underline` and `outline` are utilities; a component class with one of those names picks up its styles.

## Rules kept from the approved brief

- Only Maymun's six photographs. Member cards use equaliser tiles because there are no member portraits.
- No invented copy: see `_redesign/CONTENT.md` §9c.
- Accessibility:
  - Visible focus rings.
  - A skip link.
  - Keyboard-operable menu (Escape returns focus).
  - A focusable, labelled slider.
  - Hidden steps are removed from the accessibility tree.
  - The cursor and the water ripple only run on fine pointers with motion allowed.
