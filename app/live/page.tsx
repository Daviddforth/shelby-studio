"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import HostStudio from "@/components/live/HostStudio";

import { useWallet } from "@/context/WalletContext";

export default function GoLivePage() {
  const { walletAddress, walletConnected, account, signMessage } = useWallet();

  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Live
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Go live
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Start a live stream, send the link to anyone, and they can watch and
            chat with you right in their browser. No account needed for viewers.
          </p>
        </div>

        {!walletConnected || !walletAddress ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center">
            <p className="text-sm font-semibold text-white">
              Connect your wallet to go live
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Your wallet address is your live link, and only your wallet can
              broadcast on it.
            </p>
          </div>
        ) : (
          <HostStudio
            owner={walletAddress}
            signMessage={signMessage}
            account={account}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
