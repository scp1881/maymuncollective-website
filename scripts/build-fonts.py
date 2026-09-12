#!/usr/bin/env python3
"""
Subsets the site's two webfonts and writes them to public/fonts/.

Why: Google serves Space Grotesk and Inter split by unicode-range, and the two
ranges this site actually renders came to ~88 KB across three files. Those are
High-priority requests that contend with the render-blocking stylesheet, so they
sit directly on first paint. But the site needs a few hundred glyphs, not the
several thousand those files carry.

The output keeps the same unicode-range split, so the browser still only fetches
the extended file when a page renders a character from it — it is just far
smaller. The variable weight axis is preserved (the design uses 400-700), so
nothing about how the fonts are used changes.

Dependencies (not runtime, not committed): pip install fonttools brotli

The unsubsetted Google files are vendored in fonts-src/ (not served, ~170 KB)
precisely so this stays re-runnable offline. Without them the pipeline would be
a one-way door: next/font is gone, so there would be nothing left to subset
from, and the next person to touch the fonts would have to reverse-engineer it.

    pip install fonttools brotli && python3 scripts/build-fonts.py

To change a family: drop its Google `latin` and `latin-ext` woff2 into
fonts-src/ under the same names, update the unicode-range values in
app/globals.css from fonts-src/unicode-ranges.txt, and re-run.
"""
import os
import re
import subprocess
import sys

SRC = "fonts-src"
OUT = "public/fonts"

# The characters the site can render. Deliberately wider than what it renders
# today: the whole of Latin-1 and Latin Extended-A costs little and means a new
# member name or a line of Turkish, Spanish, Polish or Czech copy cannot end up
# silently falling back to Arial for one letter.
CODEPOINTS = (
    list(range(0x0020, 0x007F))    # ASCII printable
    + list(range(0x00A0, 0x0100))  # Latin-1 Supplement (ü ú ö ç ©  ...)
    + list(range(0x0100, 0x0180))  # Latin Extended-A (ı ğ ş İ Ğ Ş  ...)
    + [
        0x2013, 0x2014,            # – —
        0x2018, 0x2019,            # ' '
        0x201C, 0x201D,            # " "
        0x2026,                    # …
        0x2190, 0x2192, 0x2197,    # ← → ↗
        0x00B7,                    # ·
    ]
)

# family key -> (source woff2, output name). Filled in from the build CSS below.
SOURCES = []


def discover():
    """The vendored sources, paired with the unicode-range each one covers."""
    ranges = {}
    rpath = os.path.join(SRC, "unicode-ranges.txt")
    if os.path.exists(rpath):
        for line in open(rpath, encoding="utf8"):
            if ":" in line:
                k, v = line.split(":", 1)
                ranges[k.strip()] = v.strip()
    out = []
    for family in ("space-grotesk", "inter"):
        for variant in ("latin", "ext"):
            path = os.path.join(SRC, f"{family}-{variant}.woff2")
            if os.path.exists(path):
                out.append((family, variant, path, ranges.get(f"{family}-{variant}", "")))
    if out:
        return out
    return discover_from_build()


def discover_from_build():
    """Fallback: read the files a next/font build emitted (first run only)."""
    css_files = [
        os.path.join(dp, f)
        for dp, _, fs in os.walk(".next/static/css")
        for f in fs
        if f.endswith(".css")
    ]
    if not css_files:
        sys.exit(".next/static/css not found — run `npm run build` with next/font first")
    css = open(css_files[0], encoding="utf8").read()
    found = []
    for blk in re.findall(r"@font-face\{[^}]*\}", css):
        fam = re.search(r"font-family:([^;]+)", blk)
        src = re.search(r"url\(([^)]+)\)", blk)
        rng = re.search(r"unicode-range:([^;}]+)", blk)
        if not (fam and src and rng):
            continue
        name = fam.group(1)
        family = "space-grotesk" if "Space_Grotesk" in name else "inter" if "Inter" in name else None
        if not family:
            continue
        path = ".next" + src.group(1).replace("/_next", "")
        r = rng.group(1)
        # Only the two ranges this site draws from: "latin" (which Google marks
        # with u+00?? ) and "latin-ext" (which starts at u+0100).
        if "u+00??" in r:
            found.append((family, "latin", path, r))
        elif r.startswith("u+0100-02ba"):
            found.append((family, "ext", path, r))
    return found


def main():
    os.makedirs(OUT, exist_ok=True)
    unicodes = ",".join(f"U+{c:04X}" for c in CODEPOINTS)
    manifest = []
    total_before = total_after = 0

    for family, variant, path, rng in discover():
        if not os.path.exists(path):
            print(f"  skip (missing) {path}")
            continue
        out = f"{OUT}/{family}-{variant}.woff2"
        before = os.path.getsize(path)
        subprocess.run(
            [
                sys.executable, "-m", "fontTools.subset", path,
                f"--unicodes={unicodes}",
                "--flavor=woff2",
                "--layout-features=*",   # keep kerning/ligatures
                "--no-hinting",
                f"--output-file={out}",
            ],
            check=True,
        )
        after = os.path.getsize(out)
        total_before += before
        total_after += after
        manifest.append((family, variant, rng, after))
        print(f"  {family}-{variant}: {before/1024:6.1f} KB -> {after/1024:5.1f} KB")

    print(f"\n  total {total_before/1024:.1f} KB -> {total_after/1024:.1f} KB "
          f"({100 - total_after/total_before*100:.0f}% smaller)")
    print("\n  unicode-range values for globals.css:")
    for family, variant, rng, _ in manifest:
        print(f"    {family}-{variant}: {rng}")


if __name__ == "__main__":
    main()
