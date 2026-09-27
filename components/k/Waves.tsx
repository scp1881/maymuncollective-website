"use client";

import { useEffect, useRef } from "react";

/**
 * Thin interlacing wave lines drifting across the contact panel, as in the
 * reference. 2D canvas; runs only while on screen; a single still frame
 * under reduced motion.
 */
export default function Waves() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = [
      { amp: 0.09, len: 1.1, speed: 0.22, phase: 0, alpha: 0.55 },
      { amp: 0.06, len: 0.8, speed: -0.18, phase: 1.3, alpha: 0.4 },
      { amp: 0.11, len: 1.4, speed: 0.15, phase: 2.2, alpha: 0.35 },
      { amp: 0.05, len: 0.6, speed: -0.26, phase: 3.1, alpha: 0.3 },
      { amp: 0.08, len: 1.9, speed: 0.1, phase: 4.4, alpha: 0.45 },
    ];
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const mid = h * 0.56;
      for (const l of lines) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const u = x / w;
          // Two sines beating against each other, tapering at the panel edges.
          const env = 0.35 + 0.65 * Math.sin(Math.PI * u);
          const y = mid + h * l.amp * env * (Math.sin(u * Math.PI * 2 * l.len + l.phase + t * l.speed) + 0.35 * Math.sin(u * Math.PI * 5 * l.len - t * l.speed * 1.7));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(250,250,250,${l.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    resize();
    let raf = 0;
    let visible = false;
    const t0 = performance.now();
    const loop = () => {
      draw((performance.now() - t0) / 1000);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    draw(0);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !still && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      draw((performance.now() - t0) / 1000);
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="waves" aria-hidden="true" />;
}
