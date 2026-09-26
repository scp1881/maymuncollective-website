import Section from "@/components/Section";
import SpotifyEmbed from "@/components/SpotifyEmbed";
import { music } from "@/content/site";

/**
 * The Music section. The player itself is deferred until this section nears the
 * viewport — see components/SpotifyEmbed for why.
 *
 * The player is a fixed 352px-tall third-party box with its own rounded corners
 * and its own green, and nothing here can change that. What this section can do
 * is stop it floating: previously it sat alone and centred in an otherwise
 * empty band of page, which made the emptiness look like a mistake. Now it
 * occupies the content column like every other section's substance does, with
 * the heading beside it, so it reads as one item in a page rather than an
 * embed dropped into a gap.
 */
export default function Music() {
  return (
    <Section id="music" heading={music.heading} lede={music.subheading}>
      <SpotifyEmbed />
    </Section>
  );
}
