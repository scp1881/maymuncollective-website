import Section from "@/components/Section";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import DriftPlate from "@/components/DriftPlate";
import { music } from "@/content/site";

/**
 * The Spotify artist player, printed like everything else: a violet plate sits
 * behind it, out of register, so a third-party widget still belongs to the
 * poster; under a mouse it drifts with the pointer (components/DriftPlate).
 * Heading and player sit side by side — a lone player under a giant
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
        <DriftPlate className="absolute inset-0 bg-violet" />
        <div className="relative">
          <SpotifyEmbed />
        </div>
      </div>
    </Section>
  );
}
