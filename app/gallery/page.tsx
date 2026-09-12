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
 * The layout leans on the hero's language rather than inventing a new one: the
 * same eyebrow, the same display face, the same accent rule, centred in the
 * viewport with the same radial glow behind it.
 */
export default function GalleryPage() {
  return (
    <>
      <Nav />

      <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Decorative glow, mirrored from the hero so the two pages feel related. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
        />

        <div className="relative flex flex-col items-center">
          <p className="eyebrow mb-5">{galleryPage.eyebrow}</p>

          <h1 className="font-display text-[clamp(2.75rem,9vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.03em]">
            {galleryPage.heading}
          </h1>

          {/* Short accent rule — the one bit of colour, echoing the underline
              under the contact email. */}
          <span aria-hidden="true" className="mt-8 block h-px w-16 bg-accent" />

          <p className="mt-8 max-w-md text-lg text-muted">{galleryPage.subheading}</p>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-2 border-b border-line pb-1 text-sm font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:border-accent hover:text-bone"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            {galleryPage.backLabel}
          </Link>
        </div>
      </main>
    </>
  );
}
