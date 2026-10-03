"use client";

import { useEffect } from "react";
import { motionOn } from "./motion";

/**
 * Phones get the animations a pointer would trigger on desktop. Hover never
 * happens on a touch screen, so here the page plays them itself:
 *
 * - the hero's card stack fans out shortly after the intro;
 * - a Channels row's meter plays, and its arrow turns outward, while the row
 *   crosses the middle of the screen;
 * - the member card in view plays its equaliser;
 * - the Music arrow turns as it comes into view.
 *
 * It only acts on phone-width touch screens (no fine pointer, 768 px wide or
 * less) with motion on, and everything it adds is styled inside the phone
 * breakpoint in globals.css, so the desktop site is untouched.
 */
export default function TouchMotion() {
  useEffect(() => {
    const phone =
      motionOn() &&
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.matchMedia("(max-width: 768px)").matches;
    if (!phone) return;
    const root = document.documentElement;
    root.classList.add("touch");

    const watch = (selector: string, options: IntersectionObserverInit) => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle("is-near", e.isIntersecting)),
        options,
      );
      document.querySelectorAll(selector).forEach((el) => io.observe(el));
      return io;
    };
    const observers = [
      // A band across the middle of the screen: one or two rows play at a
      // time, so the signal travels down the list as it scrolls.
      watch(".k-channels .strip", { rootMargin: "-38% 0px -38% 0px", threshold: 0.5 }),
      // Member cards scroll sideways; the one mostly on screen plays.
      watch(".k-mcard", { threshold: 0.6 }),
      watch(".k-music .arrow", { rootMargin: "-15% 0px -15% 0px", threshold: 1 }),
    ];

    // Fan the card stack once the hero's own entrance has played.
    let fan = 0;
    const fanOut = () => {
      fan = window.setTimeout(() => document.querySelector(".k-cards")?.classList.add("is-fanned"), 1800);
    };
    if (root.classList.contains("page-loaded")) fanOut();
    else window.addEventListener("k:loaded", fanOut, { once: true });

    return () => {
      observers.forEach((io) => io.disconnect());
      window.clearTimeout(fan);
      window.removeEventListener("k:loaded", fanOut);
      root.classList.remove("touch");
    };
  }, []);

  return null;
}
