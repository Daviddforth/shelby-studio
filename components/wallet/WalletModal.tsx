"use client";

import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  wallets: readonly AdapterWallet[];
  onSelectWallet: (walletName: string) => void | Promise<void>;
}

export default function WalletModal({
  open,
  onClose,
  wallets,
  onSelectWallet,
}: WalletModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-2xl font-bold">Connect Wallet</h2>

        <p className="mt-2 text-gray-500">
          Choose a wallet to continue.
        </p>

        <div className="mt-6 space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onSelectWallet(wallet.name)}
              className="flex w-full items-center justify-between rounded-xl border p-4 transition hover:bg-blue-50"
            >
              <span>{wallet.name}</span>

              <span className="font-semibold text-blue-600">
                Connect →
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gray-100 py-3 hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}