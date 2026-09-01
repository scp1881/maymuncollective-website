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
  // Drives the <title>, meta description, and Open Graph / Twitter tags.
  shortDescription: "A creative collective.",
  // The canonical URL of the deployed site (used for Open Graph / SEO).
  url: "https://maymuncollective.com",
  // Path (in /public) to the social share image. REPLACE with a real 1200x630 image.
  ogImage: "/og-placeholder.svg",
  // Primary contact address (also used by the Contact section mailto link).
  email: "info@maymuncollective.com",
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
  // The big name. Rendered as the page's single <h1> (displayed in all caps).
  // The "\n" forces the line break between the two words.
  title: "Maymun\nCollective",
  // Substring of `title` (case-insensitive) to highlight with an accent block,
  // its letters knocked out in the background colour. Set to "" for none.
  highlight: "iv",
  tagline: "A creative collective.",
  scrollCue: "Scroll",
};

/* --------------------------------------------------------------- VISUALS */
// Gallery tiles. `src` points at a file in /public (image files live in
// public/images/gallery/). To swap an image, drop a new file in and update the
// `src`, `alt`, and the `width`/`height` (the image's real pixel dimensions —
// they let the layout reserve the correct space and preserve aspect ratio so
// nothing is cropped or distorted). NOTE: paths are case-sensitive on Vercel —
// match the exact filename, including extension casing (e.g. .PNG, .JPG). Set
// `src` to "" to fall back to a labelled placeholder tile; `label` shows there.
export const visuals = {
  heading: "Visuals",
  subheading: "Selected photography, artwork, and stills from the collective.",
  images: [
    { id: 1, src: "/images/gallery/01-portrait.jpg", label: "Portrait", alt: "Maymun Collective performing live on stage under pink and purple lights at Blind.", width: 5464, height: 8192 },
    { id: 2, src: "/images/gallery/02-studio.PNG", label: "Studio", alt: "Saxophone, drums, and guitar during a Maymun Collective rehearsal in the studio.", width: 851, height: 658 },
    { id: 3, src: "/images/gallery/03-newartwork.jpg", label: "Artwork", alt: "A vibrant figurative painting of robed figures in bright yellows, reds, and blues.", width: 3024, height: 3912 },
    { id: 4, src: "/images/gallery/04-live.JPG", label: "Live", alt: "Maymun Collective playing an intimate show bathed in red light — sax, keys, guitar, and drums.", width: 1600, height: 1600 },
    { id: 5, src: "/images/gallery/05-backstage.jpeg", label: "Backstage", alt: "The four members of Maymun Collective relaxing on a couch backstage.", width: 5464, height: 8192 },
    { id: 6, src: "/images/gallery/06-crew.JPG", label: "Crew", alt: "The four members of Maymun Collective posing together in front of a packed crowd after a show.", width: 5451, height: 2223 },
  ],
};

/* ----------------------------------------------------------------- MUSIC */
// Streaming embeds. To change one, open the artist page on Spotify / Apple Music,
// use Share ▸ Embed, and paste the full <iframe> code into the matching field.
export const music = {
  heading: "Music",
  subheading: "Listen on Spotify and Apple Music.",
  spotifyEmbed: `<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/artist/65l6MjVrzKqg5gNzo5K7ly?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  appleMusicEmbed: `<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" style="width:100%;max-width:660px;overflow:hidden;background:transparent;" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/nl/artist/maymun-04/1697489205?l=en-GB"></iframe>`,
};

/* --------------------------------------------------------------- MEMBERS */
// Simple roster. Each entry is just a `name` and a `role` — no contact details
// are shown here; general enquiries go through the Contact section's email.
export const members = {
  heading: "Members",
  subheading: "The people behind the collective.",
  people: [
    { id: 1, name: "Ada Fındıkoğlu", role: "Saxophone" },
    { id: 2, name: "Sarp Serinan", role: "Guitar" },
    { id: 3, name: "Adahan Altılar", role: "Drums" },
    { id: 4, name: "Ada Kar Tamyürek", role: "Keyboard" },
    { id: 5, name: "Ata Gökdemir", role: "Bass" },
    { id: 6, name: "Mert Adıgüzel", role: "Management & Booking" },
    { id: 7, name: "San Ertuğ", role: "Social Media" },
    { id: 8, name: "Selimcan Paydaş", role: "Corporate" },
  ],
};

/* ------------------------------------------------------------ GALLERY PAGE */
// Content for the standalone /gallery page — a curated grid of images and video.
//   - Image: type "image", `src` = a file in /public, with real width/height.
//   - Video: type "video", `src` = an .mp4/.webm in /public and `poster` = a
//     still image. Leave `src: ""` to show the poster as a placeholder (a play
//     affordance still appears) until the real clip is added. Use the poster's
//     dimensions for width/height so the masonry reserves the right space.
// The items below are placeholders reusing the homepage gallery images so the
// layout is complete; swap in the real curated assets when ready.
export const galleryPage = {
  heading: "Gallery",
  subheading:
    "A fuller collection of photography, artwork, and video from the collective. More coming soon.",
  items: [
    { id: 1, type: "image", src: "/images/gallery/01-portrait.jpg", poster: "", alt: "Maymun Collective performing live on stage under pink and purple lights at Blind.", width: 5464, height: 8192 },
    { id: 2, type: "video", src: "", poster: "/images/gallery/04-live.JPG", alt: "Live performance clip — video coming soon.", width: 1600, height: 1600 },
    { id: 3, type: "image", src: "/images/gallery/02-studio.PNG", poster: "", alt: "Saxophone, drums, and guitar during a rehearsal in the studio.", width: 851, height: 658 },
    { id: 4, type: "image", src: "/images/gallery/06-crew.JPG", poster: "", alt: "The members of Maymun Collective posing together in front of a packed crowd.", width: 5451, height: 2223 },
    { id: 5, type: "video", src: "", poster: "/images/gallery/01-portrait.jpg", alt: "Backstage clip — video coming soon.", width: 5464, height: 8192 },
    { id: 6, type: "image", src: "/images/gallery/03-newartwork.jpg", poster: "", alt: "A vibrant figurative painting of robed figures in bright yellows, reds, and blues.", width: 3024, height: 3912 },
    { id: 7, type: "image", src: "/images/gallery/05-backstage.jpeg", poster: "", alt: "The four members of Maymun Collective relaxing on a couch backstage.", width: 5464, height: 8192 },
    { id: 8, type: "video", src: "", poster: "/images/gallery/06-crew.JPG", alt: "Show recap — video coming soon.", width: 5451, height: 2223 },
    { id: 9, type: "image", src: "/images/gallery/04-live.JPG", poster: "", alt: "Maymun Collective playing an intimate show bathed in red light.", width: 1600, height: 1600 },
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
    { label: "YouTube", href: "https://www.youtube.com/channel/UCJ1cnAUNK68gRJXUH9G_GuQ" },
  ],
};

/* ---------------------------------------------------------------- FOOTER */
export const footer = {
  note: `© ${new Date().getFullYear()} Maymun Collective. All rights reserved.`,
};
