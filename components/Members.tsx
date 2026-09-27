import Section from "@/components/Section";
import { members } from "@/content/site";

/**
 * The roster as poster credits: who plays, then who makes it happen. The
 * players' names print a step larger than the crew's, the way a bill tops
 * the performers. Names are set condensed and widen under a pointer
 * (hover-only; see `.member` in globals.css).
 */
export default function Members() {
  return (
    <Section id="members" heading={members.heading}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
        {members.groups.map((group, g) => (
          <div key={group.label} className="lg:col-span-6">
            <h3 className="label-plate">{group.label}</h3>
            <ul className="mt-8 grid gap-6 sm:gap-8">
              {group.people.map((person) => (
                <li key={person.name} className="member">
                  <span className={`title block ${g === 0 ? "title-lead" : ""}`}>{person.name}</span>
                  <span className="mt-2 block text-ink-soft">{person.role}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
