"use client";

import { useWallet } from "../context/WalletContext";
import { SHELBY_NETWORK } from "../config/shelby";

export default function ShelbyStatus() {
  const {
    walletConnected,
    isShelbyHolder,
    storageConnected,
  } = useWallet();

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="text-xl font-bold">
        Shelby Status
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Current Shelby environment
      </p>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span>Wallet</span>

          <span
            className={
              walletConnected
                ? "text-green-600 font-medium"
                : "text-red-500 font-medium"
            }
          >
            {walletConnected ? "Connected" : "Disconnected"}
          </span>
        </div>


        <div className="flex justify-between">
          <span>Network</span>

          <span className="text-green-600 font-medium">
            {SHELBY_NETWORK}
          </span>
        </div>


        <div className="flex justify-between">
          <span>Shelby NFT</span>

          <span
            className={
              isShelbyHolder
                ? "text-green-600 font-medium"
                : "text-orange-500 font-medium"
            }
          >
            {isShelbyHolder ? "Verified" : "Not Verified"}
          </span>
        </div>


        <div className="flex justify-between">
          <span>Storage</span>

          <span
            className={
              storageConnected
                ? "text-green-600 font-medium"
                : "text-gray-500 font-medium"
            }
          >
            {storageConnected ? "Connected" : "Not Connected"}
          </span>
        </div>

      </div>

    </div>
  );
}