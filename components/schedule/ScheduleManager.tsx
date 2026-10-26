"use client";

import { useCallback, useEffect, useState } from "react";

import { CalendarClock, Loader2, Trash2 } from "lucide-react";

import Countdown from "@/components/schedule/Countdown";

import { useWallet } from "@/context/WalletContext";

import { postJson, signAction } from "@/lib/actionsClient";
import {
  SCHEDULE_TITLE_MAX,
  cleanSchedule,
  newScheduleId,
  scheduleFields,
  type ScheduledLive,
} from "@/lib/schedule/types";

function localInputValue(date: Date) {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return shifted.toISOString().slice(0, 16);
}

/** Plan a live ahead of time. Followers with alerts on are told right away. */
export default function ScheduleManager() {
  const wallet = useWallet();

  const owner = wallet.walletAddress;

  const [lives, setLives] = useState<ScheduledLive[]>([]);
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState(() => localInputValue(new Date(Date.now() + 24 * 3600_000)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!owner) return;

    try {
      const data = await (await fetch(`/api/schedule?owner=${encodeURIComponent(owner)}`, { cache: "no-store" })).json();

      if (data?.success) setLives(data.lives);
    } catch {
      // Optional.
    }
  }, [owner]);

  useEffect(() => {
    // Loads from the network, then sets state once the answer arrives.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function schedule() {
    setError("");

    const cleaned = cleanSchedule({ title, startsAt: new Date(when).toISOString() });

    if (!cleaned.ok) {
      setError(cleaned.error);
      return;
    }

    setBusy(true);

    try {
      const id = newScheduleId();

      const proof = await signAction(wallet, "schedule-live", scheduleFields(id, cleaned.title, cleaned.startsAt));

      await postJson("/api/schedule", { ...proof, id, title: cleaned.title, startsAt: cleaned.startsAt });

      setTitle("");

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not schedule the live.");
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id: string) {
    setError("");

    try {
      const proof = await signAction(wallet, "cancel-live", [id]);

      await postJson("/api/schedule", { ...proof, id }, "DELETE");

      setLives((list) => list.filter((live) => live.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel.");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
        <CalendarClock size={15} className="text-indigo-400" />
        Schedule a live
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        It appears on your page and on Discover with a countdown, and followers with alerts on are told now.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={SCHEDULE_TITLE_MAX}
          placeholder="What is it about?"
          className="min-w-0 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
        />

        <input
          type="datetime-local"
          value={when}
          onChange={(event) => setWhen(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400"
        />

        <button
          type="button"
          onClick={() => void schedule()}
          disabled={busy || !title.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {busy && <Loader2 size={13} className="animate-spin" />}
          Schedule
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

      {lives.length > 0 && (
        <ul className="mt-4 space-y-2">
          {lives.map((live) => (
            <li key={live.id} className="flex items-center gap-3 rounded-lg border border-slate-800 px-3 py-2 text-sm">
              <span className="w-24 shrink-0 text-xs font-semibold text-indigo-300">
                <Countdown startsAt={live.startsAt} />
              </span>

              <span className="min-w-0 flex-1 truncate text-slate-200">{live.title}</span>

              <button
                type="button"
                aria-label="Cancel this live"
                onClick={() => void cancel(live.id)}
                className="text-slate-500 transition hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
