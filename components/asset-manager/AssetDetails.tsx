"use client";

import {
  Copy,
  Check,
  X,
} from "lucide-react";

import { useState } from "react";

import type { UploadedAsset } from "@/lib/services/storage";

interface Props {
  asset: UploadedAsset;
  onClose: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(2)} GB`;
}

export default function AssetDetails({
  asset,
  onClose,
}: Props) {
  const [copied, setCopied] =
    useState<string | null>(null);

  async function copyValue(
    label: string,
    value: string
  ) {
    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopied(label);

      window.setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy value:",
        error
      );
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/60 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-semibold text-white">
            Asset Details
          </h4>

          <p className="mt-1 text-xs text-slate-500">
            Shelby storage object information
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          aria-label="Close asset details"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Detail
          label="File name"
          value={asset.name}
        />

        <Detail
          label="Size"
          value={formatBytes(asset.size)}
        />

        <Detail
          label="Status"
          value={asset.status}
        />

        <Detail
          label="Network"
          value={asset.network || "—"}
        />

        <Detail
          label="Owner"
          value={asset.owner || "—"}
          copyable
          copied={
            copied === "Owner"
          }
          onCopy={() =>
            copyValue(
              "Owner",
              asset.owner || "—"
            )
          }
        />

        <Detail
          label="UID"
          value={asset.uid || "—"}
          copyable
          copied={copied === "UID"}
          onCopy={() =>
            copyValue(
              "UID",
              asset.uid
            )
          }
        />

        <Detail
          label="Blob name"
          value={
            asset.blobName || "—"
          }
          copyable
          copied={
            copied === "Blob name"
          }
          onCopy={() =>
            copyValue(
              "Blob name",
              asset.blobName || ""
            )
          }
        />

        <Detail
          label="Uploaded"
          value={
            asset.uploadedAt
              ? new Date(
                  asset.uploadedAt
                ).toLocaleString()
              : "—"
          }
        />

        <Detail
          label="Encryption"
          value="Not reported"
        />
      </div>

      {(asset.registrationTransaction ||
        asset.commitTransaction) && (
        <div className="mt-5 border-t border-slate-800 pt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            Transactions
          </p>

          <div className="space-y-3">
            {asset.registrationTransaction && (
              <Transaction
                label="Registration"
                value={
                  asset.registrationTransaction
                }
                copied={
                  copied ===
                  "Registration"
                }
                onCopy={() =>
                  copyValue(
                    "Registration",
                    asset.registrationTransaction ||
                      ""
                  )
                }
              />
            )}

            {asset.commitTransaction && (
              <Transaction
                label="Commit"
                value={
                  asset.commitTransaction
                }
                copied={
                  copied === "Commit"
                }
                onCopy={() =>
                  copyValue(
                    "Commit",
                    asset.commitTransaction ||
                      ""
                  )
                }
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
  copyable = false,
  copied = false,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <div className="mt-1 flex min-w-0 items-center gap-2">
        <p className="min-w-0 flex-1 break-all text-sm text-slate-200">
          {value}
        </p>

        {copyable && onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check size={14} />
            ) : (
              <Copy size={14} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Transaction({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {label} transaction
        </p>

        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          {copied ? (
            <>
              <Check size={13} />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      <p className="mt-2 break-all font-mono text-xs text-slate-300">
        {value}
      </p>
    </div>
  );
}
