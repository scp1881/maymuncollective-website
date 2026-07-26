import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { music } from "@/content/site";

/**
 * Renders the Spotify artist embed. The embed string is trusted, operator-
 * authored markup pasted from Spotify's Share ▸ Embed dialog (not user input).
 */
export default function Music() {
  return (
    <section id="music" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="02 — Music"
          heading={music.heading}
          subheading={music.subheading}
        />

        <Reveal className="mx-auto max-w-3xl">
          <div
            className="overflow-hidden rounded-xl [&_iframe]:block [&_iframe]:w-full"
            dangerouslySetInnerHTML={{ __html: music.spotifyEmbed }}
          />
        </Reveal>
      </div>
    </section>
  );
}
