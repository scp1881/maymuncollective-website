import Reveal from "@/components/Reveal";

type SectionHeadingProps = {
  /** Small uppercase eyebrow label (e.g. section number or category). */
  eyebrow?: string;
  heading: string;
  subheading?: string;
};

/** Consistent heading block used at the top of each content section. */
export default function SectionHeading({
  eyebrow,
  heading,
  subheading,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-2xl sm:mb-16">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="font-display text-4xl font-semibold tracking-tightest sm:text-5xl">
        {heading}
      </h2>
      {subheading && (
        <p className="mt-4 text-lg text-muted">{subheading}</p>
      )}
    </Reveal>
  );
}
