"use client";

import { useEffect, useState } from "react";

import { Loader2, Send } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { postJson, signAction } from "@/lib/actionsClient";

/** Connect a Telegram chat so the bot messages you when creators you follow go live. Hidden if the server has no bot. */
export default function TelegramLink() {
  const wallet = useWallet();

  const owner = wallet.walletAddress;

  const [enabled, setEnabled] = useState(false);
  const [linked, setLinked] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!owner) return;

    let cancelled = false;

    fetch(`/api/telegram?wallet=${encodeURIComponent(owner)}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled && data?.success) {
          setEnabled(Boolean(data.enabled));
          setLinked(Boolean(data.linked));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [owner]);

  // After the link is opened, check every few seconds until the bot confirms it.
  useEffect(() => {
    if (!waiting || !owner) return;

    const timer = setInterval(async () => {
      try {
        const data = await (await fetch(`/api/telegram?wallet=${encodeURIComponent(owner)}`, { cache: "no-store" })).json();

        if (data?.linked) {
          setLinked(true);
          setWaiting(false);
        }
      } catch {
        // Try again on the next tick.
      }
    }, 3000);

    const stop = setTimeout(() => setWaiting(false), 5 * 60_000);

    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
  }, [waiting, owner]);

  async function connect() {
    setBusy(true);
    setError("");

    try {
      const proof = await signAction(wallet, "telegram-link", ["link"]);

      const { url } = await postJson<{ url: string }>("/api/telegram", proof);

      window.open(url, "_blank", "noopener");

      setWaiting(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start Telegram.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError("");

    try {
      const proof = await signAction(wallet, "telegram-unlink", ["unlink"]);

      await postJson("/api/telegram", proof, "DELETE");

      setLinked(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not disconnect.");
    } finally {
      setBusy(false);
    }
  }

  if (!owner || !enabled) return null;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={busy}
        onClick={() => void (linked ? disconnect() : connect())}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:text-white disabled:opacity-60"
      >
        {busy || waiting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
        {linked ? "Telegram connected · Disconnect" : waiting ? "Waiting for Telegram…" : "Get alerts on Telegram"}
      </button>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
