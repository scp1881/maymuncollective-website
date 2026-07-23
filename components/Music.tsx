import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { music } from "@/content/site";

/**
 * Renders each release. When a real embed string is present (the full <iframe>
 * from Spotify / Apple Music), it is injected as markup. Until then, a clearly
 * labelled placeholder card is shown so the layout is complete during design.
 */
export default function Music() {
  return (
    <section id="music" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="02 — Music"
          heading={music.heading}
          subheading={music.subheading}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {music.releases.map((release, i) => (
            <Reveal key={release.id} delay={i * 80}>
              <article className="flex h-full flex-col rounded-xl border border-line bg-surface/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="eyebrow">{release.platform}</span>
                  <span className="text-sm text-muted">{release.title}</span>
                </div>

                {release.embed ? (
                  // The embed string is trusted operator-authored markup pasted
                  // from Spotify / Apple Music (not user input).
                  <div
                    className="overflow-hidden rounded-lg [&_iframe]:w-full"
                    dangerouslySetInnerHTML={{ __html: release.embed }}
                  />
                ) : (
                  <EmbedPlaceholder platform={release.platform} />
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmbedPlaceholder({ platform }: { platform: string }) {
  return (
    <div className="flex min-h-[152px] flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-ink/40 p-6 text-center">
      <p className="font-display text-sm font-medium text-bone">
        {platform} embed goes here
      </p>
      <p className="max-w-xs text-xs leading-relaxed text-muted">
        Paste the full <code className="text-accent">&lt;iframe&gt;</code> embed
        code into <code className="text-accent">content/site.ts</code>{" "}
        (<span className="text-accent">REPLACE_WITH_ACTUAL_EMBED</span>).
      </p>
    </div>
  );
}
