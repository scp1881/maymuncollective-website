/**
 * Renders the social share image, public/og.png (1200×630), from the site's
 * own design: the wordmark, the tagline at its three widths, and the Blind
 * photograph printed in the two inks — same fonts, same files, same CSS
 * recipe as the site, so the preview cannot drift from the page.
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

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Archivo; src: url("${pub("fonts/archivo-latin.woff2")}") format("woff2"); font-weight: 300 900; font-stretch: 62% 125%; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; background: #0d0f1c; color: #e6e9f5; font-family: Archivo; overflow: hidden; }
.page { position: relative; width: 1200px; height: 630px; padding: 56px 64px; display: grid; grid-template-columns: 500px 1fr; gap: 64px; align-items: end; }
.left { container-type: inline-size; }
.wordmark { height: 72px; display: block; margin-bottom: 28px; }
.t { display: block; width: max-content; white-space: nowrap; font-weight: 850; line-height: .86; }
.tr { font-stretch: 125%; font-size: calc(99cqi / 4.0758); }
.es { font-stretch: 100%; font-size: calc(99cqi / 4.1216); }
.en { font-stretch: 62%; font-size: calc(99cqi / 2.3034); }
.print { position: relative; background: #0d0f1c; height: 518px; }
.print img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 58%; }
.ink { filter: grayscale(1) contrast(1.12) brightness(.92); mix-blend-mode: screen; }
.plate { position: absolute; inset: 0; background: #9b5cff; isolation: isolate; mix-blend-mode: screen; transform: translate(7px, -6px); }
.plate img { filter: grayscale(1) contrast(1.35) brightness(.8); mix-blend-mode: multiply; }
.rule { position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: #9b5cff; }
</style></head><body><div class="page">
  <div class="left">
    <img class="wordmark" src="${pub("logo-wordmark.svg")}" alt="">
    <span class="t tr">müzik,</span><span class="t es">música,</span><span class="t en">music.</span>
  </div>
  <div class="print">
    <img class="ink" src="${pub("images/gallery/01-portrait.jpg")}" alt="">
    <div class="plate"><img src="${pub("images/gallery/01-portrait.jpg")}" alt=""></div>
  </div>
  <div class="rule"></div>
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
