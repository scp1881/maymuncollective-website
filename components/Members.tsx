import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { members } from "@/content/site";

type Person = (typeof members.people)[number];

// Resolve a person's single contact method into a display label + optional
// href. With no phone or email set, returns a muted placeholder (no link).
function contactFor(person: Person): { label: string; href?: string } {
  if (person.email) {
    return { label: person.email, href: `mailto:${person.email}` };
  }
  if (person.phone) {
    // tel: links must be free of spaces; keep the pretty spacing for display.
    return { label: person.phone, href: `tel:${person.phone.replace(/\s+/g, "")}` };
  }
  return { label: "—" };
}

export default function Members() {
  return (
    <section id="members" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="03 — Members"
          heading={members.heading}
          subheading={members.subheading}
        />

        <ul className="border-t border-line">
          {members.people.map((person, i) => {
            const contact = contactFor(person);
            return (
              <Reveal as="li" key={person.id} delay={i * 40} className="border-b border-line">
                <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[1.2fr_1fr_16rem] sm:items-baseline sm:gap-8 sm:py-6">
                  <h3 className="font-display text-lg font-medium tracking-tight sm:text-xl">
                    {person.name}
                  </h3>
                  <p className="text-sm text-muted sm:text-base">{person.role}</p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      className="w-fit text-sm text-muted transition-colors hover:text-accent sm:justify-self-end sm:text-base"
                    >
                      {contact.label}
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="w-fit text-sm text-muted/60 sm:justify-self-end sm:text-base"
                    >
                      {contact.label}
                    </span>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
