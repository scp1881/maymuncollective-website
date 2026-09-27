import Print from "@/components/Print";
import Tagline from "@/components/Tagline";
import Wordmark from "@/components/Wordmark";
import { hero } from "@/content/site";

/**
 * The poster's top half: the name, the tagline in its three widths, and one
 * photograph printed beside it.
 *
 * The <h1> is the wordmark; its `alt` ("Maymun Collective") is the heading's
 * accessible name. Nothing here starts transparent — the tagline's load sweep
 * animates width only — so the largest element paints on the first frame and
 * LCP is not held back by an entrance animation.
 */
export default function Hero() {
  return (
    <section id="top" aria-label="Maymun Collective" className="container-page pb-section pt-[104px] lg:pt-[128px]">
      <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1>
            <Wordmark className="h-[84px] sm:h-[108px] lg:h-[132px]" />
          </h1>
          <Tagline className="mt-10 lg:mt-14" />
        </div>
        <div className="lg:col-span-5">
          <Print
            photo={hero.photo}
            ratio={{ sm: "4 / 5" }}
            sizes="(min-width: 1536px) 620px, (min-width: 1024px) 40vw, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  );
}
