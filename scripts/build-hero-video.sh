#!/usr/bin/env bash
#
# Builds the hero background film in public/video/ from the original drone shot.
#
#   ./scripts/build-hero-video.sh /path/to/DJI_source.mov
#
# The source (1920x1080 HEVC, 50fps, ~27 MB) is NOT committed — too large, and
# nothing at runtime needs it. Keep it wherever the raw footage lives.
#
# ── Why the framing is what it is ───────────────────────────────────────────
# The footage is a drone orbit of the stage, and the stage's LED backdrop shows
# the collective's own wordmark, dead centre for most of the clip. The hero's
# headline is that same wordmark — so using the clip whole put two MAYMUN
# COLLECTIVEs on top of each other, misaligned, which read as a mistake rather
# than a design.
#
# The fix is the crop below, not a heavier scrim: from ~12s the drone has swung
# right and down, and the right-hand side of the frame is clean stage, the sweep
# of pink floor lights, the band and the crowd barrier — atmosphere with no
# competing text. START is set past the point where any of the backdrop lettering
# still clips the top-left corner.
#
# That window is only ~4s, which is short for a loop, so SLOW stretches it to
# ~8s. The source is 50fps and the output 24fps, so there are more than enough
# real frames to do this without interpolation — and the slower drift suits a
# background better than the original pace anyway.
#
# START is late enough that the tail of the backdrop lettering has left the
# crop. The last of it lingers around the very top-left corner, which the hero's
# corner scrim covers regardless; see components/Hero.
#
# Cropping to the interesting region rather than scaling the whole frame also
# made the files much smaller: 531 KB against 1.38 MB for the full-frame version.
set -euo pipefail

SRC="${1:?usage: build-hero-video.sh <source.mov>}"
OUT="public/video"
FF="${FFMPEG:-ffmpeg}"

START=12.8       # seconds into the source; past the last of the backdrop text
SLOW=2.0         # PTS multiplier — 0.5x speed
FPS=25          # 50fps source slowed 2x = 25 unique frames/sec; matching it
                # exactly means every output frame is a real one
CRF_H264=26      # the scrim is lighter now and the film is meant to read
                 # clearly, so this buys back the detail 33 was throwing away
CRF_VP9=38       # tuned to match the H.264 quality; still smaller

# Landscape 16:9 from the right of the frame, and a 9:16 centre-right crop for
# phones. A 16:9 file object-cover'd into a portrait viewport would show only
# its middle sliver, upscaled ~2.6x; a real portrait crop is sharper and smaller.
# 1280x720 is exactly two thirds of the 1920x1080 source and the largest 16:9
# window that still starts to the right of the backdrop lettering. Only the tail
# of "COLLECTIVE" clips the very top-left corner, where the hero's radial wash
# sits anyway — and taking the whole bottom-right quadrant rather than a tighter
# box means the full band, the keys rig and the sweep of pink floor lights are
# all in shot, at real 720p instead of an upscale.
CROP_WIDE="crop=1280:720:640:360"
CROP_TALL="crop=608:1080:1150:0"

mkdir -p "$OUT"

encode() {  # name, crop, width, height
  local name="$1" crop="$2" w="$3" h="$4"
  local vf="${crop},setpts=${SLOW}*PTS,fps=${FPS},scale=${w}:${h}:flags=lanczos"

  "$FF" -hide_banner -loglevel error -y -ss "$START" -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libx264 -preset slow -crf "$CRF_H264" -profile:v high \
    -an -movflags +faststart "$OUT/hero-${name}.mp4"

  "$FF" -hide_banner -loglevel error -y -ss "$START" -i "$SRC" -map 0:v:0 \
    -vf "$vf" -pix_fmt yuv420p \
    -c:v libvpx-vp9 -crf "$CRF_VP9" -b:v 0 -deadline good -cpu-used 4 -row-mt 1 \
    -an "$OUT/hero-${name}.webm"

  # Poster = the video's own first frame, so playback starts from exactly the
  # image already on screen and there is nothing to crossfade.
  "$FF" -hide_banner -loglevel error -y -ss "$START" -i "$SRC" -map 0:v:0 \
    -frames:v 1 -vf "${crop},scale=$((w * 7 / 10)):-1:flags=lanczos" \
    -q:v 6 "$OUT/hero-poster-${name}.webp"

  printf "  %-8s mp4 %5.0f KB   webm %5.0f KB   poster %4.0f KB\n" "$name" \
    "$(stat -c%s "$OUT/hero-${name}.mp4" | awk '{print $1/1024}')" \
    "$(stat -c%s "$OUT/hero-${name}.webm" | awk '{print $1/1024}')" \
    "$(stat -c%s "$OUT/hero-poster-${name}.webp" | awk '{print $1/1024}')"
}

# Output at the crop's own pixel size. Scaling beyond it cannot add detail,
# only weight; the browser upscales from a clean source better than we can.
encode desktop "$CROP_WIDE" 1280 720
encode mobile  "$CROP_TALL"  608 1080

echo
echo "  total: $(du -sh "$OUT" | cut -f1)"
