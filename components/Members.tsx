import Section from "@/components/Section";
import { members } from "@/content/site";

/**
 * Members.
 *
 * Eight people, each with one instrument or job. That is a list, and a list is
 * the honest form for it — the temptation with a band is a grid of portrait
 * cards, which would mean eight photographs nobody has and eight rounded
 * rectangles that all look the same.
 *
 * What the old version got wrong was weight: names at 18px in the body face,
 * so the section's substance was smaller than its own standfirst. The names are
 * the content here, so they are set in the display face at a size that makes
 * that obvious, and the roles sit quietly against them.
 *
 * Rows are separated by a hairline and are 5rem tall at the smallest. That is
 * partly rhythm and partly that a row is a touch target on a phone even when
 * it is not a link — a 44px row of text is uncomfortable to read past, let
 * alone aim at.
 *
 * On a phone the name and the role stack, because a name like "Ada Kar
 * Tamyürek" opposite "Management & Booking" on a 390px screen leaves each of
 * them about nine characters before they collide. The desktop layout puts them
 * on one line, where there is room for the relationship to read left-to-right.
 */
export default function Members() {
  return (
    <Section id="members" heading={members.heading} lede={members.subheading}>
      <ul className="border-t border-line">
        {members.people.map((person) => (
          <li
            key={person.id}
            className="flex min-h-[4.5rem] flex-col justify-center gap-0.5 border-b border-line py-4 sm:min-h-20 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-5"
          >
            <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
              {person.name}
            </h3>
            <p className="note sm:shrink-0 sm:text-right">{person.role}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
