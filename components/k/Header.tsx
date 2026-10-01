import Link from "next/link";
import { ArrowRight } from "@/components/k/bits";
import { music, site } from "@/content/site";

/**
 * Fixed header: the small wordmark top-left (it slides away after the first
 * three screens of the homepage, as in the reference — see Experience), and
 * the site's one call to action top-right, where the reference has "Send
 * your demos".
 */
export default function Header() {
  return (
    <header className="k-header">
      <Link href="/" className="logo" aria-label={`${site.name}, home`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-maymun.svg" alt="" width={294} height={168} />
      </Link>
      <a className="k-link" href={music.spotifyUrl} target="_blank" rel="noopener noreferrer">
        {music.subheading.replace(/\.$/, "")}
        <ArrowRight />
      </a>
    </header>
  );
}
