"use client";

import {
  CheckCircle2,
  Clock3,
  History,
  RefreshCw,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useWallet } from "@/context/WalletContext";

type HistoryAction =
  | "upload"
  | "replace"
  | "delete";

interface AssetHistoryItem {
  id: string;
  action: HistoryAction;
  assetName: string;
  assetUid?: string;
  blobName?: string;
  transactionHash?: string;
  timestamp: string;
}

const HISTORY_PREFIX =
  "shelby-studio-asset-history:";

const MAX_HISTORY_ITEMS = 100;

export default function AssetHistory() {
  const {
    walletAddress,
    walletConnected,
  } = useWallet();

  const [history, setHistory] =
    useState<AssetHistoryItem[]>([]);

  const [clearing, setClearing] =
    useState(false);

  useEffect(() => {
    if (
      !walletConnected ||
      !walletAddress
    ) {
      setHistory([]);
      return;
    }

    try {
      const storageKey =
        `${HISTORY_PREFIX}${walletAddress}`;

      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        setHistory([]);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        setHistory([]);
        return;
      }

      setHistory(
        parsed.filter(
          (item): item is AssetHistoryItem =>
            Boolean(
              item &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.action === "string" &&
              typeof item.assetName === "string" &&
              typeof item.timestamp === "string"
            )
        )
      );
    } catch (error) {
      console.error(
        "Failed to load asset history:",
        error
      );

      setHistory([]);
    }
  }, [
    walletAddress,
    walletConnected,
  ]);

  function clearHistory() {
    if (
      !walletAddress ||
      history.length === 0
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all local asset history for this wallet? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      localStorage.removeItem(
        `${HISTORY_PREFIX}${walletAddress}`
      );

      setHistory([]);
    } catch (error) {
      console.error(
        "Failed to clear asset history:",
        error
      );

      alert(
        "Failed to clear asset history."
      );
    } finally {
      setClearing(false);
    }
  }

  if (
    !walletConnected ||
    !walletAddress
  ) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <History
          size={24}
          className="mx-auto text-slate-600"
        />

        <p className="mt-3 text-sm font-medium text-white">
          Connect your wallet
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Connect your Aptos wallet to view
          asset activity history.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">
        <History
          size={24}
          className="mx-auto text-slate-600"
        />

        <p className="mt-3 text-sm font-medium text-white">
          No asset history yet
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Upload, replace, or delete an asset
          and the activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History
              size={18}
              className="text-blue-400"
            />

            <h2 className="text-lg font-semibold text-white">
              Asset History
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Local activity history for this wallet.
          </p>
        </div>

        <button
          type="button"
          onClick={clearHistory}
          disabled={clearing}
          className="flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={14} />

          {clearing
            ? "Clearing..."
            : "Clear History"}
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
          />
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <Clock3
          size={14}
          className="mt-0.5 shrink-0 text-slate-600"
        />

        <p className="text-[11px] leading-5 text-slate-600">
          Activity history is stored locally in
          your browser and is associated with
          the connected wallet. Clearing browser
          storage may remove this history.
        </p>
      </div>
    </div>
  );
}

function HistoryItem({
  item,
}: {
  item: AssetHistoryItem;
}) {
  const config =
    getActionConfig(item.action);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
      <div className="flex gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconBackground}`}
        >
          <config.Icon
            size={18}
            className={config.iconColor}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {config.title}
              </p>

              <p className="mt-1 break-all text-sm text-slate-300">
                {item.assetName}
              </p>
            </div>

            <span className="shrink-0 text-[11px] text-slate-600">
              {formatDate(item.timestamp)}
            </span>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {item.assetUid && (
              <HistoryValue
                label="UID"
                value={item.assetUid}
              />
            )}

            {item.blobName && (
              <HistoryValue
                label="Blob"
                value={item.blobName}
              />
            )}

            {item.transactionHash && (
              <HistoryValue
                label="Transaction"
                value={item.transactionHash}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-all font-mono text-[11px] text-slate-400">
        {value}
      </p>
    </div>
  );
}

function getActionConfig(
  action: HistoryAction
) {
  switch (action) {
    case "upload":
      return {
        title: "Asset uploaded",
        Icon: UploadCloud,
        iconBackground:
          "bg-blue-500/10",
        iconColor:
          "text-blue-400",
      };

    case "replace":
      return {
        title: "Asset replaced",
        Icon: RefreshCw,
        iconBackground:
          "bg-amber-500/10",
        iconColor:
          "text-amber-400",
      };

    case "delete":
      return {
        title: "Asset deleted",
        Icon: XCircle,
        iconBackground:
          "bg-red-500/10",
        iconColor:
          "text-red-400",
      };

    default:
      return {
        title: "Asset activity",
        Icon: CheckCircle2,
        iconBackground:
          "bg-emerald-500/10",
        iconColor:
          "text-emerald-400",
      };
  }
}

function formatDate(
  timestamp: string
) {
  try {
    return new Date(
      timestamp
    ).toLocaleString();
  } catch {
    return timestamp;
  }
}
