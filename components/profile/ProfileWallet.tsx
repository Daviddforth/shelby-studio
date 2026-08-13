"use client";

import {
  Wallet,
  Globe,
  ShieldCheck,
  Copy,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

export default function ProfileWallet() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const displayAddress =
    walletConnected && walletAddress
      ? shortenAddress(walletAddress)
      : "Not Connected";

  async function copyAddress() {
    if (!walletAddress) return;

    try {
      await navigator.clipboard.writeText(
        walletAddress
      );
    } catch (error) {
      console.error(
        "Failed to copy wallet address:",
        error
      );
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
          <Wallet
            size={17}
            className="text-blue-400"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            Wallet
          </h2>

          <p className="text-xs text-slate-500">
            Your connected Aptos account.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Info
          icon={
            <Wallet
              className={
                walletConnected
                  ? "text-emerald-400"
                  : "text-slate-500"
              }
              size={17}
            />
          }
          label="Wallet Address"
          value={displayAddress}
          mono={walletConnected}
          action={
            walletConnected && walletAddress ? (
              <button
                type="button"
                onClick={copyAddress}
                className="text-slate-500 transition hover:text-blue-400"
                title="Copy wallet address"
              >
                <Copy size={14} />
              </button>
            ) : undefined
          }
        />

        <Info
          icon={
            <Globe
              className="text-emerald-400"
              size={17}
            />
          }
          label="Network"
          value={network}
        />

        <Info
          icon={
            <ShieldCheck
              className="text-purple-400"
              size={17}
            />
          }
          label="Storage"
          value="Shelby"
        />
      </div>
    </section>
  );
}

function Info({
  icon,
  label,
  value,
  mono = false,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon}

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-slate-600">
            {label}
          </p>

          <p
            className={`mt-0.5 truncate text-xs font-medium text-slate-200 ${
              mono ? "font-mono" : ""
            }`}
            title={value}
          >
            {value}
          </p>
        </div>
      </div>

      {action}
    </div>
  );
}

function shortenAddress(address: string) {
  if (address.length <= 16) {
    return address;
  }

  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}
