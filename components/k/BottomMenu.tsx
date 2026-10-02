"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Burger, CloseIcon, SpotifyIcon } from "@/components/k/bits";
import { contact, gallery, music, nav, ui } from "@/content/site";

/**
 * The reference's floating glass bar at the bottom of the screen, on every
 * page: "≡ Menu", the section links, and "Listen Now", which goes straight
 * to Maymun Collective on Spotify (new tab). "Menu" opens a glass dropdown
 * above the bar.
 *
 * Keyboard: Menu is a real button with aria-expanded; Escape closes the
 * dropdown and returns focus to it, as does an outside click.
 */
export default function BottomMenu() {
  const onHome = usePathname() === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement | null>(null);
  const menuBtn = useRef<HTMLButtonElement | null>(null);

  const href = (h: string) => (onHome ? h : `/${h}`);

  useEffect(() => {
    const onSection = (e: Event) => setActive(`#${(e as CustomEvent<string>).detail}`);
    window.addEventListener("k:section", onSection);
    return () => window.removeEventListener("k:section", onSection);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menuBtn.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={root} className={`k-menu ${open ? "is-open" : ""}`}>
      <div className="m-content">
        <div className="m-drop" id="k-menu-drop" aria-hidden={!open}>
          <div className="m-drop-body">
            <div className="m-col">
              <span className="m-col-label">{ui.explore}</span>
              <ul>
                <li>
                  <Link className="k-grow" href="/" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                    Home
                  </Link>
                </li>
                {nav.map((n) => (
                  <li key={n.href}>
                    <a className="k-grow" href={href(n.href)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                      {n.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link className="k-grow" href="/gallery" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                    {gallery.moreLabel}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="m-col">
              <span className="m-col-label">{ui.follow}</span>
              <ul>
                {contact.socials.map((s) => (
                  <li key={s.label}>
                    <a className="k-grow" href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="m-col contact">
              <span className="m-col-label">{contact.heading}</span>
              <ul>
                <li>
                  <a className="k-link" href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1}>
                    {contact.email}
                    <ArrowRight />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="m-panels">
          <div className="m-panel nav">
            <nav aria-label="Primary">
              <button
                ref={menuBtn}
                type="button"
                className="m-item menu-btn"
                aria-expanded={open}
                aria-controls="k-menu-drop"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <CloseIcon /> : <Burger />}
                {ui.menu}
              </button>
              {nav.map((n) => (
                <a
                  key={n.href}
                  className="m-item section-link"
                  href={href(n.href)}
                  aria-current={onHome && active === n.href ? "true" : undefined}
                >
                  {n.label}
                </a>
              ))}
              <span className="m-sep" aria-hidden="true" />
              <a className="m-item m-listen" href={music.spotifyUrl} target="_blank" rel="noopener noreferrer">
                {ui.listenNow}
                <span className="sr-only">{ui.listenNowHidden}</span>
                <SpotifyIcon />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
