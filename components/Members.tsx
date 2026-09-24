import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { members } from "@/content/site";

export default function Members() {
  return (
    <section id="members" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          heading={members.heading}
          subheading={members.subheading}
        />

        <ul className="border-t border-line">
          {members.people.map((person, i) => (
            <Reveal as="li" key={person.id} delay={i * 40} className="border-b border-line">
              {/* Name left, role right — the row spans the full width so the
                  hairline rules read as an even, deliberate list. */}
              <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-6">
                <h3 className="font-display text-lg font-medium tracking-tight sm:text-xl">
                  {person.name}
                </h3>
                <p className="text-sm text-muted sm:text-right sm:text-base">
                  {person.role}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
