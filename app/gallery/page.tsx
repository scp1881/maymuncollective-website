import type { Metadata } from "next";
import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import Wordmark from "@/components/Wordmark";
import { galleryPage } from "@/content/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photography, artwork, and video from Maymun Collective.",
};

export default function GalleryPage() {
  return (
    <>
      {/* Minimal header — logo and back link both return to the homepage.
          Deliberately simpler than the homepage nav (no section anchors). */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
        <nav className="container-page flex h-16 items-center justify-between" aria-label="Primary">
          <Link
            href="/"
            className="-m-2 flex shrink-0 items-center rounded-md p-2 transition-opacity hover:opacity-80"
          >
            <Wordmark className="h-9 sm:h-10" />
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ←
            </span>
            Back to home
          </Link>
        </nav>
      </header>

      <main className="pt-16">
        <section className="py-16 sm:py-24">
          <div className="container-page">
            <p className="eyebrow mb-4">Photos &amp; Video</p>
            <h1 className="font-display text-4xl font-semibold tracking-tightest sm:text-5xl">
              {galleryPage.heading}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{galleryPage.subheading}</p>

            <div className="mt-12 sm:mt-16">
              <GalleryGrid />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
