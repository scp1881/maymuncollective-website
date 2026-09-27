import Section from "@/components/Section";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { music } from "@/content/site";

/**
 * The Spotify artist player, printed like everything else: a violet plate sits
 * behind it, out of register, so a third-party widget still belongs to the
 * poster. Heading and player sit side by side — a lone player under a giant
 * word left half the section empty. The lede is the always-visible fallback
 * link to the same artist.
 */
export default function Music() {
  return (
    <Section
      id="music"
      layout="split"
      heading={music.heading}
      lede={
        <a href={music.spotifyUrl} target="_blank" rel="noopener noreferrer" className="plate-link text-ink">
          {music.subheading}
        </a>
      }
    >
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 translate-x-[10px] -translate-y-[8px] bg-violet" />
        <div className="relative">
          <SpotifyEmbed />
        </div>
      </div>
    </Section>
  );
}
