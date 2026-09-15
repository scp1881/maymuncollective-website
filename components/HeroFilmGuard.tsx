"use client";

import { useEffect } from "react";

/**
 * Belt and braces around the hero film. It can nudge playback along, and it can
 * stop it for someone who asked for reduced motion — but it is never what
 * STARTS it. The <video> in components/Hero.tsx autoplays from its own markup
 * with no JavaScript at all, because three previous attempts put the start path
 * behind a script and all three shipped a frozen frame to real visitors. If this
 * file never runs, the film still plays.
 *
 * Two jobs:
 *
 * 1. Retry `play()`. A browser can refuse autoplay (iOS Low Power Mode is the
 *    common one) or simply not have enough buffered yet, and a refusal is
 *    silent. So this retries on `loadeddata` and `canplay`, and once more on the
 *    first pointer, key or scroll — by which point the page has been "engaged"
 *    and most policies relent. Each listener fires at most once.
 *
 * 2. Honour `prefers-reduced-motion` by stopping the film and aborting the
 *    transfer, which saves that visitor ~2.5 MB they were never going to watch.
 *
 *    NOTE: this is the single most likely reason for a film that looks broken on
 *    one particular device while working everywhere else — the symptom is
 *    identical to the bug we spent three rounds chasing. /video-check reports
 *    it. If it ever needs to be overridden, this is the one place to do it.
 *
 * It has to be an effect rather than an inline script: an inline script runs
 * before hydration and React reconciles the <source> children straight back in,
 * which silently undid the whole thing.
 */
export default function HeroFilmGuard() {
  useEffect(() => {
    const film = document.getElementById("hero-film");
    if (!(film instanceof HTMLVideoElement)) return;

    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* No matchMedia: fall through and leave the film alone. */
    }

    if (reduced) {
      film.autoplay = false;
      film.pause();
      while (film.firstChild) film.removeChild(film.firstChild);
      film.removeAttribute("src");
      film.load();
      film.style.display = "none"; // uncover the poster behind it
      return;
    }

    const nudge = () => {
      // `muted` again: some engines check the property, not the attribute,
      // when deciding whether autoplay is permitted.
      film.muted = true;
      void film.play().catch(() => {
        /* Refused or not buffered yet — a later listener tries again. */
      });
    };

    film.addEventListener("loadeddata", nudge);
    film.addEventListener("canplay", nudge);
    const gestures = ["pointerdown", "keydown", "scroll"] as const;
    for (const type of gestures) {
      window.addEventListener(type, nudge, { once: true, passive: true });
    }
    nudge();

    return () => {
      film.removeEventListener("loadeddata", nudge);
      film.removeEventListener("canplay", nudge);
      for (const type of gestures) window.removeEventListener(type, nudge);
    };
  }, []);

  return null;
}
