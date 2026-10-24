"use client";

import { useState } from "react";

import Link from "next/link";

import { Download, Loader2, Save, Trash2 } from "lucide-react";

import { useLiveSession } from "@/context/LiveSessionContext";
import { useStorage } from "@/hooks/useStorage";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;

  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(ms: number) {
  const total = Math.round(ms / 1000);

  const minutes = Math.floor(total / 60);

  const seconds = total % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** After a live: save the recording to the creator's Shelby storage (wallet-signed, like any upload). */
export default function ReplaySaver() {
  const { replays, replayBusy, markReplaySaved, discardReplays } = useLiveSession();

  const { upload, progress } = useStorage();

  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  if (replays.length === 0 && !replayBusy) return null;

  async function save(id: string) {
    const part = replays.find((item) => item.id === id);

    if (!part || part.savedAs) return;

    setWorkingId(id);
    setError("");

    try {
      const file = new File([part.blob], part.fileName, { type: "video/webm" });

      const asset = await upload(file);

      markReplaySaved(id, asset.blobName || asset.name || part.fileName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the replay.");

      return false;
    } finally {
      setWorkingId("");
    }

    return true;
  }

  async function saveAll() {
    for (const part of replays) {
      if (part.savedAs) continue;

      const ok = await save(part.id);

      if (ok === false) break;
    }
  }

  function download(id: string) {
    const part = replays.find((item) => item.id === id);

    if (!part) return;

    const url = URL.createObjectURL(part.blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = part.fileName;
    link.click();

    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  const unsaved = replays.filter((item) => !item.savedAs).length;

  return (
    <div className="max-w-xl rounded-2xl border border-blue-500/30 bg-slate-900 p-5">
      <p className="text-sm font-semibold text-white">Save your replay to Shelby</p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Your live was recorded in this browser. Save it to your Shelby storage so it appears in your
        Library with a share link. Your wallet will ask you to approve the upload, like any other
        upload. If you close this tab first, the recording is lost.
      </p>

      {replayBusy && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-300">
          <Loader2 size={13} className="animate-spin" />
          Preparing your replay…
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {replays.map((part, index) => (
          <li
            key={part.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs"
          >
            <span className="min-w-0 flex-1 text-slate-300">
              Part {index + 1} · {formatDuration(part.durationMs)} · {formatBytes(part.blob.size)}
              {part.savedAs && <span className="ml-2 text-emerald-400">Saved</span>}
            </span>

            {!part.savedAs && (
              <>
                <button
                  type="button"
                  onClick={() => download(part.id)}
                  title="Download a copy to your computer"
                  className="rounded-md border border-slate-700 p-1.5 text-slate-300 hover:text-white"
                >
                  <Download size={13} />
                </button>

                <button
                  type="button"
                  disabled={Boolean(workingId)}
                  onClick={() => void save(part.id)}
                  className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                >
                  {workingId === part.id ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                  Save
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {workingId && progress && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded bg-slate-800">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            />
          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            {progress.phase === "preparing" ? "Preparing" : "Uploading"} · {Math.round(progress.percentage)}%
          </p>
        </div>
      )}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {unsaved > 1 && (
          <button
            type="button"
            disabled={Boolean(workingId)}
            onClick={() => void saveAll()}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            Save all {unsaved} parts
          </button>
        )}

        {replays.some((item) => item.savedAs) && (
          <Link href="/library" className="text-xs text-blue-400 hover:underline">
            View in Library →
          </Link>
        )}

        <button
          type="button"
          disabled={Boolean(workingId)}
          onClick={discardReplays}
          className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 disabled:opacity-50"
        >
          <Trash2 size={12} />
          {unsaved > 0 ? "Discard" : "Close"}
        </button>
      </div>
    </div>
  );
}
