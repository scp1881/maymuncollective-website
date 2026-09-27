"use client";

import { useEffect, useRef, useState } from "react";
import { music } from "@/content/site";

/**
 * Loads the Spotify player only once the Music section is actually approaching
 * the viewport.
 *
 * Why this exists: an iframe's `loading="lazy"` is only a hint about viewport
 * distance, and on this page Chromium decided the Music section was near
 * enough to fetch immediately — measured at +751ms on every cold load, at
 * VeryHigh priority, before any scrolling. So each first visit pulled the
 * whole player (a megabyte-plus of third-party JS, plus its main-thread cost)
 * alongside the hero, whether or not the visitor ever scrolled that far.
 *
 * An IntersectionObserver with a 400px margin makes the decision ours: the
 * player starts loading just before the section appears. The placeholder
 * reserves the player's exact height, so nothing shifts when it arrives, and
 * the section's lede is a plain link to the same artist for anyone without
 * JavaScript or before the player is ready.
 */
export default function SpotifyEmbed() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-raised" style={{ minHeight: music.embedHeight }}>
      {load ? (
        <div
          // The embed string is trusted, operator-authored markup pasted from
          // Spotify's Share > Embed dialog — not user input.
          className="[&_iframe]:block [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: music.spotifyEmbed }}
        />
      ) : (
        <div aria-hidden="true" className="flex items-center justify-center" style={{ height: music.embedHeight }}>
          <span className="text-small text-ink-soft">{music.loadingLabel}</span>
        </div>
      )}
    </div>
  );
}
