/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for all copy
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Every word on the site comes from this file. Nothing here may state a fact
 *  the collective has not published itself (see _redesign/CONTENT.md for the
 *  approved wording and every change made during the redesign).
 */

/* ---------------------------------------------------------------- SITE META */
export const site = {
  name: "Maymun Collective",
  // Drives <title>, the meta description and the Open Graph / Twitter tags.
  // Same line as the tagline on purpose: what the page says and what a shared
  // link says should not disagree.
  shortDescription: "müzik, música, music.",
  url: "https://maymuncollective.com",
  // 1200×630, generated from the design by scripts/build-og.mjs.
  ogImage: "/og.png",
  email: "info@maymuncollective.com",
};

/* ------------------------------------------------------------------- NAV */
// Anchor links in the header; `href` values match the section ids.
export const nav = [
  { label: "Gallery", href: "#gallery" },
  { label: "Music", href: "#music" },
  { label: "Members", href: "#members" },
  { label: "Contact", href: "#contact" },
];

/* ---------------------------------------------------------------- TAGLINE */
// The tagline, one entry per language. Each is set at its own width (see
// DESIGN.md → Type); `lang` lets screen readers pronounce each word correctly.
export const tagline = [
  { text: "müzik,", lang: "tr", voice: "tr" },
  { text: "música,", lang: "es", voice: "es" },
  { text: "music.", lang: "en", voice: "en" },
] as const;

/* --------------------------------------------------------------- PHOTOS */
// Every image the site may use. `width`/`height` are the files' real pixel
// dimensions — next/image reserves space from them, so a wrong pair means a
// layout jump. `position` is the object-position used when a layout crops the
// image (phones / wider screens). Filenames are case-sensitive on Vercel.
export type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  position?: { sm: string; lg: string };
  // Artwork is shown as made: never printed in two inks, never cropped.
  artwork?: boolean;
  // Printing adjustments, only for photos whose light doesn't survive a plain
  // greyscale. `channel: "red"` is a darkroom red filter: greyscale weights
  // red at 21%, so a room lit red prints as black unless the red channel
  // itself becomes the grey (the #print-red SVG filter in app/layout.tsx).
  tone?: { channel?: "red"; brightness?: number; contrast?: number };
};

export const photos: Record<string, Photo> = {
  live: {
    id: "live",
    src: "/images/gallery/01-portrait.jpg",
    alt: "Maymun Collective performing live on stage under pink and purple lights at Blind.",
    width: 1708,
    height: 2560,
    label: "Live",
    // The stage sits at 45–70% of the frame; below the ceiling fans.
    position: { sm: "50% 75%", lg: "50% 75%" },
  },
  studio: {
    id: "studio",
    src: "/images/gallery/02-studio.PNG",
    alt: "Saxophone, drums and guitar playing together in a studio.",
    width: 851,
    height: 658,
  },
  painting: {
    id: "painting",
    src: "/images/gallery/03-newartwork.jpg",
    alt: "Painting of figures in bright robes carrying baskets overhead.",
    width: 1979,
    height: 2560,
    artwork: true,
  },
  room: {
    id: "room",
    src: "/images/gallery/04-live.JPG",
    alt: "Maymun Collective playing a small room under red light.",
    width: 1600,
    height: 1600,
    position: { sm: "50% 50%", lg: "45% 50%" },
    // Lit almost entirely red, which greyscale reads as near-black.
    tone: { channel: "red", brightness: 1.1, contrast: 1.15 },
  },
  backstage: {
    id: "backstage",
    src: "/images/gallery/05-backstage.jpeg",
    alt: "Four members of Maymun Collective laughing on a couch backstage.",
    width: 1708,
    height: 2560,
    label: "Backstage",
    position: { sm: "50% 60%", lg: "50% 55%" },
  },
  crew: {
    id: "crew",
    src: "/images/gallery/06-crew.JPG",
    alt: "Four members of Maymun Collective in front of a packed crowd after a show.",
    width: 2560,
    height: 1044,
    label: "Crew",
    position: { sm: "50% 40%", lg: "50% 40%" },
  },
};

/* ------------------------------------------------------------------- HERO */
// The photograph printed beside the tagline: the Blind show, whose violet
// stage light is where the site's second ink comes from.
export const hero = {
  photo: photos.live,
};

/* --------------------------------------------------------------- GALLERY */
// The homepage shows a selection (the Blind photo is already the hero);
// /gallery shows everything.
export const gallery = {
  heading: "Gallery",
  subheading: "On stage and off it.",
  moreLabel: "All photographs",
  images: [photos.crew, photos.backstage],
};

export const galleryPage = {
  heading: "Gallery",
  description: "Photographs of Maymun Collective.",
  backLabel: "Back to home",
  // Order on the page; the painting sits with the photographs but is shown
  // as made (see Photo.artwork).
  images: [photos.live, photos.backstage, photos.crew, photos.room, photos.studio, photos.painting],
};

/* ----------------------------------------------------------------- MUSIC */
// Spotify artist embed. To change it, open the artist page in Spotify, click
// ⋯ ▸ Share ▸ Embed, and paste the full <iframe> code into `spotifyEmbed`.
export const music = {
  heading: "Music",
  // Rendered as a link to `spotifyUrl` — the always-visible fallback for the
  // player, which only loads as the section approaches.
  subheading: "Listen on Spotify.",
  spotifyEmbed: `<iframe data-testid="embed-iframe" title="Maymun Collective on Spotify" style="border-radius:0" src="https://open.spotify.com/embed/artist/65l6MjVrzKqg5gNzo5K7ly?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  // Height the embed renders at, in px. The placeholder reserves exactly this
  // so swapping in the real player shifts nothing.
  embedHeight: 352,
  spotifyUrl: "https://open.spotify.com/artist/65l6MjVrzKqg5gNzo5K7ly",
  loadingLabel: "Loading the player…",
};

/* --------------------------------------------------------------- MEMBERS */
export const members = {
  heading: "Members",
  groups: [
    {
      label: "On stage",
      people: [
        { name: "Ada Fındıkoğlu", role: "Saxophone" },
        { name: "Sarp Serinan", role: "Guitar" },
        { name: "Adahan Altılar", role: "Drums" },
        { name: "Ada Kar Tamyürek", role: "Keyboard" },
        { name: "Ata Gökdemir", role: "Bass" },
      ],
    },
    {
      label: "Off stage",
      people: [
        { name: "Mert Adıgüzel", role: "Management & Booking" },
        { name: "San Ertuğ", role: "Social Media" },
        { name: "Selimcan Paydaş", role: "Corporate" },
      ],
    },
  ],
};

/* --------------------------------------------------------------- CONTACT */
export const contact = {
  heading: "Contact",
  subheading: "Bookings, collaborations, press.",
  email: site.email,
  // Shown under the email; the wa.me link is derived from it (non-digits
  // stripped). Set to "" to hide the WhatsApp line.
  whatsapp: "+44 7915 378469",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/maymun.collective" },
    { label: "TikTok", href: "https://www.tiktok.com/@maymuncollective" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCJ1cnAUNK68gRJXUH9G_GuQ" },
  ],
};

/* ---------------------------------------------------------------- FOOTER */
export const footer = {
  note: `© ${new Date().getFullYear()} Maymun Collective`,
};

/* ------------------------------------------------------------ INTERFACE */
// Words the interface itself needs (controls, not content).
export const ui = {
  skipLink: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  menu: "Menu",
  close: "Close",
  previous: "Previous photograph",
  next: "Next photograph",
  whatsappLabel: (n: string) => `Message us on WhatsApp at ${n}`,
};
