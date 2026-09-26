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
        {children}
      </body>
    </html>
  );
}
