import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { music } from "@/content/site";

/**
 * The Music section. The player itself is deferred until this section nears the
 * viewport — see components/SpotifyEmbed for why.
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
          <SpotifyEmbed />
        </Reveal>
      </div>
    </section>
  );
}
