/**
 * Builds the site's brand assets from Favicon.svg:
 *   app/icon.svg, app/favicon.ico, app/apple-icon.png  — the site icon
 *   public/logo-maymun.svg                           — the nav wordmark
 *
 * The icon is the spiral — the mark at the centre of the MAYMUN COLLECTIVE
 * lockup. It used to be the M; the spiral is more distinctive at tab size and
 * does not compete with the wordmark sitting next to it in the nav.
 *
 * Why this rebuilds the art rather than just re-cropping it — measured from the
 * source, at 2048px:
 *   - the badge is 1980x1933, i.e. 2.4% wider than tall — not actually a circle;
 *   - the spiral hangs off to the right of the badge's centre, so a straight
 *     crop reads visibly lop-sided;
 *   - three stray trace artifacts sit outside the mark;
 *   - the gloss and the soft rim collapse into grey mush well before 32px.
 *
 * So: the spiral is lifted out of the art on its own, everything else is
 * discarded, and it is recomposed centred on a true circle in the badge's own
 * measured off-white. Flat, symmetrical, and still legible at 16px.
 *
 * It stays dark-on-bone rather than the bone-on-transparent the mark is drawn
 * as in the wordmark: a pale spiral is invisible against a light tab strip.
 *
 * Regenerate after changing Favicon.svg:
 *     npm i --no-save sharp potrace && node scripts/build-icons.mjs
 * Neither package is a runtime dependency; this only runs by hand.
 */
import sharp from "sharp";
import potrace from "potrace";
import fs from "fs";
import os from "os";
import path from "path";

const SRC = "Favicon.svg";      // design source, at the repo root
const OUT = "app";              // Next picks icons up from here by filename
const PUB = "public";           // served assets
const N = 2048;                 // working resolution for measuring the art
// The spiral is drawn as a thin line at a tighter gauge than the M, so it needs
// more of the disc to survive the small sizes: rendered at 16/32/48 next to
// 0.66 and 0.72, 0.78 is the point where the outermost turn still separates
// from the rim at 32px while the innermost two stop merging at 48px. Below
// ~0.70 the whole mark closes into a dot at 16px.
const MARK_RATIO = 0.78;        // spiral diameter as a fraction of the disc
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "icons-"));

