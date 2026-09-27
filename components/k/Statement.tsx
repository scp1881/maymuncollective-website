import Link from "next/link";
import { ArrowRight, DropLine, Letters } from "@/components/k/bits";
import { gallery } from "@/content/site";

/**
 * The reference's quiet interlude after the hero ("EMPOWERING ARTISTS AND
 * REDEFINING THE FUTURE OF MUSIC"): two small uppercase lines typed in
 * letter by letter, the end in bold, and a long hand-drawn line falling from
 * them. Here it carries the gallery's own line, and it is the Gallery stop
 * in the menu — the photographs are the hero's card stack right above it,
 * and the full set is one link away.
 */
export default function Statement() {
  // "On stage and off it." → "ON STAGE" / "AND" + bold "OFF IT."
  const [first, rest] = gallery.subheading.split(" and ");
  return (
    <section id="gallery" className="section k-statement" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="sr-only">
        {gallery.heading}
      </h2>
      <div className="text">
        <Letters as="p" className="m" text={first.toUpperCase()} step={0.05} />
        <p>
          <Letters className="m" text="AND " start={0.45} step={0.05} />
          <Letters as="b" text={rest.toUpperCase()} start={0.65} step={0.05} />
        </p>
        <DropLine className="line" />
      </div>
      <p className="more rv">
        <Link href="/gallery" className="k-link">
          {gallery.moreLabel}
          <ArrowRight />
        </Link>
      </p>
    </section>
  );
}
