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
  // REPLACE_WITH_ACTUAL_DOMAIN once you have one (e.g. https://maymuncollective.com)
  url: "https://maymun-collective.example.com",
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
// Gallery tiles. Each renders as a labelled placeholder block until you add a
// real image: set `src` to a /public path (e.g. "/gallery/shot-01.jpg") or a
// full URL, and replace `alt` with a real description. `label` shows on the
// placeholder only. `span` controls the tile's size in the masonry grid:
//   "tall"  -> taller tile      "wide" -> wider tile      "square" -> 1x1
export const visuals = {
  heading: "Visuals",
  subheading: "Selected photography, artwork, and stills from the collective.",
  images: [
    { id: 1, src: "", label: "Portrait", alt: "REPLACE_WITH_ALT_TEXT — portrait / performance shot", span: "tall" },
    { id: 2, src: "", label: "Studio", alt: "REPLACE_WITH_ALT_TEXT — studio session", span: "wide" },
    { id: 3, src: "", label: "Artwork", alt: "REPLACE_WITH_ALT_TEXT — cover artwork", span: "square" },
    { id: 4, src: "", label: "Live", alt: "REPLACE_WITH_ALT_TEXT — live show", span: "square" },
    { id: 5, src: "", label: "Backstage", alt: "REPLACE_WITH_ALT_TEXT — behind the scenes", span: "tall" },
    { id: 6, src: "", label: "Crew", alt: "REPLACE_WITH_ALT_TEXT — group photo", span: "wide" },
  ],
};

/* ----------------------------------------------------------------- MUSIC */
// Paste the FULL <iframe> embed markup from Spotify / Apple Music into `embed`.
//   Spotify:      Share ▸ Embed track/playlist ▸ copy the <iframe> code.
//   Apple Music:  Share ▸ Embed ▸ copy the <iframe> code.
// Leave the placeholder marker in place until you have the real code.
export const music = {
  heading: "Music",
  subheading: "Latest releases, streaming everywhere.",
  releases: [
    {
      id: "spotify-1",
      platform: "Spotify",
      title: "REPLACE — Release title",
      // REPLACE_WITH_ACTUAL_EMBED — paste the full Spotify <iframe> here (as a string).
      embed: "",
    },
    {
      id: "apple-1",
      platform: "Apple Music",
      title: "REPLACE — Release title",
      // REPLACE_WITH_ACTUAL_EMBED — paste the full Apple Music <iframe> here (as a string).
      embed: "",
    },
  ],
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
    { label: "Instagram", href: "https://instagram.com/REPLACE" },
    { label: "YouTube", href: "https://youtube.com/@REPLACE" },
    { label: "TikTok", href: "https://tiktok.com/@REPLACE" },
    { label: "SoundCloud", href: "https://soundcloud.com/REPLACE" },
  ],
};

/* ---------------------------------------------------------------- FOOTER */
export const footer = {
  note: `© ${new Date().getFullYear()} Maymun Collective. All rights reserved.`,
};
