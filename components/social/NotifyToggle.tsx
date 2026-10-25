"use client";

import { useEffect, useState } from "react";

import { Bell, BellOff, Loader2 } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { signWalletMessage } from "@/lib/media/clientSign";
import { buildNotifyMessage } from "@/lib/social/types";

function keyToBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");

  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));

  const bytes = new Uint8Array(new ArrayBuffer(raw.length));

  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

  return bytes;
}

/** Turns "tell me when creators I follow go live" on or off for this browser. Hidden if the browser or server cannot do it. */
export default function NotifyToggle() {
  const { walletConnected, walletAddress, account, signMessage } = useWallet();

  const [supported] = useState(
    () => typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  );

  const [enabled, setEnabled] = useState(false);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supported || !walletAddress) return;

    let cancelled = false;

    (async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");

        const existing = await registration.pushManager.getSubscription();

        const query = new URLSearchParams({ wallet: walletAddress });

        if (existing) query.set("endpoint", existing.endpoint);

        const data = await (await fetch(`/api/push?${query}`, { cache: "no-store" })).json();

        if (!cancelled && data?.success) {
          setEnabled(Boolean(data.enabled));
          setOn(Boolean(data.subscribed));
        }
      } catch {
        // Notifications are optional. Stay hidden.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supported, walletAddress]);

  async function toggle() {
    if (!walletAddress) return;

    setBusy(true);
    setError("");

    try {
      const action = on ? "off" : "on";

      if (action === "on" && (await Notification.requestPermission()) !== "granted") {
        throw new Error("Allow notifications for this site in your browser first.");
      }

      const registration = await navigator.serviceWorker.register("/sw.js");

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        if (action === "off") {
          setOn(false);
          return;
        }

        const keyData = await (await fetch("/api/push", { cache: "no-store" })).json();

        if (!keyData.publicKey) throw new Error("Notifications are not set up on this server yet.");

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: keyToBytes(keyData.publicKey),
        });
      }

      const issuedAt = new Date().toISOString();

      const proof = await signWalletMessage({
        signMessage,
        account,
        message: buildNotifyMessage(walletAddress, action, issuedAt),
      });

      const response = await fetch("/api/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: walletAddress, action, issuedAt, subscription: subscription.toJSON(), ...proof }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) throw new Error(data.error || "Could not update notifications.");

      if (action === "off") await subscription.unsubscribe().catch(() => false);

      setOn(action === "on");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update notifications.");
    } finally {
      setBusy(false);
    }
  }

  if (!supported || !walletConnected || !enabled) return null;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:text-white disabled:opacity-60"
      >
        {busy ? <Loader2 size={13} className="animate-spin" /> : on ? <BellOff size={13} /> : <Bell size={13} />}
        {on ? "Stop live alerts" : "Alert me when they go live"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
