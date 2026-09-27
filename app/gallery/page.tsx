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
  openGraph: {
    url: `${site.url}/gallery`,
    title: `${galleryPage.heading} — ${site.name}`,
    description: galleryPage.description,
  },
};

export default function GalleryPage() {
  return (
    <>
      <Nav />
      <main id="content" tabIndex={-1} className="outline-none">
        <div className="container-page pb-section pt-[120px] lg:pt-[160px]">
          <h1 className="display">{galleryPage.heading}</h1>
          <div className="mt-12 lg:mt-20">
            <GalleryWall photos={galleryPage.images} />
          </div>
          <p className="mt-20 lg:mt-28">
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
