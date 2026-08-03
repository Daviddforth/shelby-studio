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
    try {
      await connect(walletName);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      {!connected ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="rounded-xl border bg-white px-4 py-2">
            {account?.address.toString().slice(0, 6)}...
            {account?.address.toString().slice(-4)}
          </div>

          <button
            onClick={disconnect}
            className="rounded-xl border px-4 py-2 hover:bg-red-50"
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