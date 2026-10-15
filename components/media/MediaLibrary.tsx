"use client";

import { useMemo, useState } from "react";

import {
  Check,
  Code2,
  ExternalLink,
  Link2,
  RefreshCw,
  UserCircle2,
} from "lucide-react";

import AssetUploader from "@/components/asset-manager/AssetUploader";
import MediaThumb from "@/components/media/MediaThumb";
import { useOrigin } from "@/components/media/useOrigin";

import { useWallet } from "@/context/WalletContext";
import { useStorage } from "@/hooks/useStorage";

import {
  buildEmbedCode,
  getFileName,
  getMediaType,
  mediaPagePath,
  type MediaKind,
} from "@/lib/media/types";

import type { UploadedAsset } from "@/lib/services/storage";

type Filter = "all" | MediaKind;

interface LibraryItem {
  asset: UploadedAsset;
  owner: string;
  blobName: string;
  kind: MediaKind;
}

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "image", label: "Images" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

const PHASE_LABELS: Record<string, string> = {
  preparing: "Preparing upload",
  commitments: "Preparing file",
  registering: "Registering on Shelby",
  uploading: "Uploading",
  committing: "Finishing up",
  complete: "Done",
};

export default function MediaLibrary() {
  const origin = useOrigin();

  const { walletAddress, walletConnected } = useWallet();

  const { assets, upload, loading, progress, refreshAssets } = useStorage();

  const [filter, setFilter] = useState<Filter>("all");

  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const items = useMemo<LibraryItem[]>(() => {
    const result: LibraryItem[] = [];

    for (const asset of assets) {
      if (asset.status !== "Stored") continue;

      const blobName = asset.blobName || asset.name;

      const media = getMediaType(blobName);

      const owner = asset.owner || walletAddress;

      if (!media || !owner) continue;

      result.push({ asset, owner, blobName, kind: media.kind });
    }

    return result;
  }, [assets, walletAddress]);

  const visible =
    filter === "all" ? items : items.filter((item) => item.kind === filter);

  function countFor(id: Filter) {
    return id === "all"
      ? items.length
      : items.filter((item) => item.kind === id).length;
  }

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(key);

      window.setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  async function handleSelect(file: File) {
    setMessage(null);

    if (!getMediaType(file.name)) {
      setMessage({
        type: "error",
        text: "Only video (mp4, webm, mov), audio (mp3, wav, m4a, ogg, flac) and image (jpg, png, gif, webp, avif) files can be hosted here.",
      });

      return;
    }

    try {
      await upload(file);

      setMessage({
        type: "success",
        text: `${file.name} is uploaded and ready to share.`,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed.",
      });
    }
  }

  async function handleRefresh() {
    setRefreshing(true);

    try {
      await refreshAssets();
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not refresh your media.",
      });
    } finally {
      setRefreshing(false);
    }
  }

  if (!walletConnected || !walletAddress) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
        <p className="text-sm font-semibold text-white">
          Connect your wallet to host media
        </p>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Your wallet address is your creator identity. Connect it with the
          wallet button at the top of the page to upload and share videos,
          audio and images.
        </p>
      </div>
    );
  }

  const creatorPath = `/c/${walletAddress}`;

  const creatorUrl = `${origin}${creatorPath}`;

  const uploading = loading && progress !== null && progress.phase !== "complete";

  return (
    <div className="min-w-0 space-y-8">
      {/* Creator page */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <UserCircle2 size={20} className="text-blue-400" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">
              Your public creator page
            </p>

            <p className="truncate font-mono text-xs text-slate-400">
              {creatorUrl}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => copy("creator", creatorUrl)}
            className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-700 px-3 text-sm text-slate-200 transition hover:bg-slate-800"
          >
            {copied === "creator" ? <Check size={15} /> : <Link2 size={15} />}
            {copied === "creator" ? "Copied" : "Copy link"}
          </button>

          <a
            href={creatorPath}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <ExternalLink size={15} />
            View page
          </a>
        </div>
      </div>

      {/* Upload */}
      <div className="space-y-3">
        <AssetUploader onSelect={handleSelect} disabled={loading} />

        {uploading && progress && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">
                {PHASE_LABELS[progress.phase] ?? "Working"}
              </span>

              <span className="text-slate-400">{progress.percentage}%</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${Math.min(progress.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}

        {message && (
          <p
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.type === "error"
                ? "border-red-500/20 bg-red-500/5 text-red-300"
                : "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      {/* Library */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === item.id
                    ? "border-blue-500 bg-blue-500/10 text-blue-300"
                    : "border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                {item.label} ({countFor(item.id)})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
            <p className="text-sm font-semibold text-white">
              {items.length === 0
                ? "No media yet"
                : "Nothing in this category yet"}
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {items.length === 0
                ? "Upload your first video, song or image above. Each file gets its own public page and embed code."
                : "Pick another filter or upload a new file."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => {
              const title = getFileName(item.blobName);

              const pagePath = mediaPagePath(item.owner, item.blobName);

              const pageUrl = `${origin}${pagePath}`;

              const embedCode = buildEmbedCode(
                origin,
                item.owner,
                item.blobName,
                item.kind
              );

              return (
                <div
                  key={item.asset.uid || item.blobName}
                  className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <a
                    href={pagePath}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-video overflow-hidden bg-slate-950"
                  >
                    <MediaThumb
                      owner={item.owner}
                      blobName={item.blobName}
                      kind={item.kind}
                      title={title}
                    />
                  </a>

                  <div className="space-y-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {title}
                      </p>

                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {item.kind} · {formatBytes(item.asset.size || 0)}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => copy(`link-${item.blobName}`, pageUrl)}
                        className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800"
                      >
                        {copied === `link-${item.blobName}` ? (
                          <Check size={13} />
                        ) : (
                          <Link2 size={13} />
                        )}
                        {copied === `link-${item.blobName}` ? "Copied" : "Link"}
                      </button>

                      <button
                        type="button"
                        onClick={() => copy(`embed-${item.blobName}`, embedCode)}
                        className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800"
                      >
                        {copied === `embed-${item.blobName}` ? (
                          <Check size={13} />
                        ) : (
                          <Code2 size={13} />
                        )}
                        {copied === `embed-${item.blobName}` ? "Copied" : "Embed"}
                      </button>

                      <a
                        href={pagePath}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-xs font-medium text-white transition hover:bg-blue-500"
                      >
                        <ExternalLink size={13} />
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
