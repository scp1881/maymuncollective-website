import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/k/Footer";
import GalleryWall from "@/components/k/GalleryWall";
import { ArrowRight, Paren } from "@/components/k/bits";
import { galleryPage, site } from "@/content/site";

export const metadata: Metadata = {
  title: galleryPage.heading,
  description: galleryPage.description,
  alternates: { canonical: "/gallery" },
  // Next replaces (not merges) the layout's openGraph object, so the share
  // image has to be restated here.
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
      <main id="content" tabIndex={-1} className="outline-none">
        <section className="section k-gpage" data-start="top 90%">
          <div className="k-container">
            <div className="head">
              <div>
                <p className="k-label rv" style={{ ["--rv-y" as string]: "60%" }}>
                  <Paren>{site.name}</Paren>
                </p>
                <h1 className="k-h1">
                  <span className="clip-line">
                    <span className="rv">{galleryPage.heading}</span>
                  </span>
                </h1>
              </div>
              <Link href="/" className="k-link rv">
                {galleryPage.backLabel}
                <ArrowRight />
              </Link>
            </div>
            <GalleryWall photos={galleryPage.images} />
          </div>
        </section>
      </main>
      <Footer home={false} />
    </>
  );
}
