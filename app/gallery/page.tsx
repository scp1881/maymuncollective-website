import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GalleryWall from "@/components/GalleryWall";
import { galleryPage, site } from "@/content/site";

export const metadata: Metadata = {
  title: galleryPage.heading,
  description: galleryPage.description,
  alternates: { canonical: "/gallery" },
  // Next replaces (not merges) the layout's openGraph object, so the share
  // image has to be restated here or /gallery links preview without one.
  openGraph: {
    type: "website",
    url: `${site.url}/gallery`,
    title: `${galleryPage.heading} — ${site.name}`,
    description: galleryPage.description,
    siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} — ${site.shortDescription}` }],
  },
};

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="container-page pb-section pt-[120px] lg:pt-[160px]">
          <h1 className="display">{galleryPage.heading}</h1>
          <div className="mt-12 lg:mt-24">
            <GalleryWall photos={galleryPage.images} />
          </div>
          <p className="mt-24 lg:mt-32">
            <Link href="/" className="title plate-link">
              {galleryPage.backLabel}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
