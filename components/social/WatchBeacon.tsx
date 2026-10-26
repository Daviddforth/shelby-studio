"use client";

import { useEffect } from "react";

/**
 * Counts how long the video or audio on the page is really playing, and reports it
 * in small pieces. Renders nothing. The numbers are an estimate, not an exact audience.
 */
export default function WatchBeacon({ owner, target }: { owner: string; target: string }) {
  useEffect(() => {
    const media = document.querySelector<HTMLMediaElement>("video, audio");

    if (!media) return;

    let pending = 0;
    let counted = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const flush = () => {
      if (pending < 1) return;

      const seconds = Math.min(60, Math.round(pending));

      pending = Math.max(0, pending - seconds);

      const body = JSON.stringify({ owner, target, seconds, play: !counted });

      counted = true;

      try {
        const queued = navigator.sendBeacon?.("/api/watch", new Blob([body], { type: "application/json" }));

        if (!queued) {
          void fetch("/api/watch", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
        }
      } catch {
        // Statistics are optional.
      }
    };

    const tick = () => {
      if (!media.paused && !media.ended) pending += 1;

      if (pending >= 15) flush();
    };

    const start = () => {
      if (!timer) timer = setInterval(tick, 1000);
    };

    const stop = () => {
      if (timer) clearInterval(timer);

      timer = null;

      flush();
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };

    media.addEventListener("playing", start);
    media.addEventListener("pause", stop);
    media.addEventListener("ended", stop);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);

    return () => {
      media.removeEventListener("playing", start);
      media.removeEventListener("pause", stop);
      media.removeEventListener("ended", stop);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);

      stop();
    };
  }, [owner, target]);

  return null;
}
