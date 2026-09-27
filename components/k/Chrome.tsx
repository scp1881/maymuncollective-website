"use client";

import { useEffect, useRef } from "react";

const fine = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Fixed background grid. A dark field with a clear centre follows the
 * pointer (lerp 0.1, as in the reference), so the grid only shows around the
 * cursor. Without a fine pointer the clear centre simply stays mid-screen.
 */
export function BackgroundGrid() {
  const spot = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = spot.current;
    if (!el || !fine()) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="k-grid" aria-hidden="true">
      <div className="lines" />
      <div className="spot" ref={spot}>
        <div />
      </div>
    </div>
  );
}

/**
 * The reference's follower cursor: a ring with a dot trailing the pointer
 * (lerp 0.3). `data-cursor="hide"` on an element hides it there (member
 * cards, the player iframe); `data-cursor="play"` grows it into a play
 * button. It also hides when the pointer leaves the page or enters an
 * iframe, where it would otherwise freeze at the edge.
 */
export function Cursor() {
  const el = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = el.current;
    if (!node || !fine()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    const tick = () => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setState = (target: EventTarget | null) => {
      const hit = (target as Element | null)?.closest?.("[data-cursor], iframe");
      const state = hit ? (hit.tagName === "IFRAME" ? "hide" : hit.getAttribute("data-cursor")) : null;
      node.classList.toggle("-hidden", state === "hide");
      node.classList.toggle("-play", state === "play");
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      setState(e.target);
    };
    const onLeave = () => node.classList.add("-hidden");
    const onBlur = () => node.classList.add("-hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onBlur);
    return () => {
      root.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return (
    <div className="k-cursor" ref={el} aria-hidden="true">
      <div />
    </div>
  );
}
