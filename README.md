# Maymun Collective: website

A single-page scrolling site for **Maymun Collective**, a music collective whose tagline, *müzik, música, music.*, speaks Turkish, Spanish and English at once. It's built with **Next.js (App Router)** and **Tailwind CSS**, and deploys to **Vercel**.

The design is a gig poster printed in two inks on dark stock: one typeface at three widths, and every photograph printed rather than placed. See **[DESIGN.md](./DESIGN.md)** for the tokens, type, motion and rules.

## Sections (in order)

1. **Hero:** the wordmark, the tagline at three widths, and the Blind photograph printed beside it.
2. **Gallery:** a selection of photographs, and a link to the full `/gallery`.
3. **Music:** the Spotify artist player, loaded only as the section approaches.
4. **Members:** the roster, on stage and off stage.
5. **Contact:** email, WhatsApp and socials.

**`/gallery`** shows every image. Each one opens in a lightbox in its original colour.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

Requires Node 18.18+ (Node 20+ recommended). No environment variables are needed. Vercel detects Next.js on import.

---

## Content

**Every word on the site lives in [`content/site.ts`](./content/site.ts).** That covers the copy, member names, contact details, social links, the Spotify embed and the photo catalogue.

The file must never state something the collective hasn't published itself: no invented dates, venues, releases or quotes.

### Photographs

- Files live in `public/images/gallery/`. Each one has a single entry in `photos` in `content/site.ts`.
- `width` / `height` must be the file's **real pixel dimensions**. `next/image` reserves the space from them, so a wrong pair means a distorted frame or a layout jump.
- `position` is the crop focus used on phones (`sm`) and wider screens (`lg`).
- Mark artwork with `artwork: true`, so it is shown as made: never printed in two inks, never cropped.
- **Filenames are case-sensitive on Vercel.** Match the extension casing exactly (`04-live.JPG`).

The homepage selection is `gallery.images`, and the `/gallery` order is `galleryPage.images`. The hero photograph is `hero.photo`.

**How printing works:** photographs are printed in CSS from the original file (`components/Print.tsx`, and `.print` in `app/globals.css`). A greyscale ink plate is screened onto the page, and the *same* image is multiplied into violet and set a few pixels out of register on top. It's one download and no pre-processing, and the lightbox shows the untouched original.

### Music (Spotify embed)

To change the player, open the artist page in Spotify and choose **⋯ → Share → Embed**. Paste the `<iframe>` into `music.spotifyEmbed`, and update `music.spotifyUrl` and `music.embedHeight` if they change.

> **The player is deliberately deferred.** An iframe's `loading="lazy"` is only a hint, and on this page Chromium fetched the whole player on every cold load, measured at +751 ms at VeryHigh priority. That's a megabyte-plus of third-party JS competing with the first paint.
>
> [`components/SpotifyEmbed.tsx`](./components/SpotifyEmbed.tsx) injects it from an IntersectionObserver with a 400px margin instead. The section's lede is a plain link to the same artist, which is the visible fallback.
>
> Don't "simplify" this back to a bare iframe without checking that `open.spotify.com` isn't requested on initial load.

### Members

These are the two groups in `members.groups` (**On stage**, **Off stage**), each a list of `{ name, role }`. Names are set in the display face, so a letter outside the font's subset would fall back to the system face. See **Fonts** below before adding one.

---

## Fonts

There's one family: **Archivo**, variable (width 62–125, weight 300–900). The width axis is the design, since each language of the tagline is set at its own width. It's self-hosted from `public/fonts/` and subset by [`scripts/build-fonts.mjs`](./scripts/build-fonts.mjs), with the source files coming from `@fontsource-variable/archivo` (SIL OFL 1.1):

```bash
npm run fonts
```

| File | Size | Covers |
| :--- | ---: | :--- |
| `archivo-latin.woff2` | 77 KB | Basic Latin, Latin-1 (all of Spanish, plus Turkish ç ö ü), typographic punctuation. Preloaded. |
| `archivo-latin-ext.woff2` | 9 KB | ğ Ğ ı İ ş Ş and Œ œ Š š Ÿ Ž ž. It loads only when a page renders one (unicode-range). |

**Adding a character outside those ranges** (a Polish or Czech name, say) means adding it to `TURKISH_PLUS` in the script and re-running it. Otherwise that one letter renders in Arial.

`app/globals.css` also declares **"Archivo Fallback"**: Arial resized to Archivo's metrics, so text drawn before the webfont arrives takes the same space and the swap causes no layout shift.

**The tagline is fitted in CSS, not JavaScript.** Each line's `font-size` is the column width in container-query units divided by that word's measured advance at its width. If the tagline copy ever changes, re-measure (the values are in `.tongue` in `globals.css`), or the lines won't fill the column.

