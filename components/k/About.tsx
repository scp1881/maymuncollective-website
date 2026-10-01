import Image from "next/image";
import { ArcLine, Eq, Paren } from "@/components/k/bits";
import { SPIRAL_PATH } from "@/components/k/spiral";
import { photos, site, tagline } from "@/content/site";

/**
 * The reference's big centred statement, set with Maymun's tagline: one
 * language per line, each rising in turn; a pill in the first line holds a
 * stage photo with an equaliser playing over it; the second line blinks
 * ("shine"), the third is underlined. Below it, the vinyl splits apart as it arrives and
 * its centre spins — the label is the Maymun spiral.
 */
export default function About() {
  const [tr, es, en] = tagline;
  return (
    <section className="section k-about" aria-label={site.shortDescription}>
      <div className="k-container">
        <ArcLine className="about-line" />
        <div className="about-text">
          <p className="ln k-h3 rv">
            <span className="k-label">
              <Paren>{site.name}</Paren>
            </span>
            <span lang={tr.lang}>{tr.text}</span>
            <span className="rect rv" aria-hidden="true">
              <Image src={photos.live.src} alt="" width={photos.live.width} height={photos.live.height} sizes="(max-width: 768px) 20vw, 10vw" style={{ objectPosition: "50% 45%" }} />
              <Eq bars={14} />
            </span>
          </p>
          <p className="ln k-h3 rv">
            <span className="shine" lang={es.lang}>
              {es.text}
            </span>
          </p>
          <p className="ln k-h3 rv">
            <span className="uline">{en.text}</span>
          </p>
        </div>
      </div>
      <Disc />
    </section>
  );
}

/* ── The vinyl. Pieces start stacked behind the centre disc and slide out
      (3 s, expo-out) when it reaches 60% of the viewport; the centre spins. */
function Disc() {
  return (
    <div className="k-disc" data-anim="" data-start="top 60%" aria-hidden="true">
      <div className="piece last l">
        <Crescent />
      </div>
      <div className="piece side l">
        <Half />
      </div>
      <div className="piece middle">
        {/* The record spins on its own HTML layer (composited); the drawn
            outline sits over it in a second, still SVG. */}
        <div className="vinyl">
          <svg viewBox="0 0 200 200">
            <defs>
              <radialGradient id="k-vinyl" cx="42%" cy="38%" r="75%">
                <stop offset="0" stopColor="#1f7a93" />
                <stop offset="0.55" stopColor="#0f4b5d" />
                <stop offset="1" stopColor="#082a34" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="97" fill="url(#k-vinyl)" />
            {[88, 80, 72, 64, 56, 48].map((r) => (
              <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth=".6" />
            ))}
            <circle cx="100" cy="100" r="34" fill="#0b3440" />
            <g transform="translate(76 76) scale(.2526)" fill="rgba(250,250,250,.85)">
              <path d={SPIRAL_PATH} />
            </g>
            <circle cx="100" cy="100" r="3.2" fill="#0e0f0f" />
          </svg>
        </div>
        <svg className="rim" viewBox="0 0 200 200">
          <g className="draw" style={{ ["--draw-d" as string]: "2s" }}>
            <path pathLength={1000} d="M100 1.5a98.5 98.5 0 1 1-.1 0" fill="none" stroke="#fafafa" strokeWidth="1.2" transform="translate(12 0)" />
          </g>
        </svg>
      </div>
      <div className="piece side r flip">
        <Half />
      </div>
      <div className="piece last r flip">
        <Crescent />
      </div>
    </div>
  );
}

function Half() {
  return (
    <svg viewBox="0 0 100 200">
      <defs>
        <linearGradient id="k-half" x1="0" x2="1">
          <stop offset="0" stopColor="#0b3a47" />
          <stop offset="1" stopColor="#1d7189" />
        </linearGradient>
      </defs>
      <path d="M100 2A98 98 0 0 0 100 198Z" fill="url(#k-half)" />
    </svg>
  );
}

function Crescent() {
  return (
    <svg viewBox="0 0 100 200">
      <path d="M100 2A98 98 0 0 0 100 198A70 98 0 0 1 100 2Z" fill="#0c3542" />
      <path d="M86 4A98 98 0 0 0 86 196" fill="none" stroke="#fafafa" strokeWidth="1.3" />
    </svg>
  );
}
