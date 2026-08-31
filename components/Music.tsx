import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { music } from "@/content/site";

/**
 * Renders the Spotify and Apple Music artist embeds side by side (stacked on
 * mobile). The embed strings are trusted, operator-authored markup pasted from
 * each platform's Share ▸ Embed dialog (not user input).
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

        <Reveal className="grid gap-6 md:grid-cols-2 md:items-start">
          <div
            className="overflow-hidden rounded-xl [&_iframe]:block [&_iframe]:w-full"
            dangerouslySetInnerHTML={{ __html: music.spotifyEmbed }}
          />
          <div
            className="overflow-hidden rounded-xl [&_iframe]:block [&_iframe]:w-full"
            dangerouslySetInnerHTML={{ __html: music.appleMusicEmbed }}
          />
        </Reveal>
      </div>
    </section>
  );
}
