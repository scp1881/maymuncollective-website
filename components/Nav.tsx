"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { nav } from "@/content/site";

/**
 * Minimal fixed header. Transparent over the hero, then gains a subtle
 * backdrop once the user scrolls. Includes a compact mobile menu.
 *
 * On .container-rail, which is now the only measure on the site: the wordmark,
 * the band's name, every section heading and the footer all start on the same
 * vertical line from the top of the page to the bottom.
 *
 * Used on every page, so it is path-aware. The section links are bare hashes
 * (`#gallery`) which only resolve on the homepage — from anywhere else they are
 * prefixed to `/#gallery` so they navigate home *and* land on the section.
 * Likewise the wordmark scrolls to the top when already home, and is a plain
 * link home when it isn't.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Home / back-to-top. The anchor still points at #top so it works without
   * JS, but plain `href="#top"` is not quite the behaviour wanted here: it
   * lands 80px short (globals.css sets `scroll-padding-top: 5rem` so section
   * anchors clear the fixed nav), leaves `#top` stuck in the address bar, and
   * does nothing at all if the hash is already `#top`. Scrolling explicitly to
   * 0 avoids all three.
   *
   * `scroll-behavior: smooth` in CSS does not apply to scrollTo(), so the
   * reduced-motion preference has to be honoured here rather than inherited.
   */
  const toTop = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab/window) behave normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          // Solid on phones, translucent from sm up. A blurred 80% bar works
          // over a desktop page that is mostly black; on a phone the photos
          // are full-bleed, so the bar spends most of its life over a
          // photograph and the wordmark was landing on people's faces.
          ? "border-b border-line bg-ink sm:bg-ink/80 sm:backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav
        className="container-rail flex h-16 items-center justify-between"
        aria-label="Primary"
      >
        {/* No hover treatment: the wordmark is the one thing in the bar that is
            already unmistakably a link, and dimming it read as a highlight
            rather than as feedback. The negative margin + padding keeps a
            comfortable tap target without making the mark itself bigger, and
            the rounded corner is only there for the keyboard focus ring, which
            stays (see :focus-visible in globals.css). */}
        {onHome ? (
          <a
            href="#top"
            onClick={toTop}
            className="-m-2 flex shrink-0 items-center rounded-md p-2"
          >
            <Wordmark className="h-8 sm:h-9" />
          </a>
        ) : (
          <Link href="/" className="-m-2 flex shrink-0 items-center rounded-md p-2">
            <Wordmark className="h-8 sm:h-9" />
          </Link>
        )}

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={onHome ? item.href : `/${item.href}`}
                // The padding is the click target: 20px of line-height plus
                // 24px of padding puts these at exactly 44px, the HIG minimum.
                // The negative margin keeps the bar its own height.
                className="-my-3 block py-3 text-sm text-muted transition-colors hover:text-bone"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-bone md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-1 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-line bg-ink/95 backdrop-blur-md md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <ul className="container-rail flex flex-col gap-1 py-4">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={onHome ? item.href : `/${item.href}`}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-base text-muted transition-colors hover:text-bone"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
