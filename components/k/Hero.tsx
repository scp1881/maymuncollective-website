import Image from "next/image";
import TiltCard from "@/components/k/TiltCard";
import WaterLogo from "@/components/k/WaterLogo";
import { ArrowDown, LoopLine, Paren, SwooshLine } from "@/components/k/bits";
import { photos, site } from "@/content/site";

const LOGO = "/logo-wordmark.svg";

/**
 * The reference's hero, with Maymun's own material: the wordmark large at
 * centre (with the water ripple over it on desktop), a small portrait card
 * top-left with a vertical label and a scribble, a landscape card right, and
 * the 3D card stack straddling the bottom edge — a tilting front card with
 * two cards fanned behind it, the rotating circular label and a swoosh.
 *
 * The section is released (`.animated`) when the preloader finishes; see
 * components/k/Experience.
 */
export default function Hero() {
  const first = photos.backstage;
  const second = photos.studio;
  const front = photos.live;
  const back = [photos.room, photos.crew];

  return (
    <section id="top" className="section k-hero" aria-label={site.name}>
      <h1 className="hero-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt={site.name} width={294} height={168} fetchPriority="high" />
      </h1>
      <WaterLogo src={LOGO} />

      <div className="hero-card card-first">
        <div className="content rv">
          <span className="text">{first.label}</span>
          <div className="img">
            <Image
              src={first.src}
              alt={first.alt}
              width={first.width}
              height={first.height}
              sizes="(max-width: 768px) 24vw, 12vw"
              style={{ objectPosition: "50% 55%" }}
              priority
            />
          </div>
        </div>
        <LoopLine className="line" />
      </div>

      <div className="hero-card card-second">
        <div className="content rv">
          <div className="img">
            <Image src={second.src} alt={second.alt} width={second.width} height={second.height} sizes="(max-width: 768px) 37vw, 17vw" priority />
          </div>
          <span>{second.label}</span>
        </div>
      </div>

      <div className="k-cards">
        <div className="stack rv">
          {back.map((p) => (
            <div className="card" key={p.id}>
              <Image
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(max-width: 768px) 74vw, 33vw"
                style={{ objectPosition: p.id === "crew" ? "46% 50%" : "50% 50%" }}
              />
            </div>
          ))}
        </div>
        <TiltCard className="front rv">
          <div className="card">
            <Image
              src={front.src}
              alt={front.alt}
              width={front.width}
              height={front.height}
              sizes="(max-width: 768px) 74vw, 33vw"
              // The stage sits at 45–70% of this photo; the card's upper half is
              // what shows above the fold, so zoom towards the stage.
              style={{ objectPosition: "50% 70%", scale: "1.45", transformOrigin: "50% 64%" }}
            />
          </div>
        </TiltCard>
        <div className="meta">
          <p className="label">
            <span className="rv">
              <Paren>{site.shortDescription}</Paren>
            </span>
          </p>
          <div className="circle rv">
            <CircleLabel />
          </div>
          <SwooshLine className="line" style={{ ["--draw-delay" as string]: "1.2s" }} />
        </div>
      </div>
    </section>
  );
}

/** "müzik, música, music." set around a slowly turning circle. */
function CircleLabel() {
  const text = `${site.shortDescription} — ${site.shortDescription} — `;
  return (
    <div className="k-circle" aria-hidden="true">
      <svg className="k-ring" viewBox="0 0 192 192">
        <defs>
          <path id="k-circle-path" d="M96 96m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <circle cx="96" cy="96" r="95" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".8" />
        <circle cx="96" cy="96" r="62" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth=".8" />
        <text>
          <textPath href="#k-circle-path" textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <ArrowDown className="arrow" />
    </div>
  );
}
