"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "@/components/Wordmark";
import { nav, ui } from "@/content/site";

/**
 * Fixed header on every page.
 *
 * - On the homepage the header's wordmark stays hidden while the hero's own
 *   (the <h1>) is on screen, and appears once it has scrolled away — one
 *   wordmark at a time. `visibility` rather than opacity alone, so a hidden
 *   logo is never a focusable ghost.
 * - Section links are bare hashes on the homepage and `/#section` elsewhere,
 *   so from /gallery they navigate home and land on the section.
 * - The link for the section currently in view carries aria-current and keeps
 *   its violet plate (see `.plate-link` in globals.css).
 * - On phones the links live in a full-screen sheet: focus moves into it,
 *   Tab is kept inside it, Escape closes it, and focus returns to the button.
 */
export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onGallery = pathname === "/gallery";
  const [pastHero, setPastHero] = useState(!onHome);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  const sheet = useRef<HTMLDivElement | null>(null);

  // On the homepage, links are bare hashes. Elsewhere they lead home to the
  // section — except Gallery on /gallery, which is this page.
  const href = (h: string) => (onHome ? h : onGallery && h === "#gallery" ? "/gallery" : `/${h}`);
  const current = (h: string) =>
    onGallery && h === "#gallery" ? ("page" as const) : active === h ? ("true" as const) : undefined;

  // Header wordmark: shown once the hero's wordmark has left the screen.
  useEffect(() => {
    if (!onHome) return;
    const heading = document.querySelector("#top h1");
    if (!heading || !("IntersectionObserver" in window)) {
      setPastHero(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    io.observe(heading);
    return () => io.disconnect();
  }, [onHome]);

  // Current section: whichever section crosses the middle of the viewport.
  useEffect(() => {
    if (!onHome || !("IntersectionObserver" in window)) return;
    const sections = nav
      .map((n) => document.querySelector<HTMLElement>(n.href))
      .filter((s): s is HTMLElement => Boolean(s));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    const top = document.getElementById("top");
    const clearAtTop = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (top) clearAtTop.observe(top);
    return () => {
      io.disconnect();
      clearAtTop.disconnect();
    };
  }, [onHome]);

  const close = useCallback(() => {
    setOpen(false);
    menuButton.current?.focus();
  }, []);

  // Sheet: lock page scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const node = sheet.current;
    node?.querySelector<HTMLElement>("nav a[href]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>("a[href], button"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <header className={`fixed inset-x-0 top-0 z-nav bg-stock transition-[border-color] duration-quick ${pastHero ? "border-b border-ink/15" : "border-b border-transparent"}`}>
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link
          href="/"
          className={`transition-opacity duration-quick ${pastHero ? "visible opacity-100" : "invisible opacity-0"}`}
        >
          <Wordmark className="h-10" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-9 text-[16px] font-semibold">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={href(item.href)}
                  className="plate-link inline-flex min-h-[44px] items-center"
                  aria-current={current(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border-2 border-ink px-4 text-[16px] font-bold lg:hidden"
          aria-expanded={open}
          aria-controls="menu-sheet"
          aria-label={ui.openMenu}
          onClick={() => setOpen(true)}
        >
          {ui.menu}
        </button>
      </div>

      {open ? (
        <div
          id="menu-sheet"
          ref={sheet}
          role="dialog"
          aria-modal="true"
          aria-label={ui.menu}
          className="sheet fixed inset-0 z-sheet flex flex-col bg-raised lg:hidden"
        >
          <div className="container-page flex h-[72px] items-center justify-between gap-6">
            <Link href="/" onClick={() => setOpen(false)}>
              <Wordmark className="h-10" />
            </Link>
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border-2 border-ink px-4 text-[16px] font-bold"
              aria-label={ui.closeMenu}
              onClick={close}
            >
              {ui.close}
            </button>
          </div>
          <nav aria-label="Primary" className="container-page mt-8">
            <ul className="grid gap-1">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <a
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className="sheet-link block py-2"
                    style={{ "--i": i } as CSSProperties}
                    aria-current={current(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
