"use client";

import { useEffect, useRef, useState } from "react";
import { Cross } from "@/components/k/bits";
import { site, ui } from "@/content/site";

/** How long the logo wipe runs and the earliest the curtain may lift. */
const MIN_MS = 2400;
/** Never hold the page longer than this, loaded or not. */
const MAX_MS = 4000;
/** Curtain slide (1.5 s) plus its 0.5 s delay, as in the reference. */
const CLOSE_MS = 2000;

/**
 * First-visit preloader, after the reference: the wordmark is uncovered left
 * to right, the image-load percentage counts up, then the curtain slides
 * down off the page. Repeat visits, reduced motion and pages other than the
 * homepage skip it (decided before paint by the inline script in
 * app/layout.tsx, which adds html.no-preloader + html.page-loaded).
 *
 * The page underneath is fully rendered the whole time; the preloader is
 * aria-hidden and never blocks content for assistive technology.
 */
export default function Preloader() {
  const [pct, setPct] = useState(0);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-preloader")) {
      setGone(true);
      window.dispatchEvent(new Event("k:loaded"));
      return;
    }
    if (started.current) return;
    started.current = true;

    const t0 = performance.now();
    const media = Array.from(document.images);
    let done = media.filter((i) => i.complete).length;
    const total = Math.max(media.length, 1);
    const update = () => setPct(Math.round((done / total) * 100));
    update();
    const onOne = () => {
      done += 1;
      update();
      if (done >= total) maybeClose();
    };
    media.filter((i) => !i.complete).forEach((i) => {
      i.addEventListener("load", onOne, { once: true });
      i.addEventListener("error", onOne, { once: true });
    });

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      setPct(100);
      setClosing(true);
      // The hero starts rising while the curtain is still moving.
      window.setTimeout(() => {
        root.classList.add("page-loaded");
        window.dispatchEvent(new Event("k:loaded"));
      }, 900);
      window.setTimeout(() => setGone(true), CLOSE_MS);
      try {
        localStorage.setItem("mc-loaded", "1");
      } catch {}
    };
    function maybeClose() {
      const wait = Math.max(0, MIN_MS - (performance.now() - t0));
      window.setTimeout(close, wait);
    }
    if (done >= total) maybeClose();
    const cap = window.setTimeout(close, MAX_MS);
    return () => window.clearTimeout(cap);
  }, []);

  if (gone) return null;

  const shown = pct >= 100 ? "100" : String(pct).padStart(3, "0");
  return (
    <div className={`k-preloader ${closing ? "is-closing" : ""}`} aria-hidden="true" style={{ ["--pl-wipe" as string]: `${MIN_MS - 200}ms` }}>
      <div className="pl-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="pl-shadow" src="/logo-maymun.png" alt="" width={254} height={144} />
        <div className="pl-filled">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-maymun.png" alt="" width={254} height={144} />
        </div>
      </div>
      <div className="pl-text pl-left">
        <p className="pl-anim">{split("Maymun", 0)}</p>
        <p className="pl-anim">{split("Collective", 0.125)}</p>
      </div>
      <div className="pl-text pl-right">
        <p>{shown} %</p>
        <p className="pl-anim">{split(ui.loading, 0.125)}</p>
      </div>
      <div className="pl-bottom">
        <Cross className="pl-rise" />
        <p className="pl-rise">{site.shortDescription}</p>
      </div>
    </div>
  );
}

/** Letters that fade in one after another (CSS animation, not transition). */
function split(text: string, start: number) {
  return [...text].map((ch, i) => (
    <span key={i} style={{ animationDelay: `${start + i * 0.075}s` }}>
      {ch}
    </span>
  ));
}

