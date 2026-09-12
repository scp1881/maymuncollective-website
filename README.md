# Maymun Collective — Website

A single-page scrolling site for **Maymun Collective**, a creative collective.
Built with **Next.js (App Router)** and **Tailwind CSS**, ready to deploy to
**Vercel**.

## Sections (in order)

1. **Hero** — name, tagline, scroll cue
2. **Visuals** — responsive image grid
3. **Music** — Spotify artist embed
4. **Members** — contact list (name / role / phone or email)
5. **Contact** — socials + mailto

There is also a standalone **`/gallery`** page (linked from the "View more"
link under the homepage Visuals section) — a fuller image + video grid with an
inline lightbox.

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
| Gallery images | `content/site.ts` → `visuals.images` (files in `public/images/gallery/`) | — |
| Spotify embed | `content/site.ts` → `music.spotifyEmbed` | — |
| Member names / roles / contacts | `content/site.ts` → `members.people` | — |
| Gallery page items (images + video) | `content/site.ts` → `galleryPage.items` | — |
| Social links | `content/site.ts` → `contact.socials` | — |
| Social share image | `public/og-placeholder.svg` | (replace the file) |
| Site icon + nav wordmark | `Favicon.svg` → run `scripts/build-icons.mjs` | — |

### Gallery images

Gallery photos live in `public/images/gallery/` and are wired to tiles via the
`src` field in `content/site.ts`. To swap an image:

1. Drop the new file into `public/images/gallery/`.
2. In `content/site.ts`, update that tile's `src`, `alt`, and its `width` /
   `height` — these must be the image's **real pixel dimensions**. The masonry
   uses them to reserve the right space and to keep the natural aspect ratio, so
   a wrong pair means a distorted tile or a layout jump as the image lands.
3. Optionally add a blur preview for it in [`content/blur.ts`](./content/blur.ts)
   — that file explains how to generate one in a single command. Without an
   entry the tile still works; it just fades in from empty rather than from a
   soft impression of the photo.

> **Filenames are case-sensitive on Vercel.** Match the exact name *and*
> extension casing (e.g. `04-live.JPG`, not `04-live.jpg`). A tile with `src`
> set to `""` falls back to a labelled placeholder block, and its `label` field
> is what shows there.

> Gallery images are loaded **eagerly at low priority**, which looks wrong but
> is not: Chromium's `loading="lazy"` fails to load images stranded in the
> trailing column of a CSS multi-column container, which silently cost this
> grid two of its six photos on desktop. Don't switch them back to lazy without
> re-checking that every tile still loads at the 3-column breakpoint.

> If you point a `src` at an image on **another domain**, add its hostname to
> `next.config.mjs` under `images.remotePatterns` (required by `next/image`).
> Images placed in `/public` need no config.

### Music (Spotify embed)

The Music section renders a single **Spotify artist embed**. To change it, open
the artist page in Spotify, click **⋯ → Share → Embed**, copy the full
`<iframe …>` snippet, and paste it into `music.spotifyEmbed` in
`content/site.ts`.

### Members

A simple contact list. Add or remove entries in `members.people`; each needs a
`name`, a `role`, and one contact method — either a `phone` (rendered as a
tap-to-call `tel:` link) or an `email` (a `mailto:` link). Leave the unused
field as `""`.

### Gallery page (`/gallery`)

The `/gallery` route renders `galleryPage.items` from `content/site.ts` as a
masonry grid with a lightbox. Each item is either:

- an **image** (`type: "image"`, a `src` in `/public`, plus `width`/`height`), or
- a **video** (`type: "video"`, a `src` to an `.mp4`/`.webm` in `/public` and a
  `poster` still). Leave `src: ""` to show the poster as a placeholder (with a
  play affordance and a "Video coming soon" state) until the clip is added.

Items currently reuse the homepage gallery images as placeholders — swap in the
real curated assets when ready.

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

The script does more than resize, because the source is auto-traced art that
does not survive being shrunk. It measures the badge, lifts the M out of it by
connected-component analysis, discards the gloss, the spiral and three stray
trace artifacts, and recomposes the mark centred on a true circle in the
badge's own sampled colour. [`scripts/build-icons.mjs`](./scripts/build-icons.mjs)
explains each decision inline, including why the M is sized at 66% of the disc
(below ~62% its counters close up at 16px and it reads as an "H"; above ~70% it
crowds the disc).

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

Size it with a height class — `<Wordmark className="h-9 sm:h-10" />`. The width
follows from the file's intrinsic 1.75 ratio, so the header reserves the right
box and does not shift while it loads.

---

## Design system

Defined once in [`tailwind.config.ts`](./tailwind.config.ts) — edit these tokens
to rebrand:

- **Palette:** off-black (`ink`) / warm off-white (`bone`) with a single vivid
  signal **accent** (`#a855f7`). Change the one `accent` value to re-theme the
  whole site.
- **Type:** `Space Grotesk` (display / headings) + `Inter` (body), loaded via
  `next/font` in `app/layout.tsx`.
- **Motion:** subtle scroll-triggered fade-ups via the `Reveal` component; all
  motion respects `prefers-reduced-motion`.

---

## Project structure

```
app/
  layout.tsx        # <html>, fonts, SEO metadata (title / description / OG)
  page.tsx          # homepage — section order for the single-page scroll
  gallery/page.tsx  # /gallery route (minimal header + GalleryGrid)
  globals.css       # base styles, focus rings, reduced-motion handling
  icon.svg          # favicon, vector    ┐ all three generated by
  favicon.ico       # favicon, 16/32/48  │ scripts/build-icons.mjs
  apple-icon.png    # iOS icon, 180×180  ┘ from Favicon.svg
components/
  Nav.tsx           # fixed header + mobile menu
  Hero.tsx          # section 1
  Gallery.tsx       # section 2 (+ "View more" link to /gallery)
  Music.tsx         # section 3
  Members.tsx       # section 4 — contact list
  Contact.tsx       # section 5 + footer
  GalleryGrid.tsx   # /gallery masonry grid + image/video lightbox (client)
  SectionHeading.tsx# shared heading block
  Wordmark.tsx      # header logo lockup (homepage nav + /gallery header)
  Reveal.tsx        # scroll reveal marker (animation driven from layout.tsx)
content/
  site.ts           # ★ ALL editable copy & placeholders
  blur.ts           # tiny inlined blur previews for the gallery images
scripts/
  build-icons.mjs   # regenerates the app/ icons from Favicon.svg
public/
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
