"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's background film: a drone pass over the stage.
 *
 * The whole design of this component is about getting a 1.4 MB video onto the
 * page without undoing the first-paint work:
 *
 *  - The poster (~30 KB WebP) is the video's own first frame, so it paints
 *    immediately and playback starts from exactly the image already on screen —
 *    there is no jump or crossfade to hide.
 *  - The <video> ships with no `src` at all and `preload="none"`. The source is
 *    attached from `requestIdleCallback` after mount, so the download starts
 *    once the browser is past the work that determines FCP/LCP rather than
 *    competing with the fonts and stylesheet for a slow connection's bandwidth.
 *  - Desktop and phones get different files. A 16:9 source `object-cover`-ed
 *    into a portrait viewport shows only its middle sliver, which would mean
 *    upscaling roughly 2.6x; the phone file is a 9:16 centre crop instead, and
 *    is smaller as well (889 KB vs 1.4 MB).
 *
 * It also declines to load the video at all — leaving the poster, which still
 * looks intentional — when the visitor has asked for reduced motion, or when the
 * browser reports Save-Data or a 2G/3G-class connection. A background flourish
 * is not worth a megabyte of someone's metered data.
 *
 * Autoplay needs `muted` + `playsInline`. `muted` is set imperatively as well:
 * React does not reflect it to an attribute, and some browsers check the
 * attribute when deciding whether autoplay is permitted. iOS Low Power Mode
 * blocks autoplay regardless; the poster simply stays, which is a fine result.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [poster, setPoster] = useState("/video/hero-poster-desktop.webp");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Orientation, not width. What decides which crop fits is the shape of the
    // viewport: a 768x1024 tablet held upright is as portrait as a phone, and
    // covering it with the 16:9 file would upscale the middle sliver ~3.2x. A
    // phone turned sideways is the reverse and wants the wide file.
    const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
    setPoster(portrait ? "/video/hero-poster-mobile.webp" : "/video/hero-poster-desktop.webp");

    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* matchMedia is always present in practice; fall through to loading. */
    }

    // `connection` is Chromium-only; absence just means we cannot tell, so load.
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const frugal = Boolean(conn?.saveData) || /^(slow-)?2g$|^3g$/.test(conn?.effectiveType ?? "");

    if (reduced || frugal) return;

    let cancelled = false;
    const start = () => {
      if (cancelled || !ref.current) return;
      const v = ref.current;
      // VP9 is ~20% smaller here than the H.264 at matching quality (1.08 MB vs
      // 1.35 MB desktop), so prefer it where it plays and keep the MP4 for
      // Safari before 14 and anything else that cannot. Chosen in JS rather
      // than with <source> children so only the winning file is ever fetched.
      const webm = v.canPlayType('video/webm; codecs="vp9"') === "probably";
      const base = portrait ? "/video/hero-mobile" : "/video/hero-desktop";
      v.muted = true;
      v.src = `${base}.${webm ? "webm" : "mp4"}`;
      v.load();
      // Rejects when the browser declines to autoplay; the poster stays put.
      void v.play().catch(() => {});
    };

    // Safari only shipped requestIdleCallback in 17, so fall back to a timer.
    // The `timeout` matters more than the idle part: it guarantees the video
    // still starts on a page that never goes idle.
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 600);

    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}
