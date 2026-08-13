"use client";

import {
  CheckCircle2,
  Circle,
  Globe,
  HardDrive,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useStorageContext } from "@/context/StorageContext";

export default function NetworkStatus() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const { assets } = useStorageContext();

  const storageActive =
    walletConnected && assets.length > 0;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div>
        <h2 className="text-base font-semibold text-white">
          Network
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Shelby ecosystem connectivity
        </p>
      </div>

      <div className="mt-5 divide-y divide-slate-800">
        <Status
          icon={<Wallet size={16} />}
          title="Wallet"
          value={
            walletConnected
              ? "Connected"
              : "Not Connected"
          }
          ok={walletConnected}
        />

        <Status
          icon={<Globe size={16} />}
          title="Network"
          value={network}
          ok={walletConnected}
        />

        <Status
          icon={<HardDrive size={16} />}
          title="Shelby Storage"
          value={
            storageActive
              ? "Active"
              : "No Assets Yet"
          }
          ok={storageActive}
          neutral={
            walletConnected &&
            !storageActive
          }
        />
      </div>

      {walletConnected && walletAddress && (
        <p className="mt-4 truncate font-mono text-xs text-slate-600">
          {walletAddress}
        </p>
      )}
    </section>
  );
}

function Status({
  icon,
  title,
  value,
  ok,
  neutral = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  ok: boolean;
  neutral?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-slate-500">
          {icon}
        </span>

        <span className="text-sm text-slate-400">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">
          {value}
        </span>

        {neutral ? (
          <Circle size={15} className="text-slate-600" />
        ) : (
          <CheckCircle2
            size={15}
            className={
              ok
                ? "text-emerald-500"
                : "text-slate-600"
            }
          />
        )}
      </div>
    </div>
  );
}
