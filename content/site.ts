/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for all editable copy & placeholders
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Everything a non-developer needs to change lives in this file.
 *  Search for "REPLACE" to jump straight to items that need real content.
 *
 *  Sections below map 1:1 to the on-page sections.
 */

/* ---------------------------------------------------------------- SITE META */
export const site = {
  name: "Maymun Collective",
  // Used in <title>, Open Graph, etc.
  shortDescription: "A hip hop and creative collective.",
  // The canonical URL of the deployed site (used for Open Graph / SEO).
  url: "https://maymuncollective.com",
  // Path (in /public) to the social share image. REPLACE with a real 1200x630 image.
  ogImage: "/og-placeholder.svg",
  // Primary contact address (also used by the Contact section mailto link).
  email: "hello@maymuncollective.com", // REPLACE_WITH_ACTUAL_EMAIL
};

/* ------------------------------------------------------------------- NAV */
// Anchor links shown in the header. `href` values match the section ids.
export const nav = [
  { label: "Visuals", href: "#visuals" },
  { label: "Music", href: "#music" },
  { label: "Members", href: "#members" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------- HERO */
export const hero = {
  // Small kicker above the name (optional — set to "" to hide).
  kicker: "Est. 2024 — Worldwide",
  // The big name. Rendered as the page's single <h1>.
  title: "Maymun\nCollective",
  tagline: "A hip hop and creative collective.",
  // Secondary supporting line under the tagline (optional).
  intro:
    "Music, visuals, and everything in between — built by a crew that treats the studio, the stage, and the street as one canvas.",
  scrollCue: "Scroll",
};

/* --------------------------------------------------------------- VISUALS */
// Gallery tiles. `src` points at a file in /public (image files live in
// public/images/gallery/). To swap an image, drop a new file in and update the
// `src` + `alt`. NOTE: paths are case-sensitive on Vercel — match the exact
// filename, including extension casing (e.g. .PNG, .JPG). Set `src` to "" to
// fall back to a labelled placeholder block. `label` shows on the placeholder
// only. `span` controls the tile's size in the masonry grid:
//   "tall"  -> taller tile      "wide" -> wider tile      "square" -> 1x1
export const visuals = {
  heading: "Visuals",
  subheading: "Selected photography, artwork, and stills from the collective.",
  images: [
    { id: 1, src: "/images/gallery/01-portrait.jpg", label: "Portrait", alt: "Maymun Collective performing live on stage under pink and purple lights at Blind.", span: "tall" },
    { id: 2, src: "/images/gallery/02-studio.PNG", label: "Studio", alt: "Saxophone, drums, and guitar during a Maymun Collective rehearsal in the studio.", span: "wide" },
    { id: 3, src: "/images/gallery/03-artwork.jpg", label: "Artwork", alt: "A Maymun Collective member on a boat at dusk, city lights along the water behind.", span: "square" },
    { id: 4, src: "/images/gallery/04-live.JPG", label: "Live", alt: "Maymun Collective playing an intimate show bathed in red light — sax, keys, guitar, and drums.", span: "square" },
    { id: 5, src: "/images/gallery/05-backstage.jpeg", label: "Backstage", alt: "The four members of Maymun Collective relaxing on a couch backstage.", span: "tall" },
    { id: 6, src: "/images/gallery/06-crew.JPG", label: "Crew", alt: "The four members of Maymun Collective posing together in front of a packed crowd after a show.", span: "wide" },
  ],
};

/* ----------------------------------------------------------------- MUSIC */
// Spotify artist profile embed. To change it: open the artist page in Spotify,
// click ⋯ ▸ Share ▸ Embed, and paste the full <iframe> code into `spotifyEmbed`.
export const music = {
  heading: "Music",
  subheading: "Listen on Spotify.",
  spotifyEmbed: `<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/artist/65l6MjVrzKqg5gNzo5K7ly?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
};

/* --------------------------------------------------------------- MEMBERS */
// Add/remove entries freely. `photo` can be a /public path, a full URL, or ""
// (an initials monogram is shown when empty).
export const members = {
  heading: "Members",
  subheading: "The people behind the collective.",
  people: [
    { id: 1, name: "REPLACE — Member One", role: "MC / Songwriter", photo: "" },
    { id: 2, name: "REPLACE — Member Two", role: "Producer / Beatmaker", photo: "" },
    { id: 3, name: "REPLACE — Member Three", role: "DJ / Engineer", photo: "" },
    { id: 4, name: "REPLACE — Member Four", role: "Visual Artist / Director", photo: "" },
  ],
};

/* --------------------------------------------------------------- CONTACT */
// Social links. Set `href` to "" to hide a given platform.
export const contact = {
  heading: "Get in touch",
  subheading:
    "Bookings, collaborations, press. Reach us directly or find us online.",
  email: site.email,
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/maymun.collective?igsh=MWE3dmx2MHppZ2F4Mw==" },
    { label: "TikTok", href: "https://www.tiktok.com/@maymuncollective?_r=1&_t=ZS-92W1QWdmZV9" },
  ],
};

/* ---------------------------------------------------------------- FOOTER */
export const footer = {
  note: `© ${new Date().getFullYear()} Maymun Collective. All rights reserved.`,
};
