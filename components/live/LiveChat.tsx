"use client";

import { useEffect, useRef, useState } from "react";

import { RoomEvent, type Room } from "livekit-client";

import { Ban, Send, ShieldAlert, VolumeX } from "lucide-react";

import { useLiveSession } from "@/context/LiveSessionContext";

import {
  CHAT_TOPIC,
  NOTICE_TOPIC,
  RELAY_TOPIC,
  type ChatLine,
} from "@/lib/live/chat";

import { CHAT_MESSAGE_MAX, cleanText, isHostIdentity } from "@/lib/live/types";

const MAX_LINES = 200;

function Panel({
  lines,
  draft,
  setDraft,
  onSend,
  error,
  moderation,
  renderLineActions,
}: {
  lines: ChatLine[];
  draft: string;
  setDraft: (value: string) => void;
  onSend: () => void;
  error: string;
  moderation?: React.ReactNode;
  renderLineActions?: (line: ChatLine) => React.ReactNode;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;

    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="flex h-full min-h-72 flex-col rounded-2xl border border-slate-800 bg-slate-900">
      <p className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
        Live chat
      </p>

      {moderation}

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
        {lines.length === 0 && <p className="text-slate-500">No messages yet. Say hi.</p>}

        {lines.map((line) => (
          <div key={line.id} className="group flex items-start gap-2">
            <p className="min-w-0 flex-1 break-words text-slate-300">
              <span
                className={
                  line.host
                    ? "mr-1.5 font-semibold text-blue-400"
                    : "mr-1.5 font-semibold text-slate-100"
                }
              >
                {line.name}
                {line.host ? " (host)" : ""}
              </span>
              {line.text}
            </p>

            {renderLineActions?.(line)}
          </div>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        className="border-t border-slate-800 p-3"
      >
        {error && <p className="mb-2 text-xs text-red-400">{error}</p>}

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={CHAT_MESSAGE_MAX}
            placeholder="Send a message"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-500"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

/** What a viewer sees. Messages only appear after the host has accepted and relayed them. */
function ViewerChat({ room }: { room: Room }) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const counter = useRef(0);
  const lastSent = useRef(0);

  useEffect(() => {
    function onData(
      payload: Uint8Array,
      participant?: { identity: string },
      _kind?: unknown,
      topic?: string
    ) {
      // Only the host may speak for the room: anything else is ignored.
      if (!participant || !isHostIdentity(participant.identity)) return;

      if (topic !== RELAY_TOPIC && topic !== NOTICE_TOPIC) return;

      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload));

        const text = cleanText(parsed?.text, CHAT_MESSAGE_MAX);

        if (!text) return;

        if (topic === NOTICE_TOPIC) {
          setError(text);
          return;
        }

        counter.current += 1;

        const id = counter.current;

        const host = parsed?.name === "Host" && !parsed?.from;

        setLines((current) =>
          [
            ...current,
            { id, name: cleanText(parsed?.name, 30) || "Guest", text, host, identity: "" },
          ].slice(-MAX_LINES)
        );
      } catch {
        // Ignore anything that is not a chat message.
      }
    }

    room.on(RoomEvent.DataReceived, onData);

    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room]);

  async function send() {
    const text = cleanText(draft, CHAT_MESSAGE_MAX);

    if (!text) return;

    if (Date.now() - lastSent.current < 800) {
      setError("Slow down a little.");
      return;
    }

    const host = Array.from(room.remoteParticipants.values()).find((p) => isHostIdentity(p.identity));

    if (!host) {
      setError("The host is not connected.");
      return;
    }

    lastSent.current = Date.now();

    setError("");

    try {
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({ text })),
        { reliable: true, topic: CHAT_TOPIC, destinationIdentities: [host.identity] }
      );

      setDraft("");
    } catch {
      setError("Message not sent. Check your connection.");
    }
  }

  return <Panel lines={lines} draft={draft} setDraft={setDraft} onSend={send} error={error} />;
}

/** What the host sees: every message with Mute / Remove buttons, and a word filter. */
function HostChat() {
  const session = useLiveSession();

  const { chatLines, mutedIdentities, blockedWordsText } = session;

  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [words, setWords] = useState(blockedWordsText);
  const [busy, setBusy] = useState("");

  async function send() {
    setError("");

    const ok = await session.sendHostChat(draft);

    if (ok) setDraft("");
    else if (draft.trim()) setError("Message not sent. Check your connection.");
  }

  async function remove(identity: string) {
    setBusy(identity);

    const ok = await session.removeViewer(identity, true);

    setBusy("");

    if (!ok) setError("Could not remove that viewer. Try again.");
  }

  const moderation = (
    <div className="border-b border-slate-800 px-4 py-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-slate-400 transition hover:text-white"
      >
        <ShieldAlert size={13} />
        Moderation
        {mutedIdentities.length > 0 && ` · ${mutedIdentities.length} muted`}
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          <label className="block text-slate-500" htmlFor="blocked-words">
            Blocked words, separated by commas. Messages with them are not shown.
          </label>

          <input
            id="blocked-words"
            value={words}
            onChange={(e) => setWords(e.target.value)}
            onBlur={() => session.setBlockedWordsText(words)}
            placeholder="spam, scam, badword"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-white outline-none focus:border-blue-500"
          />

          {mutedIdentities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {mutedIdentities.map((identity) => (
                <button
                  key={identity}
                  type="button"
                  onClick={() => session.unmuteViewer(identity)}
                  className="rounded-full border border-slate-700 px-2 py-0.5 text-slate-300 hover:text-white"
                >
                  Unmute {identity.slice(-4)}
                </button>
              ))}
            </div>
          )}

          <p className="text-slate-600">
            Remove also blocks that viewer&apos;s network from rejoining this live.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Panel
      lines={chatLines}
      draft={draft}
      setDraft={setDraft}
      onSend={send}
      error={error}
      moderation={moderation}
      renderLineActions={(line) =>
        line.identity ? (
          <span className="flex shrink-0 gap-1 opacity-60 transition group-hover:opacity-100">
            <button
              type="button"
              title="Mute this viewer"
              onClick={() => session.muteViewer(line.identity)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <VolumeX size={13} />
            </button>

            <button
              type="button"
              title="Remove and block this viewer"
              disabled={busy === line.identity}
              onClick={() => void remove(line.identity)}
              className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-red-400"
            >
              <Ban size={13} />
            </button>
          </span>
        ) : null
      }
    />
  );
}

export default function LiveChat({
  room,
  selfIsHost,
}: {
  room: Room;
  /** Kept for the callers that still pass a display name; it is not used. */
  selfName?: string;
  selfIsHost: boolean;
}) {
  return selfIsHost ? <HostChat /> : <ViewerChat room={room} />;
}