/* ------------------------------------------------ 1. isolate the spiral -- */
await sharp(SRC, { density: 4800 }).resize(N, N, { fit: "inside" }).png().toFile(`${TMP}/src.png`);
const { data, info } = await sharp(`${TMP}/src.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const at = (x, y) => (y * W + x) * 4;

const ink = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = at(x, y);
  const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  if (data[i + 3] > 128 && lum < 80) ink[y * W + x] = 1;
}

// Connected-component pass over the badge's ink. The components are, by area:
// the M, then the spiral, then three small trace artifacts. The icon is the
// spiral, so this keeps the SECOND largest and discards the rest.
const label = new Int32Array(W * H);
const comps = [];
let next = 1;
for (let s = 0; s < W * H; s++) {
  if (!ink[s] || label[s]) continue;
  const id = next++, stack = [s];
  label[s] = id;
  let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
  while (stack.length) {
    const p = stack.pop(), x = p % W, y = (p - x) / W;
    n++;
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
    if (x > 0 && ink[p - 1] && !label[p - 1]) { label[p - 1] = id; stack.push(p - 1); }
    if (x < W - 1 && ink[p + 1] && !label[p + 1]) { label[p + 1] = id; stack.push(p + 1); }
    if (y > 0 && ink[p - W] && !label[p - W]) { label[p - W] = id; stack.push(p - W); }
    if (y < H - 1 && ink[p + W] && !label[p + W]) { label[p + W] = id; stack.push(p + W); }
  }
  comps.push({ id, n, x0, y0, x1, y1 });
}

// Sorted by area: [0] is the M, [1] is the spiral. Picking by rank rather than
// by position because the badge art has no ids or groups to select on — it is
// a flat trace. The assertion below is what catches it if the source art ever
// changes shape underneath this.
comps.sort((a, b) => b.n - a.n);
const mark = comps[1];
if (!mark || comps.length < 2) throw new Error(`expected at least 2 ink components in ${SRC}, found ${comps.length}`);
const mw = mark.x1 - mark.x0 + 1, mh = mark.y1 - mark.y0 + 1;
const AR = mw / mh;
// The spiral is near enough square; a wildly off aspect means the components
// came out in a different order and we are about to build an icon of the M or
// of a stray artifact.
if (AR < 0.8 || AR > 1.25) throw new Error(`component 2 has aspect ${AR.toFixed(2)}, expected ~1 (the spiral)`);

/* ------------------------------------------------ 2. badge colour -------- */
let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (data[at(x, y) + 3] > 40) {
  if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y;
}
// Median over the middle of the badge, which excludes both the gloss highlight
// and the dark rim; a mean would be dragged around by both.
const px = [];
for (let y = by0 + (by1 - by0) * 0.15; y < by1 - (by1 - by0) * 0.15; y++) {
  for (let x = bx0 + (bx1 - bx0) * 0.15; x < bx1 - (bx1 - bx0) * 0.15; x++) {
    const xi = Math.round(x), yi = Math.round(y), i = at(xi, yi);
    if (data[i + 3] > 200 && !ink[yi * W + xi]) px.push([data[i], data[i + 1], data[i + 2]]);
  }
}
px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
const med = px[Math.floor(px.length / 2)];
const DISC = "#" + med.map((v) => v.toString(16).padStart(2, "0")).join("");

console.log(`spiral: ${mw}x${mh} (aspect ${AR.toFixed(3)}), badge colour ${DISC}`);

/* ------------------------------------------------ 3. mask --------------- */
const raw = Buffer.alloc(mw * mh * 4, 0);
for (let y = mark.y0; y <= mark.y1; y++) for (let x = mark.x0; x <= mark.x1; x++) {
  if (label[y * W + x] === mark.id) raw[((y - mark.y0) * mw + (x - mark.x0)) * 4 + 3] = 255;
}
const maskPng = await sharp(raw, { raw: { width: mw, height: mh, channels: 4 } }).png().toBuffer();

/* ------------------------------------------------ 4. compose ------------ */
// The spiral is sized as a fraction of the disc; see MARK_RATIO above for how
// that number was arrived at. The .ico and the .svg are composed from the same
// ratio so they stay visually identical.
const SIZE = 1024;
async function master(mRatio) {
  const MH = Math.round(SIZE * mRatio), MW = Math.round(MH * AR);
  const scaled = await sharp(maskPng).resize(MW, MH, { fit: "fill" }).toBuffer();
  const black = await sharp({
    create: { width: MW, height: MH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
  }).composite([{ input: scaled, blend: "dest-in" }]).png().toBuffer();
  const disc = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">` +
    `<circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="${DISC}"/></svg>`
  );
  return sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: disc },
      { input: black, left: Math.round((SIZE - MW) / 2), top: Math.round((SIZE - MH) / 2) },
    ])
    .png()
    .toBuffer();
}
const art = await master(MARK_RATIO);

/* ------------------------------------------------ 5. vector icon -------- */
// A traced SVG stays crisp at every size and costs ~2 KB, so modern browsers
// get that; the .ico below is the fallback.
const flat = await sharp(maskPng).flatten({ background: "#ffffff" }).png().toBuffer();
const d = await new Promise((res, rej) => {
  const p = new potrace.Potrace({ threshold: 128, turdSize: 8, optCurve: true, optTolerance: 0.2 });
  p.loadImage(flat, (err) => (err ? rej(err) : res(p.getPathTag().match(/ d="([^"]+)"/)[1])));
});
const R = 50, mH = 2 * R * MARK_RATIO, mW = mH * AR;
const k = mH / mh; // trace is in source-mask pixel units
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="${DISC}"/>
  <g transform="translate(${(100 - mW) / 2} ${(100 - mH) / 2}) scale(${k})"><path d="${d}" fill="#000000"/></g>
</svg>
`;
fs.writeFileSync(`${OUT}/icon.svg`, svg);

/* ------------------------------------------------ 6. emit --------------- */
// The Apple touch icon is a square tile, not a disc — iOS applies its own
// rounded-rect mask — so the circle is dropped and the spiral is set against a
// plain field of the badge colour. It also gets its own, smaller ratio: the
// disc ratio is tuned for corners a square does not have, and reusing it here
// left the spiral almost touching the edges.
const APPLE = 180, AH = Math.round(APPLE * 0.62), AW = Math.round(AH * AR);
const aScaled = await sharp(maskPng).resize(AW, AH, { fit: "fill" }).toBuffer();
const aBlack = await sharp({
  create: { width: AW, height: AH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } },
}).composite([{ input: aScaled, blend: "dest-in" }]).png().toBuffer();
await sharp({ create: { width: APPLE, height: APPLE, channels: 4, background: DISC } })
  .composite([{ input: aBlack, left: Math.round((APPLE - AW) / 2), top: Math.round((APPLE - AH) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/apple-icon.png`);

// Multi-resolution .ico, written by hand: sharp cannot emit ICO, and the format
// is just a 6-byte header, one 16-byte directory entry per image, then the PNGs.
const sizes = [16, 32, 48];
const blobs = [];
for (const s of sizes) blobs.push(await sharp(art).resize(s, s).png({ compressionLevel: 9 }).toBuffer());
const head = Buffer.alloc(6);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(blobs.length, 4);
let off = 6 + 16 * blobs.length;
const dir = blobs.map((b, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); e.writeUInt8(sizes[i], 1);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(b.length, 8); e.writeUInt32LE(off, 12);
  off += b.length;
  return e;
});
fs.writeFileSync(`${OUT}/favicon.ico`, Buffer.concat([head, ...dir, ...blobs]));

