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
# Two framings, because one cannot serve both orientations. A 16:9 frame
# object-cover'd into a 9:16 phone shows about a quarter of its width — here
# that is a sliver of stage floor with the band and the backdrop both cut away.
# So phones get a real 9:16 centre crop of the same footage, full length. The
# crop was checked at t = 0/4/8/12/16s: the stage, the band and the wordmark
# stay inside it for the entire orbit.
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

CRF_H264_WIDE=32
CRF_VP9_WIDE=45
CRF_H264_TALL=25
CRF_VP9_TALL=34

mkdir -p "$OUT"

encode() {  # name, extra-filter, width, height, crf_h264, crf_vp9
  local name="$1" pre="$2" w="$3" h="$4" ch="$5" cv="$6"
  local vf="fps=${FPS},${pre}scale=${w}:${h}:flags=lanczos,${DENOISE}"

  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libx264 -preset slow -crf "$ch" -profile:v high -level 4.0 \
    -maxrate 1700k -bufsize 3400k \
    -an -movflags +faststart "$OUT/hero-${name}.mp4"

  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libvpx-vp9 -crf "$cv" -b:v 0 -deadline good -cpu-used 4 -row-mt 1 \
    -an "$OUT/hero-${name}.webm"

  # Poster = the film's own first frame, so the swap from still to moving image
  # is invisible: playback begins on exactly the picture already on screen.
  "$FF" -hide_banner -loglevel error -y -i "$SRC" -map 0:v:0 \
    -frames:v 1 -vf "${pre}scale=$((w / 2)):-1:flags=lanczos" \
    -q:v 50 "$OUT/hero-poster-${name}.webp"

  printf "  %-6s %sx%-5s mp4 %6.2f MB   webm %6.2f MB   poster %4.0f KB\n" \
    "$name" "$w" "$h" \
    "$(stat -c%s "$OUT/hero-${name}.mp4" | awk '{print $1/1048576}')" \
    "$(stat -c%s "$OUT/hero-${name}.webm" | awk '{print $1/1048576}')" \
    "$(stat -c%s "$OUT/hero-poster-${name}.webp" | awk '{print $1/1024}')"
}

# Landscape: the whole frame at 1600x900. See the bitrate note above for why the
# CRF is where it is.
encode wide "" 1600 900 "$CRF_H264_WIDE" "$CRF_VP9_WIDE"

# Portrait: a true 9:16 centre crop at native height, so phones get real pixels
# rather than a 2.6x upscale of the middle sliver.
encode tall "crop=608:1080:656:0," 608 1080 "$CRF_H264_TALL" "$CRF_VP9_TALL"

echo
echo "  total in $OUT: $(du -sh "$OUT" | cut -f1)"
