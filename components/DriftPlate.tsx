"use client";

import { useEffect, useRef } from "react";

/**
 * A violet plate that drifts a few pixels with the pointer while it is over
 * the parent section — the second pass of the press slipping as you move —
 * and trails behind it (the lag is a CSS transition, see `.drift-plate`).
 *
 * Only for fine pointers that can hover, and never under reduced motion; on
 * touch it simply rests out of register like every other plate. Pointer
 * events are coalesced into one style write per frame.
 */
export default function DriftPlate({ className = "" }: { className?: string }) {
  const plate = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = plate.current;
    const area = node?.closest("section");
    if (!node || !area) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const write = () => {
      frame = 0;
      node.style.setProperty("--drift-x", `${x.toFixed(1)}px`);
      node.style.setProperty("--drift-y", `${y.toFixed(1)}px`);
    };
    const onMove = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      // -1 … 1 across the section, scaled to at most 8px of slip.
      x = ((e.clientX - r.left) / r.width - 0.5) * 16;
      y = ((e.clientY - r.top) / r.height - 0.5) * 12;
      if (!frame) frame = requestAnimationFrame(write);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(write);
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={plate} aria-hidden="true" className={`drift-plate ${className}`} />;
}
