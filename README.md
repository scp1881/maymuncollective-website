# Maymun Collective — Website

A single-page scrolling site for **Maymun Collective**, a creative collective.
Built with **Next.js (App Router)** and **Tailwind CSS**, ready to deploy to
**Vercel**.

## Sections (in order)

1. **Hero** — the name bottom-left over a still of the stage
2. **Gallery** — a curated three-photo selection
3. **Music** — Spotify artist embed
4. **Members** — the roster (name / role)
5. **Contact** — socials + mailto

There is also a standalone **`/gallery`** page, linked from the "See more" link
under the homepage Gallery section. It is currently a **holding page** — the
full collection is still being put together.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

Requires Node 18.18+ (Node 20+ recommended).

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Framework preset is auto-detected as **Next.js** — no extra config needed.
4. Click **Deploy**.

No environment variables are required.

---

## Where the placeholder content lives

> **Almost everything you need to edit is in one file:
> [`content/site.ts`](./content/site.ts).**
> Open it and search for **`REPLACE`** to jump between every item that needs
> real content. Each block is commented.

| What to change | Where | Marker to search for |
| --- | --- | --- |
| Collective name, tagline, hero intro | `content/site.ts` → `hero` | — |
| Site title / meta description / OG copy | `content/site.ts` → `site` | — |
| Live domain URL | `content/site.ts` → `site.url` | — |
| Contact email (used in nav + Contact) | `content/site.ts` → `site.email` | `REPLACE_WITH_ACTUAL_EMAIL` |
| Gallery images | `content/site.ts` → `gallery.images` (files in `public/images/gallery/`) | — |
| Spotify embed | `content/site.ts` → `music.spotifyEmbed` | — |
| Member names / roles | `content/site.ts` → `members.people` | — |
| Gallery holding-page copy | `content/site.ts` → `galleryPage` | — |
| Social links | `content/site.ts` → `contact.socials` | — |
| Social share image | `public/og-placeholder.svg` | (replace the file) |
| Site icon + nav wordmark | `Favicon.svg` → run `scripts/build-icons.mjs` | — |

### Gallery images

Gallery photos live in `public/images/gallery/` and are wired to tiles via the
`src` field in `gallery.images`. The homepage shows a **curated three**; the
other files are still on disk, just not listed, so putting one back is only a
matter of restoring its entry. To swap an image:

1. Drop the new file into `public/images/gallery/`.
2. In `content/site.ts`, update that tile's `src`, `alt`, and its `width` /
   `height` — these must be the image's **real pixel dimensions**. The grid uses
   them to reserve the right space, to keep the natural aspect ratio, and to
   decide whether the tile shares a row or takes the whole one, so a wrong pair
   means a distorted tile, a layout jump, or the wrong span.
3. Optionally add a blur preview for it in [`content/blur.ts`](./content/blur.ts)
   — that file explains how to generate one in a single command. Without an
   entry the tile still works; it just fades in from empty rather than from a
   soft impression of the photo.

> **Filenames are case-sensitive on Vercel.** Match the exact name *and*
> extension casing (e.g. `04-live.JPG`, not `04-live.jpg`). A tile with `src`
> set to `""` falls back to a labelled placeholder block, and its `label` field
> is what shows there.

The section lays out as a two-column grid: images narrower than a 1.5:1 ratio
share a row, anything wider takes the whole row. That is read off the photo's
own `width`/`height`, so swapping a portrait for a landscape re-flows on its
own — no per-tile layout flags to keep in sync.

> This used to be a CSS multi-column masonry, and images were forced to load
> **eagerly** to work around Chromium failing to load images stranded in a
> multi-column container's trailing column (it silently cost the grid two of
> six photos on desktop). The grid is not affected, so lazy loading is back.
> If you ever return this section to `columns-*`, re-check that every tile
> actually loads at the widest breakpoint.

> If you point a `src` at an image on **another domain**, add its hostname to
> `next.config.mjs` under `images.remotePatterns` (required by `next/image`).
> Images placed in `/public` need no config.

### Music (Spotify embed)

The Music section renders a single **Spotify artist embed**. To change it, open
the artist page in Spotify, click **⋯ → Share → Embed**, copy the full
`<iframe …>` snippet, and paste it into `music.spotifyEmbed` in
`content/site.ts`. Also update `music.spotifyUrl` (the no-JS fallback link) and
`music.embedHeight` if the embed's height changes.

