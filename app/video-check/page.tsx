"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A self-contained diagnostic for the hero film.
 *
 * Why this exists: the film has now been rebuilt several times, and every
 * version passed every test that can be run from the build environment —
 * playback, codecs, autoplay policy, the lot — while still failing on a real
 * device we cannot reach. That is not a problem more guessing can solve. This
 * page runs the same checks on the device where it actually fails and prints a
 * verdict, so one screenshot settles it.
 *
 * It is not linked from anywhere and is marked noindex. Delete the route once
 * the film is confirmed working.
 */

type Row = { label: string; value: string; state: "ok" | "bad" | "info" };

const V = "4";
const SOURCES = [
  { url: `/video/hero-film.webm?v=${V}`, mime: 'video/webm; codecs="vp9"' },
  { url: `/video/hero-film.mp4?v=${V}`, mime: 'video/mp4; codecs="avc1.64001f"' },
];

const MEDIA_ERR: Record<number, string> = {
  1: "ABORTED — the fetch was cancelled",
  2: "NETWORK — the download failed partway",
  3: "DECODE — the file downloaded but could not be decoded",
  4: "SRC_NOT_SUPPORTED — no source was playable (codec or 404)",
};

export default function VideoCheck() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [verdict, setVerdict] = useState("Running checks…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const out: Row[] = [];
      const add = (label: string, value: string, state: Row["state"] = "info") =>
        out.push({ label, value, state });

      // 1. Does the device even want motion?
      let reduced = false;
      try {
        reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        /* ignore */
      }
      add(
        "Reduce Motion (OS setting)",
        reduced ? "ON — this alone stops the film on the homepage" : "off",
        reduced ? "bad" : "ok",
      );

      // 2. Codec support, per format.
      const probe = document.createElement("video");
      const webm = probe.canPlayType(SOURCES[0].mime);
      const mp4 = probe.canPlayType(SOURCES[1].mime);
      add("Can play WebM / VP9", webm || "no", webm ? "ok" : "info");
      add("Can play MP4 / H.264", mp4 || "no", mp4 ? "ok" : "bad");
      if (!webm && !mp4) {
        add("Codecs", "neither format is supported by this browser", "bad");
      }

      // 3. Are the files actually being served?
      for (const s of SOURCES) {
        try {
          const r = await fetch(s.url, { method: "GET", headers: { Range: "bytes=0-1023" } });
          const len = r.headers.get("content-range") || r.headers.get("content-length") || "?";
          add(
            `Server: ${s.url.split("/").pop()}`,
            `HTTP ${r.status} · ${r.headers.get("content-type") || "no content-type"} · ${len}`,
            r.ok ? "ok" : "bad",
          );
        } catch (e) {
          add(`Server: ${s.url.split("/").pop()}`, `request failed — ${String(e)}`, "bad");
        }
      }

      // 4. Data saver / connection, which some browsers use to block media.
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
        .connection;
      if (conn) {
        add(
          "Connection",
          `${conn.effectiveType ?? "?"}${conn.saveData ? " · Data Saver ON" : ""}`,
          conn.saveData ? "bad" : "info",
        );
      }

      // 5. The real test: try to play, exactly as the homepage does.
      const v = ref.current;
      if (v) {
        v.muted = true;
        let playErr = "";
        try {
          await v.play();
        } catch (e) {
          playErr = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
        }
        await new Promise((r) => setTimeout(r, 2500));
        const advanced = v.currentTime > 0.05;
        add(
          "Autoplay permitted",
          playErr ? `REFUSED — ${playErr}` : "yes",
          playErr ? "bad" : "ok",
        );
        add("Chosen source", v.currentSrc ? v.currentSrc.split("/").pop()! : "none selected", v.currentSrc ? "ok" : "bad");
        add("Frames advancing", advanced ? `yes — at ${v.currentTime.toFixed(2)}s` : "NO — stuck at 0", advanced ? "ok" : "bad");
        add("readyState / networkState", `${v.readyState} / ${v.networkState}`, v.readyState >= 2 ? "ok" : "bad");
        if (v.error) {
          add("Media error", MEDIA_ERR[v.error.code] ?? `code ${v.error.code}`, "bad");
        }

        if (reduced) setVerdict("Reduce Motion is ON — that is why the film is a still image on the homepage.");
        else if (v.error) setVerdict("The browser could not load or decode the file. See 'Media error'.");
        else if (playErr) setVerdict("The browser refused autoplay. Tap the video below — if it then plays, it is an autoplay policy, not the file.");
        else if (!advanced) setVerdict("Playback started but no frames advanced — likely still buffering, or a decode stall.");
        else setVerdict("The film plays fine on this device. If the homepage shows a still, you are looking at a cached page — hard-refresh it.");
      }

      // 6. Which build is being looked at — a cached page is a recurring red herring.
      const build = document.querySelector('meta[name="build-commit"]')?.getAttribute("content");
      add("Build commit", build || "unknown", "info");
      add("Browser", navigator.userAgent, "info");

      if (!cancelled) setRows(out);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto min-h-svh w-full max-w-2xl px-5 py-12 font-body">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight">Hero film check</h1>
      <p className="mt-3 text-sm text-muted">
        Open this on the device where the film does not play, then send a screenshot of
        this whole page.
      </p>

      <p className="mt-6 rounded border border-line bg-surface p-4 text-base font-medium text-bone">
        {verdict}
      </p>

      <video
        ref={ref}
        muted
        loop
        playsInline
        controls
        preload="auto"
        className="mt-6 w-full rounded border border-line bg-surface"
      >
        <source src={SOURCES[0].url} type="video/webm" />
        <source src={SOURCES[1].url} type="video/mp4" />
      </video>
      <p className="mt-2 text-xs text-muted">
        The same film, with controls. If this plays when you press play but the homepage
        does not, the file is fine and the problem is an autoplay policy.
      </p>

      <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-4 py-3">
            <dt className="w-44 shrink-0 text-muted">{r.label}</dt>
            <dd
              className={
                r.state === "bad" ? "break-all text-red-400" : r.state === "ok" ? "break-all text-emerald-400" : "break-all text-bone/80"
              }
            >
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
