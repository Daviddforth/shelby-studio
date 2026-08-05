"use client";

import { FolderKanban, CheckCircle2 } from "lucide-react";
import { useCollection } from "@/context/CollectionContext";
import { useWallet } from "@/context/WalletContext";

export default function CollectionHeader() {
  const { walletConnected } = useWallet();
  const { collection } = useCollection();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-6">
        <div className="rounded-full bg-blue-600 p-6">
          <FolderKanban
            size={60}
            className="text-white"
          />
        </div>

        <div className="flex-1">
          <p className="uppercase tracking-widest text-blue-400">
            SHELBY STUDIO
          </p>

          <h1 className="mt-1 text-5xl font-bold text-white">
            Collection Builder
          </h1>

          <p className="mt-2 text-slate-400">
            Build, organize and publish NFT collections on Shelby.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              Shelbynet
            </span>

            {walletConnected ? (
              <span className="flex items-center gap-2 rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white">
                <CheckCircle2 size={16} />
                Wallet Connected
              </span>
            ) : (
              <span className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300">
                Wallet Not Connected
              </span>
            )}

            <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
              {collection.name || "Untitled Collection"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}