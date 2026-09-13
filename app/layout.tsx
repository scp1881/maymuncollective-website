import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import "./globals.css";

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

/**
 * Which commit this page was built from, stamped into the markup.
 *
 * "Is what I'm looking at the new build, or a cached old one?" has come up
 * repeatedly and there was no way to answer it from the page itself. Now
 * `view-source` (or the Elements panel) shows the short SHA, and it can be
 * compared against the repo without guessing from behaviour.
 *
 * Vercel sets VERCEL_GIT_COMMIT_SHA during the build; local builds say "local".
 */
const BUILD_COMMIT = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <meta name="build-commit" content={BUILD_COMMIT} />
      {/* Only what the first screen actually draws is preloaded: the
          headline-only cut of the display face (the H1 is the LCP element) and
          Inter's latin cut (nav and tagline). The full display face and both
          `ext` cuts are left to be discovered by unicode-range when a heading
          or a Turkish member name below the fold needs them, which keeps them
          off the critical path. Declared here rather than by next/font, which
          no longer manages these — see app/globals.css. */}
      <link rel="preload" href="/fonts/bricolage-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      {/* The Spotify player is now deliberately withheld until the Music
          section nears the viewport (see components/SpotifyEmbed), so the
          browser would otherwise not discover open.spotify.com until then and
          would pay DNS + TCP + TLS before a single byte of the player arrived.
          Warming just that one origin up front turns the wait on arrival into a
          much shorter one, without pulling any of the player itself. */}
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
