"use client";

import { useState } from "react";

import {
  Check,
  Link2,
  Mic,
  MicOff,
  MonitorUp,
  Radio,
  Users,
  Video,
  VideoOff,
} from "lucide-react";

import LiveChat from "@/components/live/LiveChat";
import ReplaySaver from "@/components/live/ReplaySaver";
import { useOrigin } from "@/components/media/useOrigin";

import { useLiveSession } from "@/context/LiveSessionContext";

import { LIVE_TITLE_MAX, liveWatchPath } from "@/lib/live/types";

/** Studio screen. The live itself runs in LiveSessionProvider, so leaving this page does not stop it. */
export default function HostStudio() {
  const origin = useOrigin();

  const session = useLiveSession();

  const { phase, room, code, error, notice, viewers, camOn, micOn, screenOn, attachPreview } = session;

  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const watchUrl = `${origin}${liveWatchPath(code)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(watchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Copy failed. Select the link and copy it by hand.");
    }
  }

  if (phase !== "live") {
    return (
      <div className="space-y-5">
        <ReplaySaver />

        <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
          {phase === "ended" && (
            <p className="mb-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
              Your live has ended. Each new live gets a new link.
            </p>
          )}

          <label className="text-sm font-medium text-white" htmlFor="live-title">
            What are you streaming?
          </label>

          <input
            id="live-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={LIVE_TITLE_MAX}
            placeholder="Building on Shelby, come hang out"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={() => void session.goLive(title)}
            disabled={phase === "starting"}
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            <Radio size={16} />
            {phase === "starting" ? "Starting…" : "Go live"}
          </button>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            Your wallet will ask you to sign a message. It is free and does not
            send a transaction. You get a private random link to share, and your
            wallet address is not in it. Once you are live you can move around
            the studio; the stream keeps running until you press End live.
          </p>

          {session.replaySupported ? (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Your live is recorded in this browser. When it ends you can save the replay to Shelby.
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-amber-500">
              Replays need Chrome, Edge or Firefox. Your live will still work in this browser.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black">
          <video
            ref={attachPreview}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-contain"
          />

          {!camOn && !screenOn && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
              Camera is off
            </div>
          )}

          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live
          </span>

          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
            <Users size={12} />
            {viewers}
          </span>
        </div>

        {(notice || copyError) && <p className="text-sm text-amber-400">{notice || copyError}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void session.toggle("camera")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {camOn ? <Video size={15} /> : <VideoOff size={15} />}
            {camOn ? "Camera on" : "Camera off"}
          </button>

          <button
            type="button"
            onClick={() => void session.toggle("mic")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {micOn ? <Mic size={15} /> : <MicOff size={15} />}
            {micOn ? "Mic on" : "Mic off"}
          </button>

          <button
            type="button"
            onClick={() => void session.toggle("screen")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <MonitorUp size={15} />
            {screenOn ? "Stop sharing" : "Share screen"}
          </button>

          <button
            type="button"
            onClick={() => void session.endLive()}
            className="ml-auto min-h-10 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            End live
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Send this link to people
          </p>

          <div className="mt-2 flex gap-2">
            <input
              readOnly
              value={watchUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200"
            />

            <button
              type="button"
              onClick={copyLink}
              className="flex min-h-10 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              {copied ? <Check size={15} /> : <Link2 size={15} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-500">
            This link is new for this live and stops working when you end it. You can open other
            pages while you are live; keep this browser tab open.
          </p>
        </div>
      </div>

      {room && <LiveChat room={room} selfName="You" selfIsHost />}
    </div>
  );
}
