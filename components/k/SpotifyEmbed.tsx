"use client";

import { useEffect, useRef, useState } from "react";
import { music } from "@/content/site";

/**
 * The Spotify artist player, injected only when the Music section is within
 * 400px of the viewport. An iframe's own loading="lazy" is just a hint, and
 * on this page Chromium used to fetch the whole player on every cold load
 * (measured at +751 ms, VeryHigh priority), competing with the first paint.
 * The placeholder reserves the player's exact height, so nothing shifts.
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
    <div ref={ref} style={{ minHeight: music.embedHeight }}>
      {load ? (
        <div
          // Trusted, operator-authored markup from Spotify's Share > Embed.
          style={{ display: "block" }}
          dangerouslySetInnerHTML={{ __html: music.spotifyEmbed }}
        />
      ) : (
        <div aria-hidden="true" style={{ height: music.embedHeight, display: "grid", placeItems: "center", color: "rgba(255,255,255,.55)", fontSize: 14 }}>
          {music.loadingLabel}
        </div>
      )}
    </div>
  );
}
