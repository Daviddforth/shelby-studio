"use client";

import {
  CheckCircle2,
  Circle,
  Globe,
  HardDrive,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useWallet } from "@/context/WalletContext";

export default function NetworkStatus() {
  const {
    walletConnected,
    walletAddress,
    network,
  } = useWallet();

  const [storageAvailable, setStorageAvailable] =
    useState<boolean | null>(null);

  useEffect(() => {
    if (!walletConnected || !walletAddress) {
      setStorageAvailable(null);
      return;
    }

    let cancelled = false;
    const address = walletAddress;

    async function checkStorage() {
      try {
        const response = await fetch(
          `/api/shelby/assets?walletAddress=${encodeURIComponent(
            address
          )}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!cancelled) {
          setStorageAvailable(
            response.ok && result.success === true
          );
        }
      } catch {
        if (!cancelled) {
          setStorageAvailable(false);
        }
      }
    }

    void checkStorage();

    return () => {
      cancelled = true;
    };
  }, [walletConnected, walletAddress]);

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
              : "Demo Mode"
          }
          state={
            walletConnected
              ? "success"
              : "demo"
          }
        />

        <Status
          icon={<Globe size={16} />}
          title="Network"
          value={
            walletConnected
              ? network
              : network
          }
          state={
            walletConnected
              ? "success"
              : "demo"
          }
        />

        <Status
          icon={<HardDrive size={16} />}
          title="Shelby Storage"
          value={
            walletConnected
              ? storageAvailable === null
                ? "Checking"
                : storageAvailable
                  ? "Available"
                  : "Unavailable"
              : "Demo Data"
          }
          state={
            walletConnected
              ? storageAvailable === null
                ? "loading"
                : storageAvailable
                  ? "success"
                  : "error"
              : "demo"
          }
        />
      </div>

      {walletConnected && walletAddress ? (
        <p className="mt-4 truncate font-mono text-xs text-slate-600">
          {walletAddress}
        </p>
      ) : (
        <p className="mt-4 text-xs text-slate-600">
          Sample data is displayed until a wallet is connected.
        </p>
      )}
    </section>
  );
}

function Status({
  icon,
  title,
  value,
  state,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  state: "success" | "neutral" | "error" | "loading" | "demo";
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
        <span
          className={`text-sm font-medium ${
            state === "error"
              ? "text-red-400"
              : state === "demo"
                ? "text-blue-400"
                : "text-white"
          }`}
        >
          {value}
        </span>

        {state === "success" ? (
          <CheckCircle2
            size={15}
            className="text-emerald-500"
          />
        ) : state === "error" ? (
          <Circle
            size={15}
            className="text-red-500"
          />
        ) : state === "demo" ? (
          <Circle
            size={15}
            className="text-blue-500"
          />
        ) : (
          <Circle
            size={15}
            className="text-slate-600"
          />
        )}
      </div>
    </div>
  );
}
