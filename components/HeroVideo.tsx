"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's background film: a drone pass over the stage.
 *
 * The whole design of this component is about getting the video onto the page
 * without undoing the first-paint work:
 *
 *  - The poster (~11 KB WebP) is the video's own first frame, so it paints
 *    immediately and playback starts from exactly the image already on screen —
 *    there is no jump or crossfade to hide.
 *  - The <video> ships with no `src` at all and `preload="none"`. The source is
 *    attached from `requestIdleCallback` after mount, so the download starts
 *    once the browser is past the work that determines FCP/LCP rather than
 *    competing with the fonts and stylesheet for a slow connection's bandwidth.
 *  - Desktop and phones get different files. A 16:9 source `object-cover`-ed
 *    into a portrait viewport shows only its middle sliver, which would mean
 *    upscaling roughly 2.6x; the phone file is a 9:16 centre crop instead.
 *
 * ── On actually playing ─────────────────────────────────────────────────────
 * An earlier version of this reached people as a still frame and never moved,
 * so the start path is now belt and braces rather than one hopeful call:
 *
 *  - `autoPlay` is on the element. It costs nothing at parse time because there
 *    is no `src` yet — the attribute only takes effect once one is attached,
 *    at which point it is a native backstop for the imperative `play()` below.
 *  - `play()` is retried on `loadeddata` and `canplay`, because a promise
 *    rejection at `load()` time (the browser has no data yet) is common and
 *    used to be the end of it.
 *  - If the browser refuses autoplay outright, the first pointer, key or scroll
 *    anywhere on the page tries once more and then stops listening.
 *  - The only remaining opt-out is deliberate: `prefers-reduced-motion` and
 *    Save-Data. A background flourish is not worth overriding an accessibility
 *    setting or a megabyte of someone's metered data. The previous version also
 *    bailed on `effectiveType` of "3g", which Chrome reports on plenty of
 *    perfectly usable connections — that heuristic is gone.
 *
 * Autoplay needs `muted` + `playsInline`. `muted` is also set imperatively:
 * React does not reflect it to an attribute, and some browsers check the
 * attribute when deciding whether autoplay is permitted.
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
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced || conn?.saveData) return;

    let cancelled = false;
    const attempt = () => {
      const v = ref.current;
      if (cancelled || !v || !v.src) return;
      v.muted = true;
      void v.play().catch(() => {
        /* Not yet allowed or not yet buffered — a later listener tries again. */
      });
    };

    const onGesture = () => attempt();

    const start = () => {
      const v = ref.current;
      if (cancelled || !v) return;
      // VP9 is a good bit smaller here than H.264 at matching quality, so
      // prefer it where it plays and keep the MP4 for Safari before 14 and
      // anything else that cannot. Chosen in JS rather than with <source>
      // children so only the winning file is ever fetched.
      const webm = v.canPlayType('video/webm; codecs="vp9"') === "probably";
      const base = portrait ? "/video/hero-mobile" : "/video/hero-desktop";
      v.muted = true;
      v.src = `${base}.${webm ? "webm" : "mp4"}`;
      v.load();
      attempt();

      v.addEventListener("loadeddata", attempt);
      v.addEventListener("canplay", attempt);
      // Last resort: some browsers only relent after the page has been touched.
      // `once` on each, so this costs one no-op call and then unhooks itself.
      for (const type of ["pointerdown", "keydown", "scroll"] as const) {
        window.addEventListener(type, onGesture, { once: true, passive: true });
      }
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
      video.removeEventListener("loadeddata", attempt);
      video.removeEventListener("canplay", attempt);
      for (const type of ["pointerdown", "keydown", "scroll"] as const) {
        window.removeEventListener(type, onGesture);
      }
    };
  }, []);

  return (
    <video
      ref={ref}
      poster={poster}
      preload="none"
      autoPlay
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
