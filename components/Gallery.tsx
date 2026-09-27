import Link from "next/link";
import Print from "@/components/Print";
import Section from "@/components/Section";
import { gallery } from "@/content/site";

/**
 * The homepage selection: the after-show panorama across the full measure,
 * then the backstage portrait set off to the right, with the way into the full
 * gallery in the space it leaves.
 *
 * Phones get their own crop of the portrait (4:5 rather than 2:3, so it doesn't
 * cost two screens of scrolling), and the panorama is never cropped at all —
 * it has people at both edges.
 */
export default function Gallery() {
  const [wide, portrait] = gallery.images;
  return (
    <Section id="gallery" heading={gallery.heading} lede={gallery.subheading}>
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-12">
        <figure className="lg:col-span-12">
          <Print photo={wide} sizes="(min-width: 1536px) 1424px, 100vw" />
          <figcaption className="mt-3 text-small text-ink-soft">{wide.label}</figcaption>
        </figure>
        <figure className="lg:col-span-5 lg:col-start-7 lg:row-start-2 lg:mt-8">
          <Print
            photo={portrait}
            ratio={{ sm: "4 / 5", lg: "2 / 3" }}
            sizes="(min-width: 1536px) 580px, (min-width: 1024px) 38vw, 100vw"
          />
          <figcaption className="mt-3 text-small text-ink-soft">{portrait.label}</figcaption>
        </figure>
        <p className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-end">
          <Link href="/gallery" className="title plate-link">
            {gallery.moreLabel}
          </Link>
        </p>
      </div>
    </Section>
  );
}
