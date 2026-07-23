import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { members } from "@/content/site";

// Builds initials from a name for the fallback monogram (skips REPLACE markers).
function initials(name: string) {
  const clean = name.replace(/REPLACE\s*—?\s*/i, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
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

        <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {members.people.map((person, i) => (
            <Reveal as="li" key={person.id} delay={i * 70} className="group">
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-lg bg-surface">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={`Portrait of ${person.name}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  // Monogram fallback until a real photo is added.
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-display text-4xl font-semibold text-line">
                      {initials(person.name)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">
                {person.name}
              </h3>
              <p className="mt-1 text-sm text-muted">{person.role}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
