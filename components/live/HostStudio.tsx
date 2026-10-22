"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Room, RoomEvent, Track } from "livekit-client";

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
import { useOrigin } from "@/components/media/useOrigin";

import { LIVE_TITLE_MAX, cleanText, liveWatchPath } from "@/lib/live/types";
import { signLiveRequest } from "@/lib/media/clientSign";

interface Props {
  owner: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signMessage: (input: any) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any;
}

type Phase = "idle" | "starting" | "live" | "ended";

export default function HostStudio({ owner, signMessage, account }: Props) {
  const origin = useOrigin();

  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [viewers, setViewers] = useState(0);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [copied, setCopied] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const tokenRef = useRef("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const watchUrl = `${origin}${liveWatchPath(owner)}`;

  const refreshPreview = useCallback(() => {
    const current = roomRef.current;
    const video = videoRef.current;

    if (!current || !video) return;

    const local = current.localParticipant;

    const screen = local.getTrackPublication(Track.Source.ScreenShare)?.track;
    const camera = local.getTrackPublication(Track.Source.Camera)?.track;

    const chosen = screen ?? camera;

    for (const track of [screen, camera]) {
      if (track && track !== chosen) track.detach(video);
    }

    if (chosen) chosen.attach(video);
    else video.srcObject = null;

    setCamOn(Boolean(camera && !camera.isMuted));
    setMicOn(local.isMicrophoneEnabled);
    setScreenOn(Boolean(screen));
  }, []);

  const leave = useCallback(() => {
    roomRef.current?.disconnect();
    roomRef.current = null;
    setRoom(null);
  }, []);

  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  async function goLive() {
    setError("");
    setNotice("");

    const cleanTitle = cleanText(title, LIVE_TITLE_MAX);

    if (!cleanTitle) {
      setError("Give your live a title first.");
      return;
    }

    setPhase("starting");

    let next: Room | null = null;

    try {
      const body = await signLiveRequest({
        signMessage,
        account,
        owner,
        title: cleanTitle,
      });

      const response = await fetch("/api/live/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not start the live.");
      }

      tokenRef.current = data.token;

      next = new Room({ adaptiveStream: true, dynacast: true });

      const updateViewers = () => setViewers(next?.remoteParticipants.size ?? 0);

      next.on(RoomEvent.ParticipantConnected, updateViewers);
      next.on(RoomEvent.ParticipantDisconnected, updateViewers);
      next.on(RoomEvent.LocalTrackPublished, refreshPreview);
      next.on(RoomEvent.LocalTrackUnpublished, refreshPreview);
      next.on(RoomEvent.TrackMuted, refreshPreview);
      next.on(RoomEvent.TrackUnmuted, refreshPreview);

      next.on(RoomEvent.Disconnected, () => {
        if (roomRef.current === next) {
          roomRef.current = null;
          setRoom(null);
          setPhase("ended");
        }
      });

      await next.connect(data.url, data.token);

      roomRef.current = next;
      setRoom(next);
      setPhase("live");
      updateViewers();

      const problems: string[] = [];

      try {
        await next.localParticipant.setCameraEnabled(true);
      } catch {
        problems.push("camera");
      }

      try {
        await next.localParticipant.setMicrophoneEnabled(true);
      } catch {
        problems.push("microphone");
      }

      refreshPreview();

      if (problems.length) {
        setNotice(
          `Could not use your ${problems.join(" and ")}. Allow access in your browser's address bar, or share your screen instead.`
        );
      }
    } catch (e) {
      next?.disconnect();
      roomRef.current = null;
      setRoom(null);
      setPhase("idle");
      setError(e instanceof Error ? e.message : "Could not start the live.");
    }
  }

  async function toggle(kind: "camera" | "mic" | "screen") {
    const local = roomRef.current?.localParticipant;

    if (!local) return;

    setNotice("");

    try {
      if (kind === "camera") {
        await local.setCameraEnabled(!local.isCameraEnabled);
      } else if (kind === "mic") {
        await local.setMicrophoneEnabled(!local.isMicrophoneEnabled);
      } else {
        await local.setScreenShareEnabled(!local.isScreenShareEnabled);
      }
    } catch {
      setNotice("Your browser blocked that. Check its permission prompt.");
    }

    refreshPreview();
  }

  async function endLive() {
    const token = tokenRef.current;

    try {
      await fetch("/api/live/end", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Disconnecting also takes the live offline within seconds.
    }

    leave();
    tokenRef.current = "";
    setPhase("ended");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(watchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setNotice("Copy failed. Select the link and copy it by hand.");
    }
  }

  if (phase === "idle" || phase === "starting" || phase === "ended") {
    return (
      <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
        {phase === "ended" && (
          <p className="mb-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
            Your live has ended. You can start a new one any time.
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
          onClick={goLive}
          disabled={phase === "starting"}
          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          <Radio size={16} />
          {phase === "starting" ? "Starting…" : "Go live"}
        </button>

        <p className="mt-3 text-xs leading-5 text-slate-500">
          Your wallet will ask you to sign a message. It is free and does not
          send a transaction. Your browser will then ask to use your camera and
          microphone.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-800 bg-black">
          <video
            ref={videoRef}
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

        {notice && <p className="text-sm text-amber-400">{notice}</p>}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggle("camera")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {camOn ? <Video size={15} /> : <VideoOff size={15} />}
            {camOn ? "Camera on" : "Camera off"}
          </button>

          <button
            type="button"
            onClick={() => toggle("mic")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {micOn ? <Mic size={15} /> : <MicOff size={15} />}
            {micOn ? "Mic on" : "Mic off"}
          </button>

          <button
            type="button"
            onClick={() => toggle("screen")}
            className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            <MonitorUp size={15} />
            {screenOn ? "Stop sharing" : "Share screen"}
          </button>

          <button
            type="button"
            onClick={endLive}
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
        </div>
      </div>

      {room && <LiveChat room={room} selfName="You" selfIsHost />}
    </div>
  );
}
