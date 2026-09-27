# Design system: Üç Dil (night print)

A gig poster screen-printed on dark stock in two inks: a pale ink and a violet one. The tagline *müzik, música, music.* is the layout: one typeface at three widths, one voice per language. Every photograph is printed, not placed. A grey plate carries the image, and a violet plate sits over it a few pixels out of register.

The tokens live in two places, which are kept in step: CSS custom properties in `app/globals.css` (used by the print effects and the motion) and `tailwind.config.ts` (used by the markup).

## Colour

| Token | Hex | Role | Contrast on `stock` |
|---|---|---|---|
| `stock` | `#0D0F1C` | The page. A navy-black card, not a tinted `#111`, which keeps the blue ink of the original print direction. | — |
| `raised` | `#161A30` | Surfaces that must read as "not the page": the player placeholder and the menu sheet. | — |
| `ink` | `#E6E9F5` | All primary text, the wordmark, rules. | 15.7 : 1 |
| `ink-soft` | `#A9B0CD` | Secondary text: roles, ledes, captions. | 8.9 : 1 |
| `violet` | `#9B5CFF` | The second ink: photo plates, label plates, underlines, active state. Lifted from the violet stage light in the Blind photograph (`#A84AC9`), turned towards blue. | 4.9 : 1 |
| `violet-soft` | `#C4A5FF` | Violet when it has to be small text or a focus ring. | 9.2 : 1 |

Rules:
- Text on a violet plate is `stock`, not `ink` (4.9 : 1 against 3.2 : 1).
- No gradients. Colour comes from the two inks overprinting, never from a wash.

## Type

**Archivo**, variable: width 62–125, weight 300–900. It's self-hosted and subset by `scripts/build-fonts.mjs` (`npm run fonts`) to 77 KB (Latin) plus 9 KB (Turkish ğ ı ş İ, loaded by unicode-range).

| Role | Width | Weight | Size | Notes |
|---|---|---|---|---|
| Tagline, `müzik,` | 125 | 850 | `100cqi / 4.0758` | Each line is fitted to the same column by container-query units. There's no JS measuring, so no layout shift. |
| Tagline, `música,` | 100 | 850 | `100cqi / 4.1216` | |
| Tagline, `music.` | 62 | 850 | `100cqi / 2.3034` | |
| Display (section headings) | 62 | 850 | `clamp(72px, 12vw, 184px)` / 0.86 | |
| Title (names, social words) | 75 | 800 | `clamp(28px, 3.2vw, 44px)` / 1.02 | |
| Lede | 100 | 400 | 21px / 1.4 | |
| Body | 100 | 400 | 17px / 1.55 (16px on phones) | Kept under 70 characters per line. |
| Label | 100 | 700 | 16px / 1 | Sentence case, on a violet plate. Never all caps, never tracked. |
| Small | 100 | 400 | 15px / 1.4 | Hostnames, captions. |

The scale steps are 15, 17, 21, 28, 36, 44, then the display sizes: a classic typographic progression rather than one fixed ratio. Weight carries hierarchy only between 400 and 850. Width carries the voice.

## Space

Base unit 4px. Steps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160.

- **Gutter:** `clamp(20px, 4vw, 56px)`.
- **Section padding:** `clamp(96px, 12vw, 160px)`.
- **Container:** 1536px max. A 12-column grid from `lg`, and a single column below it.

## Radius

`0`. It's print, so nothing is rounded: photos, plates, buttons and the menu sheet alike. The only curves on the site are the ones in the hand-drawn wordmark.

## Layers

| z | What |
|---|---|
| 0 | Page |
| 10 | Violet plates |
| 40 | Nav |
| 60 | Menu sheet |
| 100 | Lightbox |
| 1000 | Skip link |

## Motion

| Token | Value | Used for |
|---|---|---|
| `--dur-press` | 120ms | Press feedback |
| `--dur-quick` | 240ms | Hover and focus: underline plates, name widths |
| `--dur-settle` | 600ms | A plate returning to register after hover; opening the menu sheet |
| `--dur-sweep` | 1100ms | The tagline finding its widths on load |
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Everything that arrives |
| `--ease-in-out` | `cubic-bezier(.65, 0, .35, 1)` | Width sweeps |
| `--ease-exit` | `cubic-bezier(.4, 0, 1, 1)` | Leaving: about 60% of the arrival time |
| scroll-linked | `linear` | View-timeline animations |

**Moments**, loud but cheap: every one of them animates `transform`, `translate` or `font-stretch` only, needs no JavaScript to run, and never hides content.

1. **Load:** the three tagline lines sweep from width 62 out to their own widths (staggered by 90ms). They're visible from the first frame, so LCP isn't delayed.
2. **Scroll:** each photograph's violet plate slides into register as it enters the viewport, and drifts out again as it leaves (CSS scroll-driven animations). Where those aren't supported (Firefox today), the plate simply sits in register.
3. **Scroll:** section headings press from width 100 down to 62 as they arrive.
4. **Hover and focus:** nav and contact links get a violet underline plate. Member names widen from 75 to 100. Gallery tiles knock their plate out of register.
5. **Menu:** a full-screen sheet whose links sweep open in width, one after another.

`prefers-reduced-motion: reduce` turns off every one of these. Plates sit at rest, 5px out of register, and widths are static.

## Photographs

- Photographs are printed with CSS only, from the original file. The grey plate is `grayscale` screened onto `stock`. The violet plate is the *same* image (one download) multiplied into violet and screened on top.
- The `/gallery` lightbox shows the original colour photograph, which is where the real stage light comes back.
- The painting (`03-newartwork.jpg`) is artwork, not a photograph, so it is never printed or cropped.
