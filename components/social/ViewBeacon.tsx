"use client";

import { useEffect } from "react";

/** Counts one view of a page (once per visitor per day). Renders nothing. */
export default function ViewBeacon({ owner, target }: { owner: string; target: string }) {
  useEffect(() => {
    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, target }),
      keepalive: true,
    }).catch(() => {});
  }, [owner, target]);

  return null;
}
