import ContactStream from "@/components/k/ContactStream";
import Waves from "@/components/k/Waves";
import { Cross, Letters, Paren } from "@/components/k/bits";
import { contact, site } from "@/content/site";

/**
 * The reference's "Send your demos" section: a giant marquee behind a
 * frosted glass panel (so its lower half blurs), animated wave lines inside
 * the panel, a title typed in letter by letter, and the contact stream — the
 * reference's pill with pagination and "Next step", as a three-step form that
 * records each message (see components/k/ContactStream and lib/contact).
 */
export default function Contact() {
  const tick = `${contact.email} —`;
  return (
    <section id="contact" className="section k-contact" data-grid="false" aria-labelledby="contact-heading">
      <div className="ticker" aria-hidden="true">
        <div className="strip">
          <span>{tick}</span>
          <span>{tick}</span>
        </div>
      </div>
      <div className="k-container">
        <div className="k-form">
          <Waves />
          <div className="content">
            <div className="wrap">
              <h2 id="contact-heading" className="k-label rv" style={{ ["--rv-y" as string]: "60%" }}>
                <Paren>{contact.heading}</Paren>
              </h2>
              <Letters as="p" className="title" text={contact.subheading} start={0.2} step={0.03} />
              <ContactStream />
            </div>
            <div className="left rv" style={{ ["--rv-y" as string]: "40%", ["--rv-delay" as string]: "0.6s" }}>
              <Cross />
              <p className="k-p">{site.shortDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
