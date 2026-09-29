import SpotifyEmbed from "@/components/k/SpotifyEmbed";
import { ArrowDownLeft, Ring } from "@/components/k/bits";
import { music } from "@/content/site";

/**
 * The reference's records section: on the left the title as an outline that
 * fills in; on the right a second title with a drawn circle arrow (it turns on hover), and the
 * list — here the Spotify artist player, loaded as the section approaches.
 */
export default function Music() {
  const [a, b] = splitLast(music.subheading); // "Listen on" / "Spotify."
  return (
    <section id="music" className="section k-music" aria-labelledby="music-heading">
      <div className="k-container">
        <div className="text-col">
          <h2 id="music-heading" className="k-h2 outline-fill">
            <span className="o">{music.heading}</span>
            <span className="f" aria-hidden="true">
              {music.heading}
            </span>
          </h2>
        </div>
        <div className="list">
          <div className="list-top">
            <p className="k-h2">
              <span className="clip-line">
                <span className="rv">{a}</span>
              </span>
              <span className="clip-line">
                <span className="rv">{b}</span>
              </span>
            </p>
            <a className="arrow" href={music.spotifyUrl} target="_blank" rel="noopener noreferrer" aria-label={music.subheading} data-cursor="play">
              <Ring className="k-ring" />
              <ArrowDownLeft className="ico rv" />
            </a>
          </div>
          <div className="player rv">
            <div className="plate">
              <SpotifyEmbed />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function splitLast(s: string): [string, string] {
  const i = s.lastIndexOf(" ");
  return i < 0 ? [s, ""] : [s.slice(0, i), s.slice(i + 1)];
}
