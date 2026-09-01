import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

// Display face: tight, modern, a little characterful — used for headings.
//
// Left as a variable font on purpose: the design uses three weights (500/600/
// 700) and one variable file covers all of them. Pinning `weight` was measured
// and is worse — Google serves a separate static file per weight, and for Inter
// those are no smaller than the variable font, so the payload multiplies.
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body face: clean, highly legible workhorse.
//
// Kept preloaded. Dropping its preload was tried — it is the largest font on
// the site (~47 KB) and never sets the LCP element — and it did land the
// display font ~120 ms sooner, but it bought nothing measurable because LCP
// here is gated by the hero's own entrance animation, not by fonts. What it did
// cost was visible: body text swapped from the fallback at ~1.85 s, i.e. after
// the hero had already finished animating in, turning an unnoticed swap into a
// visible one. Not a good trade.
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.shortDescription}`,
    template: `%s — ${site.name}`,
  },
  description: site.shortDescription,
  keywords: ["collective", "music", "creative", site.name],
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.shortDescription}`,
    description: site.shortDescription,
    siteName: site.name,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.shortDescription}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.shortDescription}`,
    description: site.shortDescription,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      {/* The Music section's Spotify embed is lazy-loaded, so the browser only
          discovers open.spotify.com once the visitor scrolls to it — and then
          pays DNS + TCP + TLS before a single byte of the player arrives.
          Warming the connection up front turns that into a much shorter wait.
          Only the embed's own origin is listed; the player pulls its assets
          from further hosts, but speculatively connecting to all of them would
          cost more on the initial load than it saves. */}
      <link rel="preconnect" href="https://open.spotify.com" />
      <body>
        {/* Scroll-reveal enhancement. Deliberately an inline, blocking script
            as the first thing in <body>: the parser runs it before any
            [data-reveal] element below exists, so the hidden state is in place
            before the first paint and nothing flashes in and back out.

            It is ~15 lines rather than a React component because the reveals
            used to be gated on hydration — a visitor scrolling straight down
            met a blank page until the bundle finished. This runs at
            DOMContentLoaded instead, which lands several times sooner, and
            costs nothing in the JS bundle.

            `.reveal-js` is only added once we know both that the browser has
            IntersectionObserver and that the visitor has not asked for reduced
            motion; otherwise the CSS never hides anything in the first place. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;try{if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;}catch(e){return}d.className+=' reveal-js';function s(){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-revealed','');o.unobserve(e.target)}})},{threshold:0.15,rootMargin:'0px 0px -10% 0px'});[].forEach.call(document.querySelectorAll('[data-reveal]'),function(el){o.observe(el)})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',s)}else{s()}})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
