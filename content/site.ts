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
  // Same line as the hero tagline, deliberately: what the page says out loud
  // and what a search result or a shared link says should not disagree.
  shortDescription: "müzik, música, music.",
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
  { label: "Gallery", href: "#gallery" },
  { label: "Music", href: "#music" },
  { label: "Members", href: "#members" },
  { label: "Contact", href: "#contact" },
];

/* ------------------------------------------------------------------- HERO */
export const hero = {
  // The two lines of the name, rendered as the page's single <h1> in all caps.
  // Kept as an array rather than one string with a "\n" so each line is its own
  // element and the lockup can be balanced line by line (see components/Hero).
  titleLines: ["Maymun", "Collective"],
  tagline: "müzik, música, music.",
  scrollCue: "Scroll",
};

/* --------------------------------------------------------------- GALLERY */
// Gallery tiles. `src` points at a file in /public (image files live in
// public/images/gallery/). To swap an image, drop a new file in and update the
// `src`, `alt`, and the `width`/`height` (the image's real pixel dimensions —
// they let the layout reserve the correct space and preserve aspect ratio so
// nothing is cropped or distorted). NOTE: paths are case-sensitive on Vercel —
// match the exact filename, including extension casing (e.g. .PNG, .JPG). Set
// `src` to "" to fall back to a labelled placeholder tile; `label` shows there.
// A curated three-photo selection. The other files are still in
// public/images/gallery/ — they were removed from this list, not deleted — so
// adding one back is just a matter of putting its entry back here.
export const gallery = {
  heading: "Gallery",
  subheading: "Selected photography and stills from the collective.",
  images: [
    { id: 1, src: "/images/gallery/01-portrait.jpg", label: "Live", alt: "Maymun Collective performing live on stage under pink and purple lights at Blind.", width: 1708, height: 2560 },
    { id: 5, src: "/images/gallery/05-backstage.jpeg", label: "Backstage", alt: "The four members of Maymun Collective relaxing on a couch backstage.", width: 1708, height: 2560 },
    { id: 6, src: "/images/gallery/06-crew.JPG", label: "Crew", alt: "The four members of Maymun Collective posing together in front of a packed crowd after a show.", width: 2560, height: 1044 },
  ],
};

/* ----------------------------------------------------------------- MUSIC */
// Spotify artist embed. To change it, open the artist page in Spotify, click
// ⋯ ▸ Share ▸ Embed, and paste the full <iframe> code into `spotifyEmbed`.
export const music = {
  heading: "Music",
  subheading: "Listen on Spotify.",
  spotifyEmbed: `<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/artist/65l6MjVrzKqg5gNzo5K7ly?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`,
  // Height the embed renders at, in px. The placeholder reserves exactly this
  // so swapping in the real player shifts nothing. Keep it in step with the
  // `height` in the iframe above.
  embedHeight: 352,
  // Plain link to the same artist, used as the no-JS fallback.
  spotifyUrl: "https://open.spotify.com/artist/65l6MjVrzKqg5gNzo5K7ly",
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
// The standalone /gallery route is intentionally a holding page for now: a
// heading, a line of copy, and a way back. When the real collection is ready,
// this is where its copy goes.
//
// The grid that used to live here has NOT been thrown away — components/
// GalleryGrid.tsx still implements the full masonry + image/video lightbox, and
// the item shape it expects is documented at the top of that file. Dropping an
// `items` array back onto this object and rendering <GalleryGrid /> again on
// app/gallery/page.tsx is all it takes to bring it back.
export const galleryPage = {
  eyebrow: "Gallery",
  heading: "Coming soon",
  subheading:
    "A fuller collection of photography and video from the collective is on its way. In the meantime, there is a selection on the homepage.",
  backLabel: "Back to home",
};

/* --------------------------------------------------------------- CONTACT */
// Social links. Set `href` to "" to hide a given platform.
export const contact = {
  heading: "Get in touch",
  subheading:
    "Bookings, collaborations, press. Reach us directly or find us online.",
  email: site.email,
  // WhatsApp number, shown under the email. The wa.me link is derived from it
  // (non-digits stripped). Set to "" to hide the WhatsApp line entirely.
  whatsapp: "+44 7915 378469",
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