**The first screen never starts transparent.** Chrome won't count an invisible element as the LCP candidate, so any fade on the hero pushes LCP out by the length of the animation. The tagline's load sweep animates width only, which is why it can be loud without costing LCP.

---

## Hero history

The hero has carried four background treatments (a still, then three drone films), and all four were removed; see PRs #28, #29, #33, #35 and #36. Each video passed every test runnable from the repo and still showed a frozen frame on a device that couldn't be reached from here.

The current hero has no background media. The photograph is an ordinary `next/image` with `priority`.

If a film ever goes back in:
- **Bitrate, not file size,** decides whether it looks broken. On Slow-4G it took 11.8 s at 2.51 Mbps against 3.5 s at 1.26 Mbps.
- **Nothing clever may sit between the server and the first frame.** Every version that attached the source from a script failed.

---

## Share image

`public/og.png` (1200×630) is rendered from the design itself by [`scripts/build-og.mjs`](./scripts/build-og.mjs): the same fonts, wordmark and print recipe as the site. Regenerate it after changing the tagline, the palette or the hero photograph:

```bash
npm i --no-save puppeteer-core && npm run og
```

It uses the installed Google Chrome (set `CHROME_PATH` if it isn't in the default macOS location).

---

## Brand assets (site icon + wordmark)

These are generated from one design source, [`Favicon.svg`](./Favicon.svg), by [`scripts/build-icons.mjs`](./scripts/build-icons.mjs):

```bash
npm i --no-save sharp potrace && node scripts/build-icons.mjs
```

| File | Size | Used by |
| :--- | :--- | :--- |
| `app/icon.svg` | vector | Modern browsers |
| `app/favicon.ico` | 16 / 32 / 48 | Older browsers, Windows, Google Search (which wants a multiple of 48px) |
| `app/apple-icon.png` | 180×180 | iOS home screen |
| `public/logo-wordmark.svg` | vector | The wordmark in the hero, header and footer (`components/Wordmark.tsx`) |

- **The icon** is the spiral from the centre of the lockup. The script lifts it out of the auto-traced badge and recomposes it on a true circle; the reasoning is inline in the script.
- **The wordmark's** fill is **baked** to the palette's `ink` (`#e6e9f5`) rather than `currentColor`. An SVG loaded through `<img>` is an isolated document, so `currentColor` would resolve to black and vanish on the dark page. If `ink` changes, update `INK` in the script and regenerate.
- **Size the wordmark** with a height class (`<Wordmark className="h-10" />`). The width follows from its 1.75 ratio, so nothing shifts while it loads.

---

## Project structure

```
app/
  layout.tsx          # <html>, metadata (title, description, Open Graph), font preload, skip link
  page.tsx            # homepage: section order
  gallery/page.tsx    # /gallery: every image + lightbox
  robots.ts           # /robots.txt
  sitemap.ts          # /sitemap.xml
  globals.css         # fonts, tokens, print effect, all motion
components/
  Nav.tsx             # fixed header, section tracking, phone menu sheet
  Hero.tsx  Tagline.tsx  Print.tsx
  Section.tsx         # heading + lede + content, with the fold rule
  Gallery.tsx  Music.tsx  SpotifyEmbed.tsx  Members.tsx  Contact.tsx  Footer.tsx
  GalleryWall.tsx     # /gallery grid + <dialog> lightbox
  SkipLink.tsx  Wordmark.tsx
content/site.ts       # ★ all copy and the photo catalogue
scripts/
  build-fonts.mjs     # subsets Archivo into public/fonts/
  build-og.mjs        # renders public/og.png
  build-icons.mjs     # regenerates icons + wordmark from Favicon.svg
public/
  fonts/  images/gallery/  logo-wordmark.svg  og.png
DESIGN.md             # the design system
```

---

## Accessibility & SEO

- **Headings and landmarks:** one `<h1>` per page (the wordmark on `/`, "Gallery" on `/gallery`), then `<h2>` per section and `<h3>` for the member groups. Semantic `<header>`, `<nav>`, `<main>`, `<section>` and `<footer>`, plus a skip link.
- **Contrast:** every text pair passes WCAG AA (see DESIGN.md). Text on the violet plate is dark (`stock`), not light.
- **Keyboard:** one visible focus style everywhere. The phone menu traps focus, closes on Escape and returns focus. The lightbox is a native `<dialog>`, with arrow keys between photographs.
- **Motion:** `prefers-reduced-motion: reduce` turns off all of it (plates rest, widths are static).
- **Language:** each word of the tagline carries its own `lang`, so screen readers pronounce it correctly.
- **SEO:** title, description, canonical, Open Graph and Twitter tags are set from `content/site.ts`. `robots.txt` and `sitemap.xml` are generated.
