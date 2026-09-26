"use client";

import { useEffect, useRef, useState } from "react";
import { music } from "@/content/site";

/**
 * Loads the Spotify player only once the Music section is actually approaching
 * the viewport.
 *
 * Why this exists: the embed carried `loading="lazy"`, but that is a *hint*
 * about viewport distance, and on a page this short Chromium decided the Music
 * section was near enough to fetch immediately — measured going out at +751ms
 * on first load, at VeryHigh priority, before any scrolling. So on every cold
 * visit the browser pulled the entire Spotify player (a megabyte-plus of
 * third-party JS, plus its own main-thread work) in parallel with the hero's
 * fonts and images, whether or not the visitor ever reached the Music section.
 *
 * An IntersectionObserver makes the decision ours rather than the browser's.
 * Nothing about the experience changes for someone who scrolls down — the
 * 400px rootMargin starts the load before the section is on screen — but a
 * first paint no longer competes with it.
 *
 * The placeholder reserves the player's exact height, so there is no layout
 * shift when the iframe replaces it, and a <noscript> copy keeps the section
 * useful with JS disabled.
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
      // Start fetching before the section is on screen, so scrolling down
      // still lands on a player that is already loading.
      { rootMargin: "400px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: music.embedHeight }}>
      {load ? (
        <div
          // The embed string is trusted, operator-authored markup pasted from
          // Spotify's Share > Embed dialog — not user input.
          className="overflow-hidden [&_iframe]:block [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: music.spotifyEmbed }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex items-center justify-center border border-line bg-surface"
          style={{ height: music.embedHeight }}
        >
          <span className="note">Loading the player…</span>
        </div>
      )}

      <noscript>
        <a
          href={music.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-lg text-bone underline decoration-stage decoration-2 underline-offset-4"
        >
          Listen on Spotify
        </a>
      </noscript>
    </div>
  );
}
