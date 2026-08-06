"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import WalletModal from "./WalletModal";

export default function ConnectWallet() {
  const {
    account,
    connected,
    connect,
    disconnect,
    wallets,
    network,
  } = useWallet();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!connected) return;

    console.log(
      "SHELBY CONNECTED WALLET NETWORK:",
      {
        name: network?.name,
        chainId: network?.chainId,
      }
    );
  }, [connected, network]);

  /*
   * Temporary diagnostics.
   *
   * This tells us exactly which wallets the
   * Aptos wallet adapter has discovered and
   * what state each wallet is currently in.
   */
  useEffect(() => {
    console.log(
      "SHELBY DISCOVERED WALLETS:",
      wallets.map((wallet) => ({
        name: wallet.name,
        readyState: wallet.readyState,
        url: wallet.url,
      }))
    );
  }, [wallets]);

  async function handleWalletSelect(
    walletName: string
  ) {
    console.log(
      "SHELBY WALLET CLICKED:",
      walletName
    );

    const selectedWallet =
      wallets.find(
        (wallet) =>
          wallet.name === walletName
      );

    console.log(
      "SHELBY SELECTED WALLET:",
      selectedWallet
        ? {
            name: selectedWallet.name,
            readyState: selectedWallet.readyState,
          }
        : null
    );

    if (!selectedWallet) {
      console.error(
        "Wallet was displayed but could not be found in the Aptos adapter."
      );
      return;
    }

    if (connected) {
      console.log(
        "A wallet is already connected."
      );
      setOpen(false);
      return;
    }

    try {
      console.log(
        "SHELBY CONNECT START:",
        selectedWallet.name,
        selectedWallet.readyState
      );

      await connect(
        selectedWallet.name
      );

      console.log(
        "SHELBY CONNECT SUCCESS:",
        selectedWallet.name
      );

      setOpen(false);
    } catch (error) {
      console.error(
        "SHELBY CONNECT ERROR:",
        error
      );
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
            {account?.address
              ?.toString()
              .slice(0, 6)}
            ...
            {account?.address
              ?.toString()
              .slice(-4)}
          </div>

          <button
            onClick={() =>
              disconnect()
            }
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white transition-all hover:border-red-500 hover:text-red-400"
          >
            Disconnect
          </button>
        </div>
      )}

      <WalletModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        wallets={wallets}
        onSelectWallet={
          handleWalletSelect
        }
      />
    </>
  );
}
