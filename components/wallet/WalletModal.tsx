"use client";

import { AdapterWallet } from "@aptos-labs/wallet-adapter-core";
import { createPortal } from "react-dom";

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
  "OneKey",
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

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
      >
        <h2 className="text-2xl font-bold text-white">
          Connect Wallet
        </h2>

        <p className="mt-2 text-slate-400">
          Choose an Aptos wallet to continue using Shelby Studio.
        </p>

        <div className="mt-8 space-y-3 max-h-[420px] overflow-y-auto">
          {supportedWallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => onSelectWallet(wallet.name)}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4 transition hover:border-blue-500 hover:bg-slate-800"
            >
              <div className="flex items-center gap-4">
                {wallet.icon && (
                  <img
                    src={wallet.icon}
                    alt={wallet.name}
                    className="h-10 w-10 rounded-full"
                  />
                )}

                <div className="text-left">
                  <p className="font-semibold text-white">
                    {wallet.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    Aptos Wallet
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                Connect
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}