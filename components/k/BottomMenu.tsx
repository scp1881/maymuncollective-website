"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Burger, CloseIcon, WhatsAppIcon } from "@/components/k/bits";
import { contact, gallery, music, nav, ui } from "@/content/site";

const PLAYER_SRC = "https://open.spotify.com/embed/artist/65l6MjVrzKqg5gNzo5K7ly?utm_source=generator&theme=0";

/**
 * The reference's floating glass bar at the bottom of the screen:
 * "≡ Menu", the section links, and a player switch (two 3D cubes — a
 * ticker and a photo — that roll on hover). "Menu" opens a glass dropdown
 * above the bar; the player switch flips the bar in 3D to a compact
 * Spotify player, loaded only when asked for.
 *
 * Keyboard: both are real buttons with aria-expanded; Escape closes either
 * and returns focus; the dropdown also closes on an outside click.
 */
export default function BottomMenu() {
  const onHome = usePathname() === "/";
  const [open, setOpen] = useState(false);
  const [player, setPlayer] = useState(false);
  const [loadPlayer, setLoadPlayer] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement | null>(null);
  const menuBtn = useRef<HTMLButtonElement | null>(null);
  const playerBtn = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  const href = (h: string) => (onHome ? h : `/${h}`);

  useEffect(() => {
    const onSection = (e: Event) => setActive(`#${(e as CustomEvent<string>).detail}`);
    window.addEventListener("k:section", onSection);
    return () => window.removeEventListener("k:section", onSection);
  }, []);

  const closeAll = useCallback((focus?: HTMLElement | null) => {
    setOpen(false);
    setPlayer(false);
    focus?.focus();
  }, []);

  useEffect(() => {
    if (!open && !player) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll(player ? playerBtn.current : menuBtn.current);
    };
    const onDown = (e: PointerEvent) => {
      if (open && root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, player, closeAll]);

  useEffect(() => {
    if (player) {
      setLoadPlayer(true);
      window.setTimeout(() => closeBtn.current?.focus(), 350);
    }
  }, [player]);

  const wa = contact.whatsapp.replace(/\D/g, "");

  return (
    <div ref={root} className={`k-menu ${open ? "is-open" : ""} ${player ? "is-player" : ""}`}>
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
                <li>
                  <a
                    className="k-grow"
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ui.whatsappLabel(contact.whatsapp)}
                    tabIndex={open ? 0 : -1}
                  >
                    <WhatsAppIcon /> {contact.whatsapp}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="m-panels">
          <div className="m-panel nav" aria-hidden={player}>
            <nav aria-label="Primary">
              <button
                ref={menuBtn}
                type="button"
                className="m-item menu-btn"
                aria-expanded={open}
                aria-controls="k-menu-drop"
                onClick={() => setOpen((o) => !o)}
                tabIndex={player ? -1 : 0}
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
                  tabIndex={player ? -1 : 0}
                >
                  {n.label}
                </a>
              ))}
              <span className="m-sep" aria-hidden="true" />
              <button
                ref={playerBtn}
                type="button"
                className="m-item m-player-btn"
                aria-expanded={player}
                data-cursor="play"
                onClick={() => {
                  setOpen(false);
                  setPlayer(true);
                }}
                tabIndex={player ? -1 : 0}
              >
                <span className="sr-only">{ui.openPlayer}</span>
                <PlayerCubes />
              </button>
            </nav>
          </div>

          <div className="m-panel player" aria-hidden={!player}>
            <div className="m-player">
              <div className="m-player-bar">
                <span>{music.subheading}</span>
                <button ref={closeBtn} type="button" aria-label={ui.closePlayer} onClick={() => closeAll(playerBtn.current)} tabIndex={player ? 0 : -1}>
                  <CloseIcon />
                </button>
              </div>
              {loadPlayer ? (
                <iframe
                  title="Maymun Collective on Spotify"
                  src={PLAYER_SRC}
                  height={152}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  tabIndex={player ? 0 : -1}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Ticker cube + photo cube with a pulsing play mark between them. */
function PlayerCubes() {
  const label = `${music.subheading.replace(/\.$/, "")} · `;
  const faces = ["f-front", "f-back", "f-top", "f-bottom"];
  return (
    <span className="k-scene" aria-hidden="true">
      <span className="k-cube ticker">
        {faces.map((f) => (
          // The ticker text is drawn by CSS from data-t, so the button's only
          // text content is its screen-reader label.
          <span key={f} className={`face ${f}`}>
            <span data-t={label} />
            <span data-t={label} />
          </span>
        ))}
      </span>
      <span className="k-cube image">
        {faces.map((f) => (
          <span key={f} className={`face ${f}`}>
            <Image src="/images/gallery/01-portrait.jpg" alt="" width={32} height={32} sizes="32px" />
          </span>
        ))}
      </span>
      <svg className="k-play-dot" viewBox="0 0 24 24">
        <circle className="pulse" cx="12" cy="12" r="11" fill="#fafafa" />
        <path d="M10 8.3v7.4l6-3.7z" fill="#0e0f0f" />
      </svg>
    </span>
  );
}
