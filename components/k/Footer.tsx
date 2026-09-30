import Link from "next/link";
import { WhatsAppIcon } from "@/components/k/bits";
import { contact, footer, gallery, nav, site, ui } from "@/content/site";

/**
 * The reference's footer: the wordmark with a short line under it on the
 * left, then Explore / Follow / (Contact) columns whose links grow an
 * underline on hover; everything rises in when the footer arrives.
 */
export default function Footer({ home = true }: { home?: boolean }) {
  const href = (h: string) => (home ? h : `/${h}`);
  const wa = contact.whatsapp.replace(/\D/g, "");
  return (
    <footer className="section k-footer" data-start="top 90%" data-grid="false">
      <div className="inner">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="rv" src="/logo-maymun.svg" alt={site.name} width={294} height={168} loading="lazy" />
          <p className="tag rv">{site.shortDescription}</p>
        </div>
        <div className="cols">
          <div className="col">
            <span className="rv">{ui.explore}</span>
            <ul>
              {nav.map((n) => (
                <li key={n.href} className="rv">
                  <a className="k-grow" href={href(n.href)}>
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="rv">
                <Link className="k-grow" href="/gallery">
                  {gallery.moreLabel}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <span className="rv">{ui.follow}</span>
            <ul>
              {contact.socials.map((s) => (
                <li key={s.label} className="rv">
                  <a className="k-grow" href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col contact">
            <span className="rv">{contact.heading}</span>
            <ul>
              <li className="rv">
                <a className="k-grow" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </li>
              <li className="rv">
                <a className="k-grow k-wa" href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label={ui.whatsappLabel(contact.whatsapp)}>
                  <WhatsAppIcon />
                  {contact.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="legal">
        <span>{footer.note}</span>
      </div>
    </footer>
  );
}