> **The player is deliberately deferred.** `loading="lazy"` was not enough: it
> is only a hint about viewport distance, and on a page this short Chromium
> decided the Music section was close enough to fetch immediately — measured
> going out at +751ms on *every* cold load, at VeryHigh priority, before any
> scrolling. So each first visit pulled the whole Spotify player (a
> megabyte-plus of third-party JS, plus its main-thread cost) alongside the
> hero, whether or not the visitor ever scrolled that far.
>
> [`components/SpotifyEmbed.tsx`](./components/SpotifyEmbed.tsx) now injects the
> iframe from an IntersectionObserver with a 400px margin, so it starts loading
> just before the section appears. Nothing changes for someone scrolling down.
> Don't "simplify" this back to a bare iframe without re-checking that
> `open.spotify.com` is not requested on initial load.

### Hero backdrop

The hero sits over a still of the stage, rendered by `components/Hero.tsx` as a
hand-rolled `<picture>` — not `next/image`, so the format ladder is explicit,
the files are static, and the two crops below can be art-directed by media
query. One request either way, chosen before any script runs.

| File | AVIF / WebP / JPEG | Used by |
| :--- | :--- | :--- |
| `hero-stage-wide.*` | 140 / 185 / 273 KB | landscape — the full 1920×1080 frame |
| `hero-stage-tall.*` | 69 / 96 / 137 KB | portrait — the left 950px of it |

This used to be a looping drone video. It was removed: it did not play reliably
on real devices, and the still does everything the loop was there for at a
fraction of the weight. There is no client component, no effect and no playback
left to fail. If you bring motion back, know what you are taking on — the
history is in PRs #28–#30.

Four things about the treatment are deliberate:

- **The frame is chosen so the headline has somewhere to go.** The LED wall
  carries the collective's own hand-drawn wordmark; set the page's headline over
  a frame where that sits dead centre and the page says the same two words
  twice, stacked. This frame is shot from the left, so the lockup lives at
  x 958–1735 of 1920 and the headline takes the left. If you swap the
  photograph, check that separation first — it is what makes the headline
  possible at all.
- **The headline is on `container-page`**, the same measure as every section
  below it, so its left edge lines up with the Gallery and Members headings
  rather than floating at a hero-only margin. There is a test for this.
- **Portrait gets its own crop, not a squeeze.** Covering a 9:16 screen with a
  16:9 frame shows a middle sliver about a quarter of its width — here that
  would keep the wall's lettering and throw away the band, and a half-cut
  wordmark beside the page's own headline looks like a mistake. So
  `hero-stage-tall` is the left 950px, up to where the gold starts: arch, IMAG
  screen, band, barrier, no second wordmark. It runs as a **7:8 band** across
  the top (`114.29vw` tall — the section's portrait `padding-top` is derived
  from that, so change one and the other must follow) with the type below it.
- **The scrim is landscape-only.** On landscape the type sits *on* the
  photograph and needs a bed: a vertical sandwich (0.85 at the foot, 0.72 at the
  top to put the open sky down, 0.45 across the middle where the wall is) plus a
  left-to-right wash that deepens only the side the headline is on. On portrait
  the type sits *under* the band on clean ink and needs none of it, so those
  layers are hidden there. Leaving them on is what made the first pass at this
  frame look muddy on a phone.

> **Nothing in the hero may fade in.** Chrome will not treat a transparent
> element as an LCP candidate, so a fade on the headline — the largest thing on
> the first screen — pushes LCP out by the length of the animation. Measured at
> 680 ms without, ~1150 ms with. The scroll cue keeps its fade; nothing is gated
> on that.

Swapping the photograph: regenerate both crops from the new frame at the same
dimensions, and re-check the lockup separation and the portrait crop's right
edge. Nothing else needs to change — there is no blur placeholder and no
`content/` entry for it.

### Webfonts

Both families — **Bricolage Grotesque** (display) and **Inter** (body) — are
self-hosted from `public/fonts/` and subsetted, not loaded through `next/font`.

Bricolage replaced Space Grotesk when the hero was redesigned: its slightly
humanist, rounded capitals sit with the hand-drawn MAYMUN COLLECTIVE lockup
instead of ignoring it, and it holds the width of a full-bleed headline, which
Space Grotesk did not.

Google splits these fonts by `unicode-range`, and the ranges this site renders
came to ~88 KB across three files. Those are High-priority requests competing
with the render-blocking stylesheet, so they sit directly on first paint — and
the site needs a few hundred glyphs, not the several thousand they carry.
Subsetting takes the loaded total to ~65 KB.

| Piece | Where |
| :--- | :--- |
| Served, subsetted fonts | `public/fonts/*.woff2` |
| Unsubsetted originals (not served) | `fonts-src/*.woff2` |
| `@font-face` + metric-matched fallbacks | `app/globals.css` |
| Preloads for the two above-the-fold faces | `app/layout.tsx` |
| Subsetting script | [`scripts/build-fonts.py`](./scripts/build-fonts.py) |

