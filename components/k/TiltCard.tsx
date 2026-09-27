"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { finePointer } from "./motion";

/**
 * The front card of the hero stack tilts in 3D with the pointer, as in the
 * reference (rotateY/rotateX = distance from the viewport centre ÷ 100,
 * following quickly while moving and easing back to flat on leave). Eased
 * in a requestAnimationFrame loop that stops once the card settles, rather
 * than restarting a CSS transition on every pointer event. Fine pointers
 * only; untouched under reduced motion.
 */
export default function TiltCard({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = ref.current;
    const card = wrap?.querySelector<HTMLElement>(".card");
    const area = wrap?.parentElement;
    if (!wrap || !card || !area) return;
    if (!finePointer()) return;
    let rx = 0;
    let ry = 0;
    let trx = 0;
    let try_ = 0;
    let k = 0.25;
    let raf = 0;
    const tick = () => {
      rx += (trx - rx) * k;
      ry += (try_ - ry) * k;
      card.style.transform = `rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
      raf = Math.abs(trx - rx) + Math.abs(try_ - ry) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      try_ = (window.innerWidth / 2 - e.clientX) / 100;
      trx = (window.innerHeight / 2 - e.clientY) / 100;
      k = 0.25;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      trx = try_ = 0;
      k = 0.06;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
