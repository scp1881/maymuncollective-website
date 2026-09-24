#!/usr/bin/env python3
"""
Subsets the site's two webfonts and writes them to public/fonts/.

Why: Google serves Bricolage Grotesque and Inter split by unicode-range, and the
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

# The families vendored in fonts-src/, each as <family>-latin.woff2 and
# <family>-ext.woff2. `bricolage` is the display face (hero headline and every
# section heading); `inter` is body copy. Space Grotesk was the display face
# until the hero was redesigned — see the note in app/globals.css.
FAMILIES = ("bricolage", "inter")

# Variable axis ranges to keep, per family. Bricolage ships wght 200-800 but the
# site only draws 500 (font-medium) to 800 (the hero); clipping the axis before
# subsetting takes the latin file from 35.8 KB to 33.1 KB, and it is a
# render-blocking preload, so that is worth having. Inter is left whole: it is
# the body face and a future weight change should not need a rebuild here.
AXIS_LIMITS = {"bricolage": "wght=500:800"}

# A second, tiny cut of the display face carrying every capital, plus the
# punctuation and accented capitals a headline might reach for. Capitals are
# all it needs: everything drawn from this cut — the hero name, the section
# headings, the /gallery holding page — is set in uppercase.
#
# Why it exists: the hero headline is the LCP element, and it only becomes an
# LCP candidate once its fade-up finishes AND the real face has swapped in.
# Waiting on the full 33 KB latin cut put that at 1176 ms on Slow-4G. This file
# is ~2 KB, so it lands with the stylesheet instead.
#
# It is first in the `display` stack in tailwind.config.ts, with the full face
# right behind it: any character this cut does not carry simply falls through,
# same family, same weight, visually identical. Changing the headline copy
# cannot break rendering — at worst it costs one more font request.
DISPLAY_NAME = "bricolage-display"
# The whole alphabet rather than just the letters in today's copy: the section
# headings are editable content, and a cut that only carried the current
# wording would quietly start pulling the 33 KB face the first time someone
# renamed a section. The extra 13 capitals cost about a kilobyte.
DISPLAY_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .,'-&ÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ"

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
    for family in FAMILIES:
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

        # Clip the variable axis first where asked; pyftsubset in this version
        # has no --variations, so it is a separate instancer pass.
        limit = AXIS_LIMITS.get(family)
        src_path = path
        if limit:
            src_path = f"{OUT}/.{family}-{variant}.instanced.ttf"
            subprocess.run(
                [sys.executable, "-m", "fontTools.varLib.instancer", path, limit, "-o", src_path],
                check=True, stdout=subprocess.DEVNULL,
            )

        subprocess.run(
            [
                sys.executable, "-m", "fontTools.subset", src_path,
                f"--unicodes={unicodes}",
                "--flavor=woff2",
                "--layout-features=*",   # keep kerning/ligatures
                "--no-hinting",
                f"--output-file={out}",
            ],
            check=True,
        )
        if limit:
            os.remove(src_path)
        after = os.path.getsize(out)
        total_before += before
        total_after += after
        manifest.append((family, variant, rng, after))
        print(f"  {family}-{variant}: {before/1024:6.1f} KB -> {after/1024:5.1f} KB")

    disp_range = build_display_subset()

    print(f"\n  total {total_before/1024:.1f} KB -> {total_after/1024:.1f} KB "
          f"({100 - total_after/total_before*100:.0f}% smaller)")
    print("\n  unicode-range values for globals.css:")
    for family, variant, rng, _ in manifest:
        print(f"    {family}-{variant}: {rng}")
    print(f"    {DISPLAY_NAME}: {disp_range}")


def build_display_subset():
    """The headline-only cut. Returns the unicode-range it actually covers."""
    src = os.path.join(SRC, "bricolage-latin.woff2")
    if not os.path.exists(src):
        print(f"  skip (missing) {src}")
        return ""
    inst = f"{OUT}/.display.instanced.ttf"
    subprocess.run(
        [sys.executable, "-m", "fontTools.varLib.instancer", src,
         AXIS_LIMITS["bricolage"], "-o", inst],
        check=True, stdout=subprocess.DEVNULL,
    )
    out = f"{OUT}/{DISPLAY_NAME}.woff2"
    chars = sorted({ord(c) for c in DISPLAY_CHARS})
    subprocess.run(
        [sys.executable, "-m", "fontTools.subset", inst,
         "--unicodes=" + ",".join(f"U+{c:04X}" for c in chars),
         "--flavor=woff2", "--layout-features=*", "--no-hinting",
         f"--output-file={out}"],
        check=True,
    )
    os.remove(inst)

    # Emit the range from what the file ACTUALLY carries, not from the wish
    # list: a unicode-range advertising a glyph the file lacks would have the
    # browser pick this face and then fall through per character anyway, which
    # is just a slower way to get the same pixels.
    from fontTools.ttLib import TTFont
    have = sorted(TTFont(out).getBestCmap())
    print(f"  {DISPLAY_NAME}: {os.path.getsize(out)/1024:5.1f} KB "
          f"({len(have)} glyphs, headline-only)")
    return ",".join(f"u+{c:04x}" for c in have)


if __name__ == "__main__":
    main()
