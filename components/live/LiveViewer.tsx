"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Room,
  RoomEvent,
  Track,
  type RemoteTrack,
} from "livekit-client";

import { Users, Volume2 } from "lucide-react";

import LiveChat from "@/components/live/LiveChat";

import {
  OFFLINE,
  VIEWER_NAME_MAX,
  cleanText,
  isHostIdentity,
  type LiveStatus,
} from "@/lib/live/types";

type Phase = "checking" | "offline" | "ready" | "joining" | "watching" | "ended";

export default function LiveViewer({ owner }: { owner: string }) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [status, setStatus] = useState<LiveStatus>(OFFLINE);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [chatName, setChatName] = useState("Guest");
  const [needsSound, setNeedsSound] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const phaseRef = useRef<Phase>("checking");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioHolder = useRef<HTMLDivElement>(null);
  const videoTracks = useRef(new Map<string, RemoteTrack>());

  const setPhaseBoth = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const showBestVideo = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    const screen = videoTracks.current.get(Track.Source.ScreenShare);
    const camera = videoTracks.current.get(Track.Source.Camera);
    const chosen = screen ?? camera;

    for (const track of videoTracks.current.values()) {
      if (track !== chosen) track.detach(video);
    }

    if (chosen) chosen.attach(video);

    setHasVideo(Boolean(chosen));
  }, []);

  const leave = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    videoTracks.current.clear();
    setRoom(null);
    setHasVideo(false);
    setNeedsSound(false);
  }, []);

  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  // Keep the status fresh: finds a live that starts later, and keeps the viewer count current.
  useEffect(() => {
    let stopped = false;

    async function check() {
      if (phaseRef.current === "joining") return;

      try {
        const response = await fetch(
          `/api/live/status?owner=${encodeURIComponent(owner)}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (stopped || !data.success) return;

        const next: LiveStatus = {
          live: Boolean(data.live),
          title: String(data.title ?? ""),
          viewers: Number(data.viewers) || 0,
        };

        setStatus(next);

        const current = phaseRef.current;

        if (current === "checking" || current === "offline" || current === "ended") {
          setPhaseBoth(next.live ? "ready" : current === "ended" ? "ended" : "offline");
        } else if (current === "ready" && !next.live) {
          setPhaseBoth("offline");
        }
      } catch {
        // Network hiccup: try again on the next tick.
      }
    }

    check();

    const timer = setInterval(check, 6000);

    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [owner, setPhaseBoth]);

  async function join() {
    setError("");
    setPhaseBoth("joining");

    const displayName = cleanText(name, VIEWER_NAME_MAX) || "Guest";

    let next: Room | null = null;

    try {
      const response = await fetch("/api/live/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, name: displayName }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not join the live.");
      }

      next = new Room({ adaptiveStream: true });

      next.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (!isHostIdentity(participant.identity)) return;

        if (track.kind === Track.Kind.Video) {
          videoTracks.current.set(publication.source, track);
          showBestVideo();
        } else if (track.kind === Track.Kind.Audio) {
          const el = track.attach();

          audioHolder.current?.appendChild(el);
        }
      });

      next.on(RoomEvent.TrackUnsubscribed, (track, publication) => {
        if (track.kind === Track.Kind.Video) {
          const video = videoRef.current;

          if (video) track.detach(video);

          videoTracks.current.delete(publication.source);
          showBestVideo();
        } else {
          track.detach().forEach((el) => el.remove());
        }
      });

      next.on(RoomEvent.AudioPlaybackStatusChanged, () => {
        setNeedsSound(!next?.canPlaybackAudio);
      });

      next.on(RoomEvent.ParticipantDisconnected, (participant) => {
        if (isHostIdentity(participant.identity)) {
          leave();
          setPhaseBoth("ended");
        }
      });

      next.on(RoomEvent.Disconnected, () => {
        if (roomRef.current === next) {
          leave();
          setPhaseBoth("ended");
        }
      });

      await next.connect(data.url, data.token);

      roomRef.current = next;
      setRoom(next);
      setChatName(data.name || displayName);
      setPhaseBoth("watching");

      // The click that joined counts as a user gesture, so sound should start.
      try {
        await next.startAudio();
      } catch {
        setNeedsSound(true);
      }
    } catch (e) {
      next?.disconnect();
      roomRef.current = null;
      setRoom(null);
      setError(e instanceof Error ? e.message : "Could not join the live.");
      setPhaseBoth("ready");
    }
  }

  const title = status.title || "Live stream";

  if (phase === "watching" && room) {
    return (
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-contain"
            />

            {!hasVideo && (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-400">
                Connected. Waiting for the host&apos;s video…
              </div>
            )}

            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>

            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
              <Users size={12} />
              {status.viewers}
            </span>

            {needsSound && (
              <button
                type="button"
                onClick={() => {
                  room.startAudio().then(() => setNeedsSound(false));
                }}
                className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
              >
                <Volume2 size={15} />
                Tap to enable sound
              </button>
            )}
          </div>

          <h1 className="break-words text-lg font-semibold text-white">{title}</h1>

          <div ref={audioHolder} className="hidden" />
        </div>

        <LiveChat room={room} selfName={chatName} selfIsHost={false} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
      {phase === "checking" && (
        <p className="text-sm text-slate-400">Checking if this creator is live…</p>
      )}

      {phase === "offline" && (
        <>
          <p className="text-lg font-semibold text-white">Not live right now</p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Keep this page open. It starts by itself as soon as the creator goes
            live.
          </p>
        </>
      )}

      {phase === "ended" && (
        <>
          <p className="text-lg font-semibold text-white">This live has ended</p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            If the creator comes back, you will be able to join again from here.
          </p>
        </>
      )}

      {(phase === "ready" || phase === "joining") && (
        <>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Live now
          </span>

          <p className="mt-3 break-words text-xl font-semibold text-white">{title}</p>

          <p className="mt-1 text-sm text-slate-400">
            {status.viewers} watching
          </p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={VIEWER_NAME_MAX}
            placeholder="Your name for chat (optional)"
            className="mt-5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          />

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={join}
            disabled={phase === "joining"}
            className="mt-4 min-h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {phase === "joining" ? "Joining…" : "Watch live"}
          </button>
        </>
      )}
    </div>
  );
}
