"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The front card of the hero stack tilts in 3D with the pointer, as in the
 * reference (rotateY/rotateX = distance from the viewport centre ÷ 100,
 * easing 0.1 s while moving and 1 s back to flat on leave). Fine pointers
 * only; untouched under reduced motion.
 */
export default function TiltCard({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = ref.current;
    const card = wrap?.querySelector<HTMLElement>(".card");
    const area = wrap?.parentElement;
    if (!wrap || !card || !area) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const ry = (window.innerWidth / 2 - e.clientX) / 100;
      const rx = (window.innerHeight / 2 - e.clientY) / 100;
      card.style.transition = "transform 0.1s ease";
      card.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
    };
    const onLeave = () => {
      card.style.transition = "transform 1s ease";
      card.style.transform = "rotateY(0deg) rotateX(0deg)";
    };
    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
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
