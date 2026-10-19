"use client";

import { useEffect, useRef, useState } from "react";

import { RoomEvent, type Room } from "livekit-client";

import { Send } from "lucide-react";

import {
  CHAT_MESSAGE_MAX,
  cleanText,
  isHostIdentity,
} from "@/lib/live/types";

interface ChatLine {
  id: number;
  name: string;
  text: string;
  host: boolean;
}

const MAX_LINES = 200;

/** Chat over the LiveKit data channel. Names come from the signed token, never from the message. */
export default function LiveChat({
  room,
  selfName,
  selfIsHost,
}: {
  room: Room;
  selfName: string;
  selfIsHost: boolean;
}) {
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState("");

  const counter = useRef(0);
  const lastSent = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function add(line: Omit<ChatLine, "id">) {
      counter.current += 1;

      const id = counter.current;

      setLines((current) => [...current, { ...line, id }].slice(-MAX_LINES));
    }

    function onData(
      payload: Uint8Array,
      participant?: { identity: string; name?: string },
      _kind?: unknown,
      topic?: string
    ) {
      if (topic !== "chat" || !participant) return;

      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload));

        const text = cleanText(parsed?.text, CHAT_MESSAGE_MAX);

        if (!text) return;

        add({
          name: cleanText(participant.name, 30) || "Guest",
          text,
          host: isHostIdentity(participant.identity),
        });
      } catch {
        // Ignore anything that is not a chat message.
      }
    }

    room.on(RoomEvent.DataReceived, onData);

    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room]);

  useEffect(() => {
    const el = listRef.current;

    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  async function send(event: React.FormEvent) {
    event.preventDefault();

    const text = cleanText(draft, CHAT_MESSAGE_MAX);

    if (!text) return;

    if (Date.now() - lastSent.current < 800) {
      setSendError("Slow down a little.");
      return;
    }

    lastSent.current = Date.now();

    setSendError("");

    try {
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({ text })),
        { reliable: true, topic: "chat" }
      );

      counter.current += 1;

      const id = counter.current;

      setLines((current) =>
        [...current, { id, name: selfName, text, host: selfIsHost }].slice(
          -MAX_LINES
        )
      );

      setDraft("");
    } catch {
      setSendError("Message not sent. Check your connection.");
    }
  }

  return (
    <div className="flex h-full min-h-72 flex-col rounded-2xl border border-slate-800 bg-slate-900">
      <p className="border-b border-slate-800 px-4 py-3 text-sm font-semibold text-white">
        Live chat
      </p>

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-4 text-sm">
        {lines.length === 0 && (
          <p className="text-slate-500">No messages yet. Say hi.</p>
        )}

        {lines.map((line) => (
          <p key={line.id} className="break-words text-slate-300">
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
        ))}
      </div>

      <form onSubmit={send} className="border-t border-slate-800 p-3">
        {sendError && <p className="mb-2 text-xs text-red-400">{sendError}</p>}

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
