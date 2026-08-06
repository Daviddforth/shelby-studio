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
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Network Status
      </h2>

      <p className="mt-2 text-slate-400">
        Shelby ecosystem connectivity
      </p>

      <div className="mt-8 space-y-5">
        <Status
          icon={<Wallet size={20} />}
          title="Wallet"
          value={
            walletConnected
              ? "Connected"
              : "Not Connected"
          }
          ok={walletConnected}
        />

        <Status
          icon={<Globe size={20} />}
          title="Network"
          value={network}
          ok={walletConnected}
        />

        <Status
          icon={<HardDrive size={20} />}
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
        <div className="mt-8 rounded-2xl bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Wallet Address
          </p>

          <p className="mt-2 break-all font-mono text-sm text-white">
            {walletAddress}
          </p>
        </div>
      )}
    </div>
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
    <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4">
      <div className="flex items-center gap-3">
        <div className="text-blue-400">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p className="font-semibold text-white">
            {value}
          </p>
        </div>
      </div>

      {neutral ? (
        <Circle className="text-slate-500" />
      ) : (
        <CheckCircle2
          className={
            ok
              ? "text-green-500"
              : "text-slate-600"
          }
        />
      )}
    </div>
  );
}
