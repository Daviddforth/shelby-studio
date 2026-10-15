"use client";

import { useSyncExternalStore } from "react";

import { getSiteOrigin } from "@/lib/media/types";

// The origin never changes while the page is open, so there is nothing to subscribe to.
function subscribeToNothing() {
  return () => {};
}

/**
 * Browser origin on the client (works on localhost and in production),
 * configured site origin during server render.
 */
export function useOrigin(): string {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.origin,
    () => getSiteOrigin()
  );
}
