"use client";

import { useEffect } from "react";

/**
 * Honours `prefers-reduced-motion` for the hero film.
 *
 * This is deliberately NOT part of how the film starts. The <video> in
 * components/Hero.tsx autoplays from its own markup with no JavaScript at all,
 * because the two previous attempts at a hero video both put the start path
 * behind a script and both shipped a still frame to real visitors. This runs
 * afterwards and only ever takes something away, so if it never runs the film
 * plays — the safe direction to fail in.
 *
 * It has to be an effect rather than an inline script in the markup: an inline
 * script runs before hydration, and React then reconciles the <source> children
 * straight back in, which silently undid the whole thing. After hydration the
 * change sticks, and the Hero is a server component that never re-renders, so
 * React has no reason to restore them.
 *
 * Detaching the sources and calling load() aborts the transfer rather than
 * merely pausing it, which matters: this is a ~5 MB file that a visitor who
 * asked for less motion is not going to watch.
 */
export default function HeroMotionGuard() {
  useEffect(() => {
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return; // No matchMedia: leave the film exactly as the markup left it.
    }
    if (!reduced) return;

    const film = document.getElementById("hero-film");
    if (!(film instanceof HTMLVideoElement)) return;

    film.autoplay = false;
    film.pause();
    while (film.firstChild) film.removeChild(film.firstChild);
    film.removeAttribute("src");
    film.load();
    // Uncover the poster sitting behind it.
    film.style.display = "none";
  }, []);

  return null;
}
