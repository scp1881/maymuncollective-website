import type { CSSProperties } from "react";
import { ArrowDownLeft, Eq, Paren, Ring } from "@/components/k/bits";
import { contact } from "@/content/site";

/**
 * Every direct line to the collective in one row, set like the channel
 * strips of a mixing desk: name and a turning arrow at the top, a level meter
 * in the middle, the address at the foot. The meters rest grey and play in
 * teal when a strip is pointed at or focused (the same equaliser the member
 * cards use), so the one moving thing answers the reader. Each strip is a
 * single link. On phones the strips become rows and the meters drop out.
 */
export default function Channels() {
  const { channels } = contact;
  const wa = contact.whatsapp.replace(/\D/g, "");
  const strips = [
    { name: channels.email, value: contact.email, href: `mailto:${contact.email}`, external: false, wide: true },
    ...(wa ? [{ name: channels.whatsapp, value: contact.whatsapp, href: `https://wa.me/${wa}`, external: true, wide: false }] : []),
    ...contact.socials.map((s) => ({ name: s.label, value: s.handle, href: s.href, external: true, wide: false })),
  ];

  return (
    // The grid fades out here (and stays out through Contact), once the
    // section's top is 30% down the screen rather than at mid-screen.
    <section id="channels" className="section k-channels" data-grid="false" data-active-start="top 30%" aria-labelledby="channels-heading">
      <div className="k-container">
        <div className="head">
          <p className="k-label rv">
            <Paren>{channels.label}</Paren>
          </p>
          <h2 id="channels-heading" className="title">
            <span className="clip-line">
              <span className="rv">{channels.heading}</span>
            </span>
          </h2>
        </div>
        <ul className="strips">
          {strips.map((c, n) => (
            <li key={c.name} className={`strip ${c.wide ? "wide" : ""}`} style={{ "--n": n } as CSSProperties}>
              <a href={c.href} className="rv" {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="top">
                  <span className="name">{c.name}</span>
                  <span className="sr-only">: </span>
                  <span className="go" aria-hidden="true">
                    <Ring className="k-ring" />
                    <ArrowDownLeft className="ico" />
                  </span>
                </span>
                <span className="meter" aria-hidden="true">
                  <Eq bars={c.wide ? 18 : 10} live={false} />
                </span>
                <span className="value">{c.value}</span>
                {c.external ? <span className="sr-only">{channels.newTab}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
