# Maymun Collective: website

A single-page scrolling site for **Maymun Collective**, a music collective whose tagline, *müzik, música, music.*, speaks Turkish, Spanish and English at once. It's built with **Next.js (App Router)** and **Tailwind CSS**, and deploys to **Vercel**.

The live design is adapted from the [Kurate](https://kurate-label.vercel.app/) reference: its structure, smooth scroll, preloader, water-ripple logo, 3D card stack, splitting vinyl, draggable member cards, frosted contact panel and floating menu, set with Maymun's own content. See **[DESIGN.md](./DESIGN.md)** for the tokens and motion, and `_redesign/KURATE_STUDY.md` (not committed) for the study.

**Alternate design.** The earlier redesign (the dark two-ink poster) is kept, unchanged and deployable, on the [`alternate-design`](https://github.com/scp1881/maymuncollective-website/tree/alternate-design) branch. To switch back, merge or reset `main` to it.

## Sections (in order)

1. **Hero:** the wordmark (with a WebGL water ripple under the pointer on desktop), two photo cards and the tilting 3D card stack.
2. **Gallery:** the gallery line typed in, a drawn line, and the link to the full `/gallery`.
3. **Statement:** the tagline, one language per line, and the splitting vinyl.
4. **Members:** "A Creative / Collective" and a draggable row of member cards.
5. **Music:** the Spotify artist player, loaded only as the section approaches.
6. **Channels:** every direct line in one row of mixer-like strips (email, Instagram, TikTok, YouTube); each strip's meter plays when it's pointed at.
7. **Contact:** a three-step contact form (details → reason → message, with an optional file) in a frosted panel over a giant email marquee. Messages are read at `/inbox`.

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
- Mark artwork with `artwork: true`, so it is shown as made: never greyscaled, never cropped.
- **Filenames are case-sensitive on Vercel.** Match the extension casing exactly (`04-live.JPG`).

The homepage selection is `gallery.images`, and the `/gallery` order is `galleryPage.images`. The hero photograph is `hero.photo`.

**Motion** is driven by `components/k/Experience.tsx` (GSAP ScrollSmoother + ScrollTrigger): sections get `.animated` as they arrive, which releases the CSS reveals in `app/globals.css`. All of it is keyed to one class, `html.motion`, set before first paint for **every visitor**: by the owner's choice, as on the Kurate reference, the system's Reduce Motion setting is not consulted. Add `?motion=off` to the URL to see the still version (no smooth scroll, every reveal static) and `?motion=on` to turn motion back on; the choice lasts for the browser session. Without JavaScript nothing is hidden.

### Contact form and inbox

The form in the Contact section saves every message as a structured record (name, email, reason, message, optional attachment). You read them at **`/inbox`**, a password-protected page with a filter by reason, a Reply link, attachment downloads and a CSV export. It is not linked from the site and is kept out of search engines.

**One-time setup in Vercel** (nothing is saved until this is done; the form shows an error instead):

1. Project → **Storage** → **Create** → **Blob**, set access to **Private**, and connect it to the project for **Production** and **Preview**. Connecting adds `BLOB_STORE_ID` (and `BLOB_WEBHOOK_PUBLIC_KEY`); the site then authenticates with Vercel's short-lived OIDC credentials, so there is no long-lived secret to keep. (This project's store is `contact`, private, in Frankfurt.)
2. Project → **Settings → Environment Variables** → add `INBOX_PASSWORD` (a long random password; share it only with whoever answers messages).
3. Redeploy, then open `https://maymuncollective.com/inbox`.

The free Hobby plan includes 1 GB of Blob storage and 2,000 writes a month; each message is one write (plus one per attachment). Attachments are limited to 50 MB; delete old ones in Vercel → Storage if space runs low.

**Locally**, without a store, messages and files are written to `.data/` (gitignored), and the inbox password comes from `.env.local` (`INBOX_PASSWORD=…`, also gitignored). The code is in `components/k/ContactStream.tsx`, `app/api/contact/`, `app/inbox/` and `lib/contact/`.

### Music (Spotify embed)

To change the player, open the artist page in Spotify and choose **⋯ → Share → Embed**. Paste the `<iframe>` into `music.spotifyEmbed`, and update `music.spotifyUrl` and `music.embedHeight` if they change.

> **The player is deliberately deferred.** An iframe's `loading="lazy"` is only a hint, and on this page Chromium fetched the whole player on every cold load, measured at +751 ms at VeryHigh priority. That's a megabyte-plus of third-party JS competing with the first paint.
>
> [`components/k/SpotifyEmbed.tsx`](./components/k/SpotifyEmbed.tsx) injects it from an IntersectionObserver with a 400px margin instead. The section's lede is a plain link to the same artist, which is the visible fallback.
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
| `public/logo-wordmark.svg` | vector | The wordmark in the hero, header, preloader and footer |

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
  globals.css         # fonts, tokens, reveal system, every section's styles and motion
components/k/
  Experience.tsx      # smooth scroll, section triggers, header/grid state, anchors
  Preloader.tsx  Chrome.tsx (grid + cursor)  Header.tsx  BottomMenu.tsx
  Hero.tsx  WaterLogo.tsx  TiltCard.tsx
  Statement.tsx  About.tsx (+ vinyl)  Members.tsx  DragSlider.tsx
  Music.tsx  SpotifyEmbed.tsx  Contact.tsx  ContactSteps.tsx  Waves.tsx  Footer.tsx
  GalleryWall.tsx     # /gallery cards + <dialog> lightbox
  bits.tsx            # icons, drawn lines, equaliser, letter splitting
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
- **Contrast:** every text pair passes WCAG AA (see DESIGN.md); the reference's 30–50% white small text is lifted to 55–62%.
- **Keyboard:** one visible focus style everywhere. The menu dropdown closes on Escape and returns focus. The member row is a focusable, labelled region. The lightbox is a native `<dialog>`, with arrow keys between photographs.
- **Motion:** animations play for everyone, including visitors whose system asks for reduced motion (the owner's decision, matching the Kurate reference). `?motion=off` turns all of it off for the browser session: no preloader, smooth scroll, ripple, custom cursor or reveals.
- **Language:** each word of the tagline carries its own `lang`, so screen readers pronounce it correctly.
- **SEO:** title, description, canonical, Open Graph and Twitter tags are set from `content/site.ts`. `robots.txt` and `sitemap.xml` are generated.
