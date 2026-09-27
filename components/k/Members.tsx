import type { CSSProperties } from "react";
import DragSlider from "@/components/k/DragSlider";
import { ArrowRight, Eq, Paren } from "@/components/k/bits";
import { contact, members, ui } from "@/content/site";

/**
 * The reference's "Our / Artists" section: the two-line title with the
 * second line indented and a small label under it, a text block with a
 * sound-wave icon and a link, then a draggable row of cards — number, name,
 * text and a picture, the layout alternating top/bottom from card to card.
 *
 * Maymun has no member portraits, and a group photo in a single member's
 * card would say something untrue, so each card's picture is an equaliser
 * tile: still and grey at rest, playing in teal under the pointer — the
 * reference's grayscale-to-colour, in sound instead of photographs.
 */
export default function Members() {
  const people = members.groups.flatMap((g) => g.people.map((p) => ({ ...p, group: g.label })));
  const [onStage, offStage] = members.groups.map((g) => g.label);

  return (
    <section id="members" className="section k-members" data-grid="false" aria-labelledby="members-heading">
      <div className="wrap">
        <div className="k-container top">
          <div className="title-row">
            <div className="title-col">
              <div className="k-h1" aria-hidden="true">
                <span className="clip-line">
                  <span className="rv">{onStage}</span>
                </span>
                <span className="clip-line">
                  <span className="rv">{offStage}</span>
                </span>
              </div>
              <h2 id="members-heading" className="k-label rv">
                <Paren>{members.heading}</Paren>
              </h2>
            </div>
            <div className="text-block">
              <span className="icon rv">
                <Eq bars={5} />
              </span>
              <p className="k-p rv">{contact.subheading}</p>
              <p className="rv" style={{ ["--rv-y" as string]: "40%", ["--rv-delay" as string]: "0.7s" }}>
                <a className="k-link" href="#contact">
                  {contact.heading}
                  <ArrowRight />
                </a>
              </p>
            </div>
          </div>
        </div>

        <DragSlider className="slider" label={ui.membersRegion}>
          {people.map((p, i) => (
            <article key={p.name} className={`k-mcard ${i % 2 ? "alt" : ""}`} data-cursor="hide" style={{ "--i": i } as CSSProperties}>
              <div className="title rv">
                <sup>
                  <Paren>{i + 1}</Paren>
                </sup>
                <h3>{p.name}</h3>
              </div>
              <div className="role rv">
                <p>{p.role}</p>
                <span className="group">{p.group}</span>
              </div>
              <div className="media rv" aria-hidden="true">
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <Eq bars={9} live={false} />
              </div>
            </article>
          ))}
        </DragSlider>
      </div>
    </section>
  );
}
