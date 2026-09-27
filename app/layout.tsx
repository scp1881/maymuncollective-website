import type { Metadata, Viewport } from "next";
import SkipLink from "@/components/SkipLink";
import { site } from "@/content/site";
import "./globals.css";

const title = `${site.name} — ${site.shortDescription}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s — ${site.name}` },
  description: site.shortDescription,
  keywords: ["collective", "music", "creative", site.name],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    title,
    description: site.shortDescription,
    siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.shortDescription,
    images: [site.ogImage],
  },
};

/**
 * Short SHA of the commit this build came from, so "is this the new build or a
 * cached old one?" can be answered from view-source. Vercel sets the variable;
 * local builds say "local".
 */
const BUILD_COMMIT = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);

export const viewport: Viewport = {
  themeColor: "#0D0F1C",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="build-commit" content={BUILD_COMMIT} />
        {/* The Latin cut draws the whole first screen (the tagline is the
            largest element), so it is the one font file preloaded. The small
            Turkish cut is found by unicode-range when the member names need
            it. */}
        <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* The Spotify player is withheld until the Music section nears the
            viewport (components/SpotifyEmbed); warming its origin up front
            means it doesn't pay DNS + TLS on arrival. */}
        <link rel="preconnect" href="https://open.spotify.com" />
      </head>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
