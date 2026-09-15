#!/usr/bin/env bash
#
# Builds the hero background film in public/video/ from the original drone shot.
#
#   ./scripts/build-hero-video.sh /path/to/DJI_source.mov
#
# The source (1920x1080 HEVC 10-bit, 50fps, 16.88s, ~27 MB) is NOT committed —
# too large, and nothing at runtime needs it. Keep it wherever the raw footage
# lives and pass its path in.
#
# ── What this produces, and why ─────────────────────────────────────────────
# The whole clip, start to finish, at its own pace. An earlier version cut a 4s
# window and slowed it to half speed to make a tight loop; this does not. The
# drone's full orbit is the point.
#
# ONE master, at 4:3, deliberately. There used to be two — a 16:9 landscape cut
# and a 9:16 portrait cut — switched by the `media` attribute on <source>. That
# attribute is well supported on <source> inside <picture>, but support inside
# <video> is inconsistent across engines and could only ever be verified here in
# Chromium, which made it an untested dependency sitting directly on the one
# thing that had already failed three times. It is gone.
#
# 4:3 is the shape that survives both crops. `object-cover` into a 16:9 desktop
# viewport keeps the full width and trims 135 rows top and bottom (which loses
# sky and foreground clutter — an improvement). Into a 9:16 phone it keeps the
# full height and shows the middle ~35% of the width, which lands on the stage,
# the band and the wordmark. Checked at t = 2/8/14s across the orbit.
#
# ── The bitrate budget, which is the whole ballgame ─────────────────────────
# A background film that takes ten seconds to start is indistinguishable, to the
# person looking at it, from one that is broken. What decides that is not file
# size but BITRATE against the visitor's connection: a progressive download the
# browser cannot stream in real time makes it buffer a large fraction of the
# file before it will begin.
#
# Measured on Slow-4G (1.6 Mbps) with 4x CPU throttling, time to the first
# `playing` event on the landscape cut:
#
#     2.51 Mbps (5.3 MB)  ->  11.8 s     over budget, buffers ~45% first
#     1.62 Mbps (3.3 MB)  ->   4.7 s     marginal
#     1.28 Mbps (2.6 MB)  ->   see README, comfortably under
#
# So the CRFs below are chosen to land under ~1.3 Mbps, not to hit a target
# quality. Raise them and the film stops playing for people on slow links.
#
# Within that budget, resolution beats compression: 1600x900 at CRF 45 is both
# smaller AND visibly sharper than 1280x720 at CRF 40, because this footage is
# mostly large moving shapes. Checked side by side at 1:1 before choosing.
#
# `hqdn3d` earns its place: the wall's dither is noise, and denoising it before
# the encoder sees it took ~20% off at the same CRF with no visible loss.
#
# 25fps from a 50fps source means every output frame is a real one, no blending.
set -euo pipefail

SRC="${1:?usage: build-hero-video.sh <source.mov>}"
OUT="public/video"
FF="${FFMPEG:-ffmpeg}"

FPS=25
DENOISE="hqdn3d=3:2:4:4"

CRF_H264=32
CRF_VP9=45

mkdir -p "$OUT"

encode() {  # name, crop, width, height
  local name="$1" pre="$2" w="$3" h="$4"
  local vf="fps=${FPS},${pre}scale=${w}:${h}:flags=lanczos,${DENOISE}"

  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libx264 -preset slow -crf "$CRF_H264" -profile:v high -level 4.0 \
    -maxrate 1700k -bufsize 3400k \
    -an -movflags +faststart "$OUT/hero-${name}.mp4"

  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libvpx-vp9 -crf "$CRF_VP9" -b:v 0 -deadline good -cpu-used 4 -row-mt 1 \
    -an "$OUT/hero-${name}.webm"

  # Poster = the film's own first frame, so the swap from still to moving image
  # is invisible: playback begins on exactly the picture already on screen.
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -frames:v 1 -vf "${pre}scale=$((w / 2)):-1:flags=lanczos" \
    -q:v 50 "$OUT/hero-poster-${name}.webp"

  printf "  %-6s %sx%-5s mp4 %6.2f MB (%s)   webm %6.2f MB   poster %4.0f KB\n" \
    "$name" "$w" "$h" \
    "$(stat -c%s "$OUT/hero-${name}.mp4" | awk '{print $1/1048576}')" \
    "$(stat -c%s "$OUT/hero-${name}.mp4" | awk '{printf "%.2f Mbps", $1*8/16.88/1000000}')" \
    "$(stat -c%s "$OUT/hero-${name}.webm" | awk '{print $1/1048576}')" \
    "$(stat -c%s "$OUT/hero-poster-${name}.webp" | awk '{print $1/1024}')"
}

encode film "crop=1440:1080:240:0," 1440 1080

echo
echo "  total in $OUT: $(du -sh "$OUT" | cut -f1)"
