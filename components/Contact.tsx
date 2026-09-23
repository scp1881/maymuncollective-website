import Reveal from "@/components/Reveal";
import { contact, footer } from "@/content/site";

/** WhatsApp glyph. Monochrome via currentColor so it picks up the link's
 *  hover colour rather than introducing the brand green. */
function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1.05em] w-[1.05em] shrink-0 fill-current"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
              // `overflow-wrap: anywhere` rather than `break-words`: only
              // `anywhere` also shrinks the element's min-content width, and it
              // is that width — the unbreakable address at 24px — that was
              // propping the grid column open and giving the whole page a
              // horizontal scrollbar at 320px.
              className="mt-8 inline-block font-display text-2xl font-medium tracking-tight text-bone underline decoration-accent decoration-2 underline-offset-8 transition-colors [overflow-wrap:anywhere] hover:text-accent sm:text-3xl"
            >
              {contact.email}
            </a>

            {contact.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Message us on WhatsApp at ${contact.whatsapp}`}
                className="mt-5 flex w-fit items-center gap-2 text-base text-muted transition-colors hover:text-accent sm:text-lg"
              >
                <WhatsAppIcon />
                <span>{contact.whatsapp}</span>
              </a>
            )}
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
