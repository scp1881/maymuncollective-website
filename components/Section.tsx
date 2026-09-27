import type { ReactNode } from "react";

type Props = {
  id: string;
  heading: string;
  lede?: ReactNode;
  /** "stack": heading across the measure, lede under it, content below.
   *  "split": heading and lede in a column beside the content (lg up). */
  layout?: "stack" | "split";
  children: ReactNode;
  className?: string;
};

/**
 * Every section below the hero opens on a fold (a heavy ink rule with
 * registration marks at its ends — see `.fold` in globals.css). What follows
 * depends on the content: most sections stack; one that has little to show
 * beside its heading sits the two side by side, so no two sections read as
 * stamped from the same mould.
 */
export default function Section({ id, heading, lede, layout = "stack", children, className = "" }: Props) {
  const headingId = `${id}-heading`;
  const header = (
    <header>
      <h2 id={headingId} className="display">
        {heading}
      </h2>
      {lede ? <p className="mt-5 max-w-[34ch] text-lede text-ink-soft lg:mt-7">{lede}</p> : null}
    </header>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={`fold ${className}`}>
      <div className="container-page py-section">
        {layout === "split" ? (
          <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">{header}</div>
            <div className="lg:col-span-7">{children}</div>
          </div>
        ) : (
          <>
            {header}
            <div className="mt-10 lg:mt-20">{children}</div>
          </>
        )}
      </div>
    </section>
  );
}
