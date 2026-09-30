/**
 * Renders the social share image, public/og.png (1200×630), in the site's
 * own design: the white wordmark on the dark grid, the tilted card stack
 * with the stage photograph in front, and the circular "müzik, música,
 * music." label — same fonts, same files, same values as the hero, so the
 * preview cannot drift from the page.
 *
 *   npm i --no-save puppeteer-core && npm run og
 *
 * Uses the locally installed Chrome (no browser download). Set CHROME_PATH if
 * it isn't in the default macOS location.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = process.cwd();
const pub = (p) => pathToFileURL(path.join(ROOT, "public", p)).href;
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TAG = "müzik, música, music.";

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Archivo; src: url("${pub("fonts/archivo-latin.woff2")}") format("woff2"); font-weight: 300 900; font-stretch: 62% 125%; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; background: #0e0f0f; color: #fafafa; font-family: Archivo; overflow: hidden; }
.page { position: relative; width: 1200px; height: 630px; }
/* The background grid (10% × 20%, as on the site), fading out from the centre-left. */
.grid { position: absolute; inset: 0;
  background:
    linear-gradient(180deg, transparent 0, rgba(255,255,255,.14) 1px, transparent 0),
    linear-gradient(90deg, transparent 0, rgba(255,255,255,.14) 1px, transparent 0);
  background-size: 10% 20%, 10% 20%;
  -webkit-mask-image: radial-gradient(ellipse 70% 90% at 40% 50%, #000 20%, transparent 75%);
          mask-image: radial-gradient(ellipse 70% 90% at 40% 50%, #000 20%, transparent 75%); }
.wordmark { position: absolute; left: 72px; top: 150px; width: 520px; }
.tag { position: absolute; left: 72px; width: 520px; top: 478px; text-align: center; font-size: 28px; font-weight: 400; color: #fafafa; letter-spacing: -.01em; }
.cards { position: absolute; left: 700px; top: 70px; width: 330px; height: 470px; }
.card { position: absolute; inset: 0; overflow: hidden; }
.card img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card.b1 { transform: rotate(-6.15deg); }
.card.b2 { transform: rotate(6.15deg); }
.card.front { transform: perspective(1000px) rotateY(-4deg) rotateX(2deg); box-shadow: 0 30px 60px rgba(0,0,0,.45); }
.card.front img { object-position: 50% 70%; scale: 1.45; transform-origin: 50% 64%; }
.circle { position: absolute; left: 630px; top: 360px; width: 150px; height: 150px; }
.circle .ring { width: 100%; height: 100%; rotate: -24deg; }
.circle text { font-family: Archivo; font-size: 12.5px; letter-spacing: .18em; text-transform: uppercase; fill: #fafafa; }
.arrow { position: absolute; left: 50%; top: 50%; width: 12px; height: 24px; translate: -50% -50%; }
</style></head><body><div class="page">
  <div class="grid"></div>
  <img class="wordmark" src="${pub("logo-wordmark.svg")}" alt="">
  <p class="tag">${TAG}</p>
  <div class="cards">
    <div class="card b2"><img src="${pub("images/gallery/06-crew.JPG")}" alt=""></div>
    <div class="card b1"><img src="${pub("images/gallery/04-live.JPG")}" alt=""></div>
    <div class="card front"><img src="${pub("images/gallery/01-portrait.jpg")}" alt=""></div>
  </div>
  <div class="circle">
    <svg class="ring" viewBox="0 0 192 192">
      <defs><path id="p" d="M96 96m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
      <circle cx="96" cy="96" r="95" fill="#0e0f0f" fill-opacity=".55" stroke="rgba(255,255,255,.3)" stroke-width=".8" />
      <circle cx="96" cy="96" r="62" fill="none" stroke="rgba(255,255,255,.3)" stroke-width=".8" />
      <text><textPath href="#p" textLength="486" lengthAdjust="spacing">${TAG} — ${TAG} — </textPath></text>
    </svg>
    <svg class="arrow" viewBox="0 0 12 24" fill="none" stroke="#fafafa" stroke-width="1.2"><path d="M6 0v22M1 17l5 5 5-5" /></svg>
  </div>
</div></body></html>`;

const tmp = path.join(os.tmpdir(), `maymun-og-${process.pid}.html`);
fs.writeFileSync(tmp, html);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, "public/og.png"), type: "png" });
  console.log("wrote public/og.png (1200×630)");
} finally {
  await browser.close();
  fs.rmSync(tmp, { force: true });
}
