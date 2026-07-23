import Reveal from "@/components/Reveal";
import { contact, footer } from "@/content/site";

export default function Contact() {
  const socials = contact.socials.filter((s) => s.href);

  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-line py-24 sm:py-32"
    >
      <div className="container-page">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <Reveal>
            <p className="eyebrow mb-4">04 — Contact</p>
            <h2 className="font-display text-4xl font-semibold tracking-tightest sm:text-5xl">
              {contact.heading}
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted">
              {contact.subheading}
            </p>

            <a
              href={`mailto:${contact.email}`}
              className="mt-8 inline-block font-display text-2xl font-medium tracking-tight text-bone underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent sm:text-3xl"
            >
              {contact.email}
            </a>
          </Reveal>

          <Reveal delay={100} className="md:justify-self-end">
            <ul className="flex flex-col gap-1">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-8 border-b border-line py-4 text-lg transition-colors hover:text-accent"
                  >
                    <span>{social.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <footer className="mt-24 border-t border-line pt-8">
          <p className="text-sm text-muted">{footer.note}</p>
        </footer>
      </div>
    </section>
  );
}
