import type { ReactNode } from "react";

type Props = {
  id: string;
  heading: string;
  lede?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * Every section below the hero: a heavy ink rule (the fold of the poster), the
 * condensed heading, an optional lede set against it, then the content.
 */
export default function Section({ id, heading, lede, children, className = "" }: Props) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`fold ${className}`}>
      <div className="container-page py-section">
        <header className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id={headingId} className="display lg:col-span-8">
            {heading}
          </h2>
          {lede ? <p className="max-w-[34ch] text-lede text-ink-soft lg:col-span-4 lg:pb-3">{lede}</p> : null}
        </header>
        <div className="mt-12 lg:mt-20">{children}</div>
      </div>
    </section>
  );
}
