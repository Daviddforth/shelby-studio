"use client";

import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
  wallets: readonly AdapterWallet[];
  onSelectWallet: (walletName: string) => void | Promise<void>;
}

const HIDDEN_WALLETS = [
  "Google",
  "Apple",
  "Continue with Google",
  "Continue with Apple",
  "Identity Connect",
  "Email",
];

export default function WalletModal({
  open,
  onClose,
  wallets,
  onSelectWallet,
}: WalletModalProps) {
  if (!open) return null;

  const supportedWallets = wallets.filter(
    (wallet) =>
      !HIDDEN_WALLETS.some((hidden) =>
        wallet.name.toLowerCase().includes(hidden.toLowerCase())
      )
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold">
          Connect Wallet
        </h2>

        <p className="mt-2 text-gray-500">
          Select an Aptos wallet compatible with Shelby.
        </p>

        <div className="mt-6 space-y-3">
          {supportedWallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onSelectWallet(wallet.name)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                {wallet.icon && (
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}

                <span className="font-medium">
                  {wallet.name}
                </span>
              </div>

              <span className="font-semibold text-blue-600">
                Connect
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-gray-100 py-3 transition hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}