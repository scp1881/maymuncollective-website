import Image from "next/image";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { members } from "@/content/site";

export default function Members() {
  return (
    <section id="members" className="scroll-mt-20 border-t border-line py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow="03 — Members"
          heading={members.heading}
          subheading={members.subheading}
        />

        <ul className="grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3">
          {members.people.map((person, i) => (
            <Reveal as="li" key={person.id} delay={i * 70}>
              <MemberCard
                nickname={person.nickname}
                role={person.role}
                photo={person.photo}
                objectPosition={person.objectPosition}
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

type CardProps = {
  nickname: string;
  role: string;
  photo: string;
  objectPosition?: string;
};

/**
 * A collectible trading-card style member card:
 *   - thick accent frame + a thin inset double-line detail
 *   - the role/instrument as a bold vertical label up the left edge
 *   - a large photo bleeding to the frame edges
 *   - the nickname on a bold bottom banner
 */
function MemberCard({ nickname, role, photo, objectPosition }: CardProps) {
  return (
    <article className="group relative aspect-[5/7] overflow-hidden rounded-md border-4 border-accent bg-ink">
      {/* Photo (bleeds to the inner frame edges). `objectPosition` keeps the
          face framed; the image is only lightly cropped top/bottom. */}
      <div className="absolute inset-0 bg-surface">
        {photo ? (
          <Image
            src={photo}
            alt={`${nickname} — ${role}`}
            fill
            sizes="(min-width: 768px) 33vw, 50vw"
            style={{ objectPosition: objectPosition ?? "50% 30%" }}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <PhotoPlaceholder nickname={nickname} />
        )}
      </div>

      {/* Light scrims — only the lower third and the far-left edge, so the
          label + banner stay legible without darkening the faces (which all
          sit in the upper-middle of the frame). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-ink/50 to-transparent"
      />

      {/* Thin inset line — with the thick frame this reads as a double-line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-sm border border-accent/50"
      />
      {/* Extra corner accents near the top for a premium collectible feel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-2 top-2 h-6 w-6 rounded-tl-sm border-l-2 border-t-2 border-accent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-2 h-6 w-6 rounded-tr-sm border-r-2 border-t-2 border-accent"
      />

      {/* Vertical role label running up the left edge (shadowed for legibility
          over the photo rather than relying on a heavy scrim). */}
      <div className="absolute bottom-16 left-0 top-4 z-10 flex items-center">
        <span className="pl-3 font-display text-xs font-bold uppercase tracking-[0.25em] text-bone [text-shadow:0_1px_8px_rgba(0,0,0,0.85)] [writing-mode:vertical-rl] rotate-180 sm:text-sm">
          {role}
        </span>
      </div>

      {/* Bottom banner: nickname. */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3">
        <div className="rounded-sm bg-accent px-3 py-2">
          <h3 className="truncate text-center font-display text-xl font-extrabold uppercase leading-none tracking-tight text-ink sm:text-2xl">
            {nickname}
          </h3>
        </div>
      </div>
    </article>
  );
}

/** Styled fallback for the photo area until a real portrait is wired in. */
function PhotoPlaceholder({ nickname }: { nickname: string }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #f5f3ef 0, #f5f3ef 1px, transparent 1px, transparent 12px)",
        }}
      />
      <span className="font-display text-7xl font-bold text-line">
        {nickname.charAt(0).toLocaleUpperCase("tr")}
      </span>
    </div>
  );
}
