"use client";

import { useEffect, useRef } from "react";

/**
 * The reference's water ripple on the hero logo, rebuilt in plain WebGL (no
 * three.js): the pointer paints a fading trail into a 64×64 "touch" texture
 * whose red/green channels hold the direction of travel and blue the
 * strength; the fragment shader offsets its lookup into the wordmark by that
 * vector, so the letters bend and flow behind the cursor, then settle.
 *
 * Desktop only (> 768px, as in the reference), never under reduced motion,
 * and only after the logo's own entrance has played. Until then — and
 * whenever WebGL is unavailable — the plain SVG wordmark is what shows; when
 * the canvas is ready the two cross-fade (same image, same place).
 * The loop runs only while the hero is on screen.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uLogo;
uniform sampler2D uTrail;
uniform vec4 uRect;
void main() {
  vec4 t = texture2D(uTrail, vUv);
  vec2 uv = vUv;
  uv.x += -(t.r * 2.0 - 1.0) * 0.2 * t.b;
  uv.y += -(t.g * 2.0 - 1.0) * 0.2 * t.b;
  vec2 l = (uv - uRect.xy) / uRect.zw;
  if (l.x < 0.0 || l.x > 1.0 || l.y < 0.0 || l.y > 1.0) { gl_FragColor = vec4(0.0); return; }
  gl_FragColor = texture2D(uLogo, l);
}`;

type Point = { x: number; y: number; age: number; force: number; vx: number; vy: number };

export default function WaterLogo({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.innerWidth <= 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const hero = canvas.closest("section") as HTMLElement | null;
    const logo = hero?.querySelector<HTMLElement>(".hero-logo");
    if (!hero || !logo) return;

    let disposed = false;
    let raf = 0;
    let visible = true;
    let started = false;
    const cleanups: (() => void)[] = [];

    const begin = () => {
      if (disposed || started) return;
      started = true;
      const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
      if (!gl) return;

      // ── program
      const sh = (type: number, code: string) => {
        const s = gl.createShader(type)!;
        gl.shaderSource(s, code);
        gl.compileShader(s);
        return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      const uRect = gl.getUniformLocation(prog, "uRect");
      gl.uniform1i(gl.getUniformLocation(prog, "uLogo"), 0);
      gl.uniform1i(gl.getUniformLocation(prog, "uTrail"), 1);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

      const makeTex = (unit: number) => {
        const t = gl.createTexture()!;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        return t;
      };
      const logoTex = makeTex(0);
      const trailTex = makeTex(1);

      // ── touch trail (after the reference: 64px, age 64, shadow-drawn points)
      const SIZE = 64;
      const MAX_AGE = 64;
      const RADIUS = 0.1 * SIZE;
      const SPEED = 1 / MAX_AGE;
      const tc = document.createElement("canvas");
      tc.width = tc.height = SIZE;
      const tx = tc.getContext("2d")!;
      const trail: Point[] = [];
      let last: { x: number; y: number } | null = null;
      const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
      const easeOutQuad = (t: number) => t * (2 - t);
      const drawTrail = () => {
        tx.fillStyle = "black";
        tx.fillRect(0, 0, SIZE, SIZE);
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          const f = p.force * SPEED * (1 - p.age / MAX_AGE);
          p.x += p.vx * f;
          p.y += p.vy * f;
          p.age++;
          if (p.age > MAX_AGE) trail.splice(i, 1);
        }
        for (const p of trail) {
          const px = p.x * SIZE;
          const py = (1 - p.y) * SIZE;
          let k = p.age < MAX_AGE * 0.3 ? easeOutSine(p.age / (MAX_AGE * 0.3)) : easeOutQuad(1 - (p.age - MAX_AGE * 0.3) / (MAX_AGE * 0.7));
          k *= p.force;
          const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${k * 255}`;
          const off = SIZE * 5;
          tx.shadowOffsetX = off;
          tx.shadowOffsetY = off;
          tx.shadowBlur = RADIUS;
          tx.shadowColor = `rgba(${color},${0.2 * k})`;
          tx.beginPath();
          tx.fillStyle = "rgba(255,0,0,1)";
          tx.arc(px - off, py - off, RADIUS, 0, Math.PI * 2);
          tx.fill();
        }
      };
      const addTouch = (x: number, y: number) => {
        let force = 0;
        let vx = 0;
        let vy = 0;
        if (last) {
          const dx = x - last.x;
          const dy = y - last.y;
          if (dx === 0 && dy === 0) return;
          const d2 = dx * dx + dy * dy;
          const d = Math.sqrt(d2);
          vx = dx / d;
          vy = dy / d;
          force = Math.min(d2 * 10000, 1);
        }
        last = { x, y };
        trail.push({ x, y, age: 0, force, vx, vy });
      };

      // ── sizing + logo texture
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      const size = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const r = canvas.getBoundingClientRect();
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        const lr = logo.getBoundingClientRect();
        const lc = document.createElement("canvas");
        lc.width = Math.max(1, Math.round(lr.width * dpr));
        lc.height = Math.max(1, Math.round(lr.height * dpr));
        lc.getContext("2d")!.drawImage(img, 0, 0, lc.width, lc.height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, logoTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, lc);
      };

      const frame = () => {
        raf = 0;
        if (disposed || !visible) return;
        drawTrail();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, trailTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tc);
        // The logo moves with scroll (Experience scrubs it), so its rect is
        // read every frame, relative to the canvas.
        const cr = canvas.getBoundingClientRect();
        const lr = logo.getBoundingClientRect();
        gl.uniform4f(uRect, (lr.left - cr.left) / cr.width, 1 - (lr.bottom - cr.top) / cr.height, lr.width / cr.width, lr.height / cr.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(frame);
      };

      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        addTouch((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      };

      img.onload = () => {
        if (disposed) return;
        size();
        canvas.classList.add("is-ready");
        logo.classList.add("webgl-on");
        raf = requestAnimationFrame(frame);
      };

      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf && canvas.classList.contains("is-ready")) raf = requestAnimationFrame(frame);
      });
      io.observe(hero);
      hero.addEventListener("pointermove", onMove, { passive: true });
      let rt = 0;
      const onResize = () => {
        window.clearTimeout(rt);
        rt = window.setTimeout(() => img.complete && size(), 150);
      };
      window.addEventListener("resize", onResize);

      cleanups.push(() => {
        io.disconnect();
        hero.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        logo.classList.remove("webgl-on");
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      });
    };

    // Wait for the page to be loaded and the SVG logo's own entrance to play.
    const afterLoad = () => window.setTimeout(begin, 1500);
    if (document.documentElement.classList.contains("page-loaded")) afterLoad();
    else window.addEventListener("k:loaded", afterLoad, { once: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("k:loaded", afterLoad);
      cleanups.forEach((f) => f());
    };
  }, [src]);

  return <canvas ref={ref} className="k-water" aria-hidden="true" />;
}
