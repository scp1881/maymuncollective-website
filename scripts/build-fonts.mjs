/**
 * Subsets Archivo (variable: width 62–125, weight 100–900) into the two files
 * the site serves from public/fonts/.
 *
 *   npm run fonts
 *
 * Source: @fontsource-variable/archivo (SIL OFL 1.1), the "standard" files,
 * which carry both the wdth and wght axes. The width axis is the design —
 * each language of the tagline is set at its own width — so it stays, but it
 * is also most of the file's weight, so everything else is trimmed:
 *
 *  - Glyphs: Basic Latin + Latin-1 + the punctuation the copy uses. Latin-1
 *    already covers Spanish (ñ á é í ó ú ¿ ¡) and Turkish ç ö ü; the second,
 *    tiny file adds the six Turkish letters outside it (ğ Ğ ı İ ş Ş) and the
 *    Windows-1252 extras (Œ œ Š š Ÿ Ž ž). It only loads when a page renders
 *    one of those characters (unicode-range). A name with any other Latin
 *    Extended letter (Polish, Czech…) needs it added to TURKISH_PLUS below —
 *    otherwise that one glyph falls back to the system face.
 *  - Weight axis: pinned to 300–900, the range the design uses.
 *  - Width axis: kept whole (62–125). Every step is used by the tagline.
 *
 * Adding a character outside these ranges means re-running this script.
 */
import fs from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";

const SRC = "node_modules/@fontsource-variable/archivo/files";
const OUT = "public/fonts";

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join("");

// U+0020–007E, U+00A0–00FF, plus typographic punctuation and the euro sign.
const LATIN = range(0x20, 0x7e) + range(0xa0, 0xff) + "‐–—‘’‚“”„•…‹›€™";
const TURKISH_PLUS = "ğĞıİşŞŒœŠšŸŽž";

const AXES = { wght: { min: 300, max: 900 }, wdth: { min: 62, max: 125 } };

const jobs = [
  { src: "archivo-latin-standard-normal.woff2", out: "archivo-latin.woff2", text: LATIN },
  { src: "archivo-latin-ext-standard-normal.woff2", out: "archivo-latin-ext.woff2", text: TURKISH_PLUS },
];

fs.mkdirSync(OUT, { recursive: true });
for (const job of jobs) {
  const input = fs.readFileSync(path.join(SRC, job.src));
  const output = await subsetFont(input, job.text, { targetFormat: "woff2", variationAxes: AXES });
  fs.writeFileSync(path.join(OUT, job.out), output);
  console.log(`${job.out}: ${(input.length / 1024).toFixed(1)} KB → ${(output.length / 1024).toFixed(1)} KB`);
}
