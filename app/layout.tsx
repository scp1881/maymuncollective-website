import type { Metadata, Viewport } from "next";
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

/** Short SHA of this build, readable from view-source. */
const BUILD_COMMIT = (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7);

export const viewport: Viewport = {
  themeColor: "#0e0f0f",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

/**
 * Runs before first paint: marks that JavaScript is on (so reveal start
 * states may be hidden), decides whether the page animates (html.motion:
 * on unless the system asks for reduced motion; `?motion=on|off` overrides
 * that for the browser session) and whether the preloader plays — only on a
 * first visit to the homepage with motion on. Everyone else goes straight
 * to html.page-loaded.
 */
const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');var m=!matchMedia('(prefers-reduced-motion: reduce)').matches;try{var q=/[?&]motion=(on|off)/.exec(location.search);if(q)sessionStorage.setItem('mc-motion',q[1]);var o=sessionStorage.getItem('mc-motion');if(o)m=o==='on'}catch(e){}if(m)d.classList.add('motion');var s=!m||location.pathname!=='/';try{if(localStorage.getItem('mc-loaded')==='1')s=true}catch(e){}if(s)d.classList.add('no-preloader','page-loaded')})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <meta name="build-commit" content={BUILD_COMMIT} />
        <link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://open.spotify.com" />
      </head>
      {/* The site's chrome (preloader, header, menu, smooth scroll) lives in
          app/(site)/layout.tsx; pages outside that group, like /inbox, get
          only this document shell. */}
      <body>{children}</body>
    </html>
  );
}
