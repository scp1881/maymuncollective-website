type SectionProps = {
  id: string;
  heading: string;
  /** Standfirst under the heading. */
  lede?: string;
  /** Extra classes for the content column. */
  contentClassName?: string;
  children: React.ReactNode;
};

/**
 * The shell every content section sits in.
 *
 * ── Why this exists ───────────────────────────────────────────────────────
 * The page used to be four sections with identical construction: a top border,
 * the same vertical padding, a heading, a grey line of copy, then content, all
 * on the same centred measure. Four identical rhythms in a row is what made
 * everything below the hero read as a template — nothing ranked against
 * anything else, so the eye had nowhere to go.
 *
 * ── The grid ──────────────────────────────────────────────────────────────
 * From `lg` up the heading and its standfirst occupy a narrow left column
 * (4 of 12) and the content takes the wide one (8 of 12). That asymmetry gives
 * the page a consistent reading path — who is speaking on the left, what they
 * are showing you on the right — and it lets the content column be genuinely
 * wide instead of sharing a centred measure with a heading.
 *
 * The header column is `sticky`. On the long sections — the members list, the
 * gallery — the heading stays with you while the content scrolls past, so you
 * always know what you are looking at. `self-start` is what makes sticky work
 * inside a grid: without it the column stretches to the row height and has
 * nothing to stick within.
 *
 * Below `lg` the columns stack: the label above the thing it labels.
 *
 * ── What is deliberately NOT here ─────────────────────────────────────────
 * No divider. An earlier draft gave every section a full-bleed hairline above
 * it, which is the broadsheet move — hairline rules, hard corners, dense
 * columns — and it is a look that arrives whatever the subject rather than one
 * this band asked for. Sections are separated by space, and once by a
 * photograph running the full width of the screen (see app/page.tsx), which is
 * a divider made of the band's own material instead of a borrowed convention.
 *
 * No entrance animation either. Fading and lifting every section into view is
 * the other reflex; it puts motion on content that has not changed and that
 * nobody asked to see move. The hero's one entrance is the page's only
 * non-interactive motion now.
 */
export default function Section({
  id,
  heading,
  lede,
  contentClassName = "",
  children,
}: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="container-rail">
        <div className="grid gap-y-8 py-24 sm:py-28 lg:grid-cols-12 lg:gap-x-10 lg:py-36">
          <header className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <h2 className="text-balance font-display text-[clamp(2.5rem,7vw,4.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.035em]">
              {heading}
            </h2>
            {lede && <p className="lede mt-5">{lede}</p>}
          </header>

          <div className={`lg:col-span-8 ${contentClassName}`}>{children}</div>
        </div>
      </div>
    </section>
  );
}
