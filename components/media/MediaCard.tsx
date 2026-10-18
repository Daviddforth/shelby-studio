"use client";

import { Check, Code2, ExternalLink, Link2, Pencil, Trash2 } from "lucide-react";

import MediaThumb from "@/components/media/MediaThumb";

import type { MediaKind } from "@/lib/media/types";

interface Props {
  owner: string;
  blobName: string;
  kind: MediaKind;
  /** Shown as the heading: the creator's title or the file name. */
  title: string;
  /** File name, shown underneath when a custom title is set. */
  fileName: string | null;
  sizeLabel: string;
  /** This image is used as another file's cover. */
  isCover: boolean;
  coverBlob: string | null;
  pagePath: string;
  pageUrl: string;
  embedCode: string;
  copiedKey: string | null;
  onCopy: (key: string, value: string) => void;
  confirmingDelete: boolean;
  deleting: boolean;
  /** Another file is being deleted right now. */
  deleteLocked: boolean;
  onEdit: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export default function MediaCard({
  owner,
  blobName,
  kind,
  title,
  fileName,
  sizeLabel,
  isCover,
  coverBlob,
  pagePath,
  pageUrl,
  embedCode,
  copiedKey,
  onCopy,
  confirmingDelete,
  deleting,
  deleteLocked,
  onEdit,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
}: Props) {
  const linkKey = `link-${blobName}`;

  const embedKey = `embed-${blobName}`;

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <a
        href={pagePath}
        target="_blank"
        rel="noreferrer"
        className="block aspect-video overflow-hidden bg-slate-950"
      >
        <MediaThumb
          owner={owner}
          blobName={blobName}
          kind={kind}
          title={title}
          coverBlob={coverBlob}
        />
      </a>

      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>

          <p className="mt-1 text-xs text-slate-500">
            <span className="capitalize">{kind}</span> · {sizeLabel}
            {isCover ? " · Used as a cover" : ""}
          </p>

          {fileName && (
            <p className="mt-1 truncate text-xs text-slate-600">{fileName}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onCopy(linkKey, pageUrl)}
            className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            {copiedKey === linkKey ? <Check size={13} /> : <Link2 size={13} />}
            {copiedKey === linkKey ? "Copied" : "Link"}
          </button>

          <button
            type="button"
            onClick={() => onCopy(embedKey, embedCode)}
            className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800"
          >
            {copiedKey === embedKey ? <Check size={13} /> : <Code2 size={13} />}
            {copiedKey === embedKey ? "Copied" : "Embed"}
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

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={deleting}
            className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800 disabled:opacity-40"
          >
            <Pencil size={13} />
            Edit details
          </button>

          {confirmingDelete ? (
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={deleting}
                className="min-h-9 rounded-lg bg-red-600 text-xs font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Yes, delete"}
              </button>

              <button
                type="button"
                onClick={onCancelDelete}
                disabled={deleting}
                className="min-h-9 rounded-lg border border-slate-700 text-xs text-slate-200 transition hover:bg-slate-800 disabled:opacity-40"
              >
                Keep
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onAskDelete}
              disabled={deleting || deleteLocked}
              className="flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
            >
              <Trash2 size={13} />
              Delete
            </button>
          )}
        </div>

        {confirmingDelete && (
          <p className="text-xs text-slate-500">
            This removes the file from Shelby for good and asks your wallet to
            approve.
          </p>
        )}
      </div>
    </div>
  );
}
