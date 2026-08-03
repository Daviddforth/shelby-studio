"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletModal from "./WalletModal";

export default function ConnectWallet() {
  const {
    account,
    connected,
    connect,
    disconnect,
    wallets,
  } = useWallet();

  const [open, setOpen] = useState(false);

  async function handleWalletSelect(walletName: string) {
    if (connected) {
      setOpen(false);
      return;
    }

    try {
      await connect(walletName);
      setOpen(false);
    } catch (err: any) {
      const message = err?.message ?? "";

      if (
        message.includes("already connected") ||
        message.includes("rejected") ||
        message.includes("User has rejected")
      ) {
        return;
      }

      console.error(err);
    }
  }

  return (
    <>
      {!connected ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-blue-500 bg-blue-600 px-5 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white">
            {account?.address?.toString().slice(0, 6)}...
            {account?.address?.toString().slice(-4)}
          </div>

          <button
            onClick={() => disconnect()}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white transition-all hover:border-red-500 hover:text-red-400"
          >
            Disconnect
          </button>
        </div>
      )}

      <WalletModal
        open={open}
        onClose={() => setOpen(false)}
        wallets={wallets}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
}