console.log(`wrote ${OUT}/icon.svg, ${OUT}/favicon.ico (16/32/48), ${OUT}/apple-icon.png (180)`);

/* ------------------------------------------------ 7. nav wordmark ------- */
// The full "MAYMUN COLLECTIVE" lockup is not drawn in the badge — it is the
// luminance mask the badge art is built from, embedded as the first base64 PNG
// in the source. It comes out as white artwork on black at only 294x168 after
// trimming, which is too soft for a retina nav bar, so it is traced to vector.
const b64 = fs.readFileSync(SRC, "utf8").match(/base64,([A-Za-z0-9+/=]+)/);
if (!b64) throw new Error(`no embedded raster found in ${SRC}`);
const wmSrc = Buffer.from(b64[1], "base64");

// Trim to the artwork's own bounds so the SVG viewBox carries no dead margin —
// the component can then size it purely by height and trust the aspect ratio.
const wmGrey = await sharp(wmSrc).greyscale().raw().toBuffer({ resolveWithObject: true });
let wx0 = 1e9, wy0 = 1e9, wx1 = -1, wy1 = -1;
for (let y = 0; y < wmGrey.info.height; y++) for (let x = 0; x < wmGrey.info.width; x++) {
  if (wmGrey.data[y * wmGrey.info.width + x] > 110) {
    if (x < wx0) wx0 = x; if (x > wx1) wx1 = x; if (y < wy0) wy0 = y; if (y > wy1) wy1 = y;
  }
}
const wmW = wx1 - wx0 + 1, wmH = wy1 - wy0 + 1;

// potrace traces dark regions, so the white-on-black mask is inverted first.
const wmFlat = await sharp(wmSrc)
  .extract({ left: wx0, top: wy0, width: wmW, height: wmH })
  .greyscale()
  .negate()
  .png()
  .toBuffer();

// optTolerance 0.4: measured against 0.15 / 0.8 / 1.5, all four are
// indistinguishable at nav size. The path weight is dominated by the spiral's
// concentric turns rather than curve precision, so it bottoms out near 8 KB and
// there is nothing to gain by simplifying harder.
const wmPath = await new Promise((res, rej) => {
  const p = new potrace.Potrace({ threshold: 128, turdSize: 2, optCurve: true, optTolerance: 0.4 });
  p.loadImage(wmFlat, (err) => (err ? rej(err) : res(p.getPathTag().match(/ d="([^"]+)"/)[1])));
});

// potrace marks holes (the counters of the A and the O) as nested subpaths
// meant for the even-odd rule; under SVG's default nonzero rule they fill in
// solid, so the rule is set explicitly.
// The fill is baked rather than left as `currentColor`: this is loaded through
// an <img>, and an SVG in an <img> is an isolated document, so `currentColor`
// would resolve to its own default black and the wordmark would disappear
// against the dark nav. Inlining the SVG would allow inheritance, but at ~9 KB
// of path data that is more than the entire HTML document currently weighs, on
// every page — not worth it for a mark that is always this one colour. The
// value is the palette's `bone` token; keep the two in step.
// The palette's `ink` (tailwind.config.ts) — the wordmark prints in the pale ink.
const INK = "#fafafa";
fs.writeFileSync(
  `${PUB}/logo-maymun.svg`,
  // width/height on the root as well as the viewBox, so the file has a real
  // intrinsic size instead of falling back to the SVG-in-<img> default of 150px
  // tall with a derived width.
  `<svg xmlns="http://www.w3.org/2000/svg" width="${wmW}" height="${wmH}" viewBox="0 0 ${wmW} ${wmH}" role="img" aria-label="Maymun Collective"><path d="${wmPath}" fill="${INK}" fill-rule="evenodd"/></svg>\n`
);
console.log(`wrote ${PUB}/logo-maymun.svg (${wmW}x${wmH}, aspect ${(wmW / wmH).toFixed(3)})`);

fs.rmSync(TMP, { recursive: true, force: true });
