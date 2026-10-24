"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Room, RoomEvent, Track } from "livekit-client";

import { PictureInPicture2, Users } from "lucide-react";

import { useWallet } from "@/context/WalletContext";

import { LIVE_TITLE_MAX, cleanText } from "@/lib/live/types";
import { signLiveRequest } from "@/lib/media/clientSign";

export type HostPhase = "idle" | "starting" | "live" | "ended";

interface LiveSession {
  phase: HostPhase;
  room: Room | null;
  code: string;
  title: string;
  error: string;
  notice: string;
  viewers: number;
  camOn: boolean;
  micOn: boolean;
  screenOn: boolean;
  goLive: (title: string) => Promise<void>;
  toggle: (kind: "camera" | "mic" | "screen") => Promise<void>;
  endLive: () => Promise<void>;
  /** Shows the host's own picture in a <video>. Pass null to detach. */
  attachPreview: (video: HTMLVideoElement | null) => void;
}

const Ctx = createContext<LiveSession | null>(null);

export function useLiveSession(): LiveSession {
  const value = useContext(Ctx);

  if (!value) throw new Error("useLiveSession must be used inside LiveSessionProvider");

  return value;
}

/**
 * Owns the host's live connection for the whole app, not for one page. The
 * camera, screen share and stream keep running while the creator moves
 * around the studio; only End live, closing the tab or reloading stops them.
 */
export function LiveSessionProvider({ children }: { children: ReactNode }) {
  const { walletAddress, account, signMessage } = useWallet();

  const pathname = usePathname();

  const [phase, setPhase] = useState<HostPhase>("idle");
  const [room, setRoom] = useState<Room | null>(null);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewers, setViewers] = useState(0);
  const [camOn, setCamOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [screenOn, setScreenOn] = useState(false);

  const roomRef = useRef<Room | null>(null);
  const tokenRef = useRef("");
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const startedBy = useRef("");

  const refreshPreview = useCallback(() => {
    const current = roomRef.current;

    if (!current) return;

    const local = current.localParticipant;

    const screen = local.getTrackPublication(Track.Source.ScreenShare)?.track;
    const camera = local.getTrackPublication(Track.Source.Camera)?.track;

    const video = previewRef.current;

    if (video) {
      const chosen = screen ?? camera;

      for (const track of [screen, camera]) {
        if (track && track !== chosen) track.detach(video);
      }

      if (chosen) chosen.attach(video);
      else video.srcObject = null;
    }

    setCamOn(Boolean(camera && !camera.isMuted));
    setMicOn(local.isMicrophoneEnabled);
    setScreenOn(Boolean(screen));
  }, []);

  const attachPreview = useCallback(
    (video: HTMLVideoElement | null) => {
      previewRef.current = video;

      if (video) refreshPreview();
    },
    [refreshPreview]
  );

  const goLive = useCallback(
    async (rawTitle: string) => {
      setError("");
      setNotice("");

      const cleanTitle = cleanText(rawTitle, LIVE_TITLE_MAX);

      if (!cleanTitle) {
        setError("Give your live a title first.");
        return;
      }

      if (!walletAddress || !account || !signMessage) {
        setError("Connect your wallet first.");
        return;
      }

      setPhase("starting");

      let next: Room | null = null;

      try {
        const body = await signLiveRequest({
          signMessage,
          account,
          owner: walletAddress,
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
        startedBy.current = walletAddress;
        setRoom(next);
        setCode(String(data.code));
        setTitle(cleanTitle);
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
    },
    [walletAddress, account, signMessage, refreshPreview]
  );

  const toggle = useCallback(
    async (kind: "camera" | "mic" | "screen") => {
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
    },
    [refreshPreview]
  );

  const endLive = useCallback(async () => {
    const token = tokenRef.current;

    try {
      await fetch("/api/live/end", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Disconnecting also takes the live offline within seconds.
    }

    roomRef.current?.disconnect();
    roomRef.current = null;
    tokenRef.current = "";
    setRoom(null);
    setViewers(0);
    setPhase("ended");
  }, []);

  // A different wallet must never inherit someone else's broadcast.
  useEffect(() => {
    if (roomRef.current && startedBy.current && walletAddress !== startedBy.current) {
      void endLive();
    }
  }, [walletAddress, endLive]);

  // Closing or reloading the tab stops the camera, so warn first.
  useEffect(() => {
    if (phase !== "live") return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", warn);

    return () => window.removeEventListener("beforeunload", warn);
  }, [phase]);

  useEffect(() => {
    return () => {
      roomRef.current?.disconnect();
    };
  }, []);

  // Lets the creator float the preview over other tabs and apps (where the browser supports it).
  const canPopOut = typeof document !== "undefined" && document.pictureInPictureEnabled === true;

  const popOut = useCallback(() => {
    previewRef.current?.requestPictureInPicture?.().catch(() => {
      setNotice("Your browser could not pop out the preview.");
    });
  }, []);

  const value = useMemo<LiveSession>(
    () => ({
      phase,
      room,
      code,
      title,
      error,
      notice,
      viewers,
      camOn,
      micOn,
      screenOn,
      goLive,
      toggle,
      endLive,
      attachPreview,
    }),
    [phase, room, code, title, error, notice, viewers, camOn, micOn, screenOn, goLive, toggle, endLive, attachPreview]
  );

  return (
    <Ctx.Provider value={value}>
      {children}

      {phase === "live" && pathname !== "/live" && (
        <div className="fixed bottom-3 right-3 z-50 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-red-500/50 bg-slate-950 shadow-2xl sm:w-64">
          <div className="relative aspect-video bg-black">
            <video
              ref={attachPreview}
              autoPlay
              muted
              playsInline
              className="h-full w-full object-contain"
            />

            {!camOn && !screenOn && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                Nothing is being shown
              </div>
            )}

            <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live
            </span>

            <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
              <Users size={10} />
              {viewers}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-2">
            <Link
              href="/live"
              className="flex-1 rounded-md border border-slate-700 px-2 py-1.5 text-center text-xs text-white transition hover:bg-slate-800"
            >
              Studio
            </Link>

            {canPopOut && (
              <button
                type="button"
                onClick={popOut}
                title="Float this preview over other tabs and apps"
                className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1.5 text-xs text-white transition hover:bg-slate-800"
              >
                <PictureInPicture2 size={12} />
                Pop out
              </button>
            )}

            <button
              type="button"
              onClick={() => void endLive()}
              className="rounded-md bg-red-600 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
            >
              End
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
