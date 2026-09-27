import Section from "@/components/Section";
import { contact, ui } from "@/content/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/**
 * The bare host of a profile URL, e.g. "instagram.com", shown opposite each
 * social name: it says where the link goes, which an arrow would not.
 */
function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * The email address is the headline of the section, fitted to its column like
 * the tagline (`.email-fit` in globals.css).
 */
export default function Contact() {
  const wa = contact.whatsapp.replace(/\D/g, "");
  return (
    <Section id="contact" heading={contact.heading} lede={contact.subheading}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="email-fit lg:col-span-7">
            <a href={`mailto:${contact.email}`} className="email plate-link">
              {contact.email}
            </a>
            {contact.whatsapp ? (
              <p className="mt-8">
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ui.whatsappLabel(contact.whatsapp)}
                  className="plate-link inline-flex min-h-[44px] items-center gap-3 text-lede"
                >
                  <WhatsAppIcon />
                  {contact.whatsapp}
                </a>
              </p>
            ) : null}
          </div>
          <ul className="self-end lg:col-span-5">
            {contact.socials
              .filter((s) => s.href)
              .map((s) => (
                <li key={s.label} className="border-b border-ink/20 first:border-t">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social group flex min-h-[64px] items-baseline justify-between gap-6 py-4"
                  >
                    <span className="title plate-link">{s.label}</span>
                    <span className="text-small text-ink-soft">{hostOf(s.href)}</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>
    </Section>
  );
}
