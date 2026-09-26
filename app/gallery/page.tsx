import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import { galleryPage } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A fuller collection of photography and video from Maymun Collective — coming soon.",
  // A holding page has nothing worth ranking yet, and letting it index would
  // put a "Coming soon" result under the site's name. `follow` stays on so the
  // links back into the homepage still carry weight.
  robots: { index: false, follow: true },
};

/**
 * Holding page for the full gallery.
 *
 * Carries the site's own header (the same <Nav /> as the homepage, which
 * rewrites its section links to `/#section` when it is not on the homepage) so
 * this never feels like a dead end — every section is one click away.
 *
 * The layout is the homepage's, not a new one: the same left rail, the same
 * display face at the same weight and tracking, the same single signal colour.
 * What it does not carry any more is a radial magenta glow behind the heading —
 * that was decoration standing in for a design, and on a page whose entire
 * message is "not yet" it was the loudest thing on screen.
 */
export default function GalleryPage() {
  return (
    <>
      <Nav />

      <main className="container-rail flex min-h-svh flex-col justify-center py-32">
        <div className="max-w-2xl">
          {/* This label earns its place: the heading says "Coming soon" and
              nothing else on the page says what is coming. */}
          <p className="note">{galleryPage.eyebrow}</p>

          {/* Same weight and tracking as the hero name and the section
              headings — one display system across the whole site. */}
          <h1 className="mt-4 font-display text-[clamp(2.75rem,9vw,5.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
            {galleryPage.heading}
          </h1>

          <p className="lede mt-8">{galleryPage.subheading}</p>

          <Link
            href="/"
            className="-my-3 mt-8 inline-block py-3 text-bone underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-stage focus-visible:decoration-stage"
          >
            {galleryPage.backLabel}
          </Link>
        </div>
      </main>

    </>
  );
}