```bash
pip install fonttools brotli && python3 scripts/build-fonts.py
```

Things worth knowing before changing any of this:

- **The originals are vendored on purpose.** `next/font` no longer manages these,
  so without `fonts-src/` there would be nothing left to subset from and the
  pipeline would be a one-way door.
- **The glyph set is deliberately wider than today's copy** — all of Latin-1 and
  Latin Extended-A. A new member name or a line of Turkish, Spanish, Polish or
  Czech copy therefore cannot end up silently rendering one letter in Arial.
  Adding a character outside that range means re-running the script.
- **`bricolage-display.woff2` is the hero's font, and it is 4.6 KB.** It carries
  only the capitals the two `<h1>`s can draw and sits first in the `display`
  stack, with the full 33 KB face right behind it; any character it lacks falls
  through to that, same family, same weight, identical pixels. It exists because
  the hero headline is the LCP element — waiting on the full face put LCP at
  1176 ms on Slow-4G. Changing the headline copy cannot break rendering; at
  worst it costs one more font request. Only this cut and Inter's latin cut are
  preloaded.
- **The hero headline does not fade in, deliberately.** Chrome will not treat a
  transparent element as an LCP candidate, so any fade on it pushes LCP out by
  the length of the animation — far enough, on this page, that the 20px tagline
  became the largest *eligible* element and LCP ended up gated on Inter. Painting
  it immediately puts LCP at 672 ms, level with FCP.
- **Inter's `… Fallback` face is `next/font`'s own generated output, copied
  verbatim.** Bricolage's is measured rather than derived: the face it stands in
  for is ExtraBold, `local("Arial")` has no bold, and the synthesised one comes
  out *wider* than real Bricolage ExtraBold — so the usual average-advance
  calculation gets the direction wrong. See the note in `app/globals.css`.
  Measured CLS is `0.0000`.
- **`unicode-range` values are Google's, unchanged**, so the extended file is
  still only fetched when a page actually renders a character from it. On the
  homepage that means three files load, not four — the Turkish letters in the
  member names are set in the display face, so Inter's extended file is never
  requested.
- The fonts get a one-year immutable `Cache-Control` via `next.config.mjs`;
  files in `/public` are otherwise served with `max-age=0`.

### Members

A simple roster. Add or remove entries in `members.people`; each needs only a
`name` and a `role`. Contact details are deliberately not shown here — all
enquiries go through the email and WhatsApp number in the Contact section.

### Gallery page (`/gallery`)

A **holding page**: an eyebrow, a heading, a line of copy and a way back, all
editable via `galleryPage` in `content/site.ts`. It carries the site's own
`<Nav />`, which rewrites its section links to `/#section` when it is not on
the homepage, so every section stays one click away. It is also `noindex`
(`follow` stays on) so a "Coming soon" result cannot surface under the site's
name in search.

The grid it replaced has **not** been deleted.
[`components/GalleryGrid.tsx`](./components/GalleryGrid.tsx) still implements
the full masonry plus image/video lightbox and still compiles; it just isn't
mounted. It takes an `items` array whose shape is documented as `GalleryItem`
at the top of that file, so bringing the real gallery back is a matter of
supplying items and rendering `<GalleryGrid items={…} />` again.

### Brand assets (site icon + nav wordmark)

Four files are generated from a single design source. The three in `app/` are
picked up by Next automatically, by filename — no config, no `<link>` tags:

| File | Size | Used by |
| :--- | :--- | :--- |
| `app/icon.svg` | vector | Modern browsers — stays crisp at any size |
| `app/favicon.ico` | 16 / 32 / 48 | Older browsers, Windows, Google Search |
| `app/apple-icon.png` | 180×180 | iOS home screen |
| `public/logo-wordmark.svg` | vector | The header wordmark, via `components/Wordmark.tsx` |

All four are **generated**, not hand-drawn. The design source is
[`Favicon.svg`](./Favicon.svg) at the repo root; to change the icon, replace
that file and regenerate:

```bash
npm i --no-save sharp potrace && node scripts/build-icons.mjs
```

The icon is the **spiral** — the mark at the centre of the MAYMUN COLLECTIVE
lockup. It was the M until it was changed; the spiral is more distinctive at tab
size and does not restate the wordmark sitting beside it in the nav.

