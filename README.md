# Maymun Collective — Website

A single-page scrolling site for **Maymun Collective**, a hip hop and creative
collective. Built with **Next.js (App Router)** and **Tailwind CSS**, ready to
deploy to **Vercel**.

## Sections (in order)

1. **Hero** — name, tagline, scroll cue
2. **Visuals** — responsive image grid
3. **Music** — Spotify / Apple Music embeds
4. **Members** — member/artist cards
5. **Contact** — socials + mailto

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
| Live domain URL | `content/site.ts` → `site.url` | `REPLACE_WITH_ACTUAL_DOMAIN` |
| Contact email (used in nav + Contact) | `content/site.ts` → `site.email` | `REPLACE_WITH_ACTUAL_EMAIL` |
| Gallery images | `content/site.ts` → `visuals.images` | `REPLACE_WITH_ALT_TEXT` |
| Spotify / Apple Music embeds | `content/site.ts` → `music.releases` | `REPLACE_WITH_ACTUAL_EMBED` |
| Member names / roles / photos | `content/site.ts` → `members.people` | `REPLACE` |
| Social links | `content/site.ts` → `contact.socials` | `REPLACE` |
| Social share image | `public/og-placeholder.svg` | (replace the file) |
| Favicon | `app/icon.svg` | (replace the file) |

### Gallery images

By default each tile renders as a **labelled solid-color placeholder block** (no
external image service, so it always looks intentional). To use your own images:

1. Drop image files into `public/` (e.g. `public/gallery/shot-01.jpg`).
2. In `content/site.ts`, set that tile's `src` to the local path
   (e.g. `"/gallery/shot-01.jpg"`) — this replaces the placeholder block.
3. Write a real `alt` description for each (replace `REPLACE_WITH_ALT_TEXT`).

Each tile has a `span` of `"tall"`, `"wide"`, or `"square"` that controls how
much space it occupies in the grid — mix them for a dynamic masonry look. The
`label` field is only shown on the placeholder block.

> If you point a `src` at an image on **another domain**, add its hostname to
> `next.config.mjs` under `images.remotePatterns` (required by `next/image`).
> Images placed in `/public` need no config.

### Music embeds

The Music section expects the **full `<iframe>` embed code** as a string:

- **Spotify:** on a track/album/playlist, click **⋯ → Share → Embed** and copy
  the `<iframe …>` snippet.
- **Apple Music:** click **⋯ → Share → Embed this song/album** and copy the
  `<iframe …>` snippet.

Paste it into the `embed: ""` field for the matching release in
`content/site.ts`. Until you do, a labelled placeholder card is shown. You can
add or remove releases by editing the `releases` array.

### Members

Add or remove entries in `members.people`. Each needs a `name` and `role`.
`photo` is optional — leave it as `""` to show an auto-generated initials
monogram, or set it to a `/public` path or full URL for a real portrait.

---

## Design system

Defined once in [`tailwind.config.ts`](./tailwind.config.ts) — edit these tokens
to rebrand:

- **Palette:** off-black (`ink`) / warm off-white (`bone`) with a single warm
  signal **accent** (`#ff4d2e`). Change the one `accent` value to re-theme the
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
  page.tsx          # section order for the single-page scroll
  globals.css       # base styles, focus rings, reduced-motion handling
  icon.svg          # favicon (replaceable)
components/
  Nav.tsx           # fixed header + mobile menu
  Hero.tsx          # section 1
  Gallery.tsx       # section 2
  Music.tsx         # section 3
  Members.tsx       # section 4
  Contact.tsx       # section 5 + footer
  SectionHeading.tsx# shared heading block
  Reveal.tsx        # scroll fade-in wrapper (IntersectionObserver)
content/
  site.ts           # ★ ALL editable copy & placeholders
public/
  og-placeholder.svg# social share image (replaceable)
tailwind.config.ts  # design tokens (colors, fonts)
```

---

## Accessibility & SEO notes

- Single `<h1>` (hero), sequential `<h2>`/`<h3>` hierarchy, semantic
  `<section>` / `<nav>` / `<footer>` landmarks.
- Visible keyboard focus rings; mobile menu is `aria-expanded` controlled.
- All images take real `alt` text (swap the `REPLACE_WITH_ALT_TEXT`
  placeholders for accurate descriptions).
- `title`, `description`, and Open Graph / Twitter Card tags are set in
  `app/layout.tsx` from `content/site.ts`.
- Replace `public/og-placeholder.svg` with a real **1200×630** image
  (PNG/JPG recommended for broadest social-platform support).
