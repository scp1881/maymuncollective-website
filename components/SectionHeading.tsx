import Reveal from "@/components/Reveal";

type SectionHeadingProps = {
  heading: string;
  subheading?: string;
};

/**
 * Consistent heading block used at the top of each content section.
 *
 * Set in the hero's language: the same display face, the same extrabold weight,
 * the same uppercase and the same negative tracking, just at a size that keeps
 * it clearly subordinate to the name. The sections used to carry a numbered
 * eyebrow ("01 — Gallery") above a sentence-case heading; with the hero reduced
 * to type alone, that was a second, quieter typographic system running down the
 * page, and the number was labelling sections a visitor can already count.
 *
 * Every heading is a single word today, so nothing wraps and `text-balance`
 * does nothing. It stays because these are editable copy: at this size a
 * two-word heading wraps on a phone, and without it the second line can be
 * left carrying one short word.
 */
export default function SectionHeading({
  heading,
  subheading,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-2xl sm:mb-16">
      <h2 className="text-balance font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
        {heading}
      </h2>
      {subheading && (
        <p className="mt-5 text-lg text-muted sm:mt-6">{subheading}</p>
      )}
    </Reveal>
  );
}
