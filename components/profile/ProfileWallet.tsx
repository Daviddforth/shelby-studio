"use client";

import {
  Wallet,
  Globe,
  ShieldCheck,
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

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Profile Information
      </h2>

      <div className="space-y-6">
        <Info
          icon={
            <Wallet
              className={
                walletConnected
                  ? "text-emerald-400"
                  : "text-slate-500"
              }
              size={20}
            />
          }
          label="Wallet Address"
          value={displayAddress}
          mono={walletConnected}
        />

        <Info
          icon={
            <Globe
              className="text-green-400"
              size={20}
            />
          }
          label="Network"
          value={network}
        />

        <Info
          icon={
            <ShieldCheck
              className="text-purple-400"
              size={20}
            />
          }
          label="Shelby UID"
          value="Not Assigned"
        />
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-center gap-4">
        {icon}

        <div>
          <p className="text-sm text-slate-400">
            {label}
          </p>

          <p
            className={`font-semibold text-white ${
              mono ? "font-mono" : ""
            }`}
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function shortenAddress(
  address: string
) {
  if (address.length <= 16) {
    return address;
  }

  return `${address.slice(
    0,
    8
  )}...${address.slice(-6)}`;
}