The script does more than resize, because the source is auto-traced art that
does not survive being shrunk. It measures the badge, lifts the spiral out of it
by connected-component analysis (it is the second-largest ink region, after the
M — there is an assertion on its aspect ratio in case that ever stops being
true), discards the gloss and three stray trace artifacts, and recomposes the
mark centred on a true circle in the badge's own sampled colour.
[`scripts/build-icons.mjs`](./scripts/build-icons.mjs) explains each decision
inline, including why the spiral is sized at 78% of the disc — a thinner gauge
than the M, so it needs more room before its turns merge at small sizes.

It stays dark-on-bone rather than the bone-on-transparent the mark is drawn as
in the wordmark: a pale spiral is invisible against a light tab strip.

> Google requires a favicon that is square and a **multiple of 48px** — the
> `.ico` carries a 48×48 for exactly this, and the SVG has no size requirement.
> If you swap these files by hand, keep that in mind.

The **wordmark** is the arched "MAYMUN COLLECTIVE" lockup. It is not drawn in
the badge art — it is the luminance mask the badge is built from, embedded in
`Favicon.svg`, and it trims to only 294×168, which is too soft for a retina
header. So it is traced to vector too.

Its fill is **baked** to the palette's `bone` value rather than left as
`currentColor`: it loads through an `<img>`, and an SVG in an `<img>` is an
isolated document where `currentColor` resolves to its own default black — the
wordmark would vanish against the dark header. If you change `bone` in
`tailwind.config.ts`, update `BONE` in the script and regenerate.

Size it with a height class — `<Wordmark className="h-8 sm:h-9" />`. The width
follows from the file's intrinsic 1.75 ratio, so the header reserves the right
box and does not shift while it loads.

---

## Design system

Defined once in [`tailwind.config.ts`](./tailwind.config.ts) — edit these tokens
to rebrand:

- **Palette:** off-black (`ink`) / warm off-white (`bone`) with a single vivid
  signal **accent** (`#a855f7`). Change the one `accent` value to re-theme the
  whole site.
- **Type:** `Space Grotesk` (display / headings) + `Inter` (body), self-hosted
  and subsetted — see [Webfonts](#webfonts).
- **Motion:** subtle scroll-triggered fade-ups via the `Reveal` component; all
  motion respects `prefers-reduced-motion`.

---

## Project structure

```
app/
  layout.tsx        # <html>, fonts, SEO metadata (title / description / OG)
  page.tsx          # homepage — section order for the single-page scroll
  gallery/page.tsx  # /gallery holding page (Nav + "Coming soon")
  globals.css       # base styles, focus rings, reduced-motion handling
  icon.svg          # favicon, vector    ┐ all three generated by
  favicon.ico       # favicon, 16/32/48  │ scripts/build-icons.mjs
  apple-icon.png    # iOS icon, 180×180  ┘ from Favicon.svg
components/
  Nav.tsx           # fixed header + mobile menu
  Hero.tsx          # section 1
  Gallery.tsx       # section 2 (+ "See more" link to /gallery)
  Music.tsx         # section 3
  Members.tsx       # section 4 — contact list
  Contact.tsx       # section 5 + footer
  GalleryGrid.tsx   # masonry + lightbox — kept for the real gallery, unmounted
  SectionHeading.tsx# shared heading block
  Wordmark.tsx      # header logo lockup (homepage nav + /gallery header)
  SpotifyEmbed.tsx  # defers the player until the Music section nears the viewport
  Reveal.tsx        # scroll reveal marker (animation driven from layout.tsx)
content/
  site.ts           # ★ ALL editable copy & placeholders
  blur.ts           # tiny inlined blur previews for the gallery images
scripts/
  build-icons.mjs   # regenerates the app/ icons from Favicon.svg
  build-fonts.py    # subsets the webfonts from fonts-src/ into public/fonts/
fonts-src/          # unsubsetted font originals (not served)
public/
  fonts/            # subsetted webfonts (generated — see Webfonts)
  video/            # hero background film + posters (generated)
  logo-wordmark.svg # header wordmark (generated — see Brand assets)
  og-placeholder.svg# social share image (replaceable)
tailwind.config.ts  # design tokens (colors, fonts)
```

---

## Accessibility & SEO notes

- Single `<h1>` (hero), sequential `<h2>`/`<h3>` hierarchy, semantic
  `<section>` / `<nav>` / `<footer>` landmarks.
- Visible keyboard focus rings; mobile menu is `aria-expanded` controlled.
- All images carry descriptive `alt` text (edit it alongside each `src` in
  `content/site.ts`).
- `title`, `description`, and Open Graph / Twitter Card tags are set in
  `app/layout.tsx` from `content/site.ts`.
- Replace `public/og-placeholder.svg` with a real **1200×630** image
  (PNG/JPG recommended for broadest social-platform support).
