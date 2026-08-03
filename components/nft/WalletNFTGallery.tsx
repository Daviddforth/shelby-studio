"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";

export default function WalletNFTGallery() {
  const { account, connected } = useWallet();

  if (!connected) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        <h2 className="text-2xl font-bold">
          My Shelby NFTs
        </h2>

        <p className="mt-4 text-gray-500">
          Connect your wallet to load your NFTs.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-8">

      <h2 className="text-2xl font-bold">
        My Shelby NFTs
      </h2>

      <p className="text-gray-500 mt-2">
        Wallet
      </p>

      <div className="mt-4 rounded-xl bg-blue-50 p-4 break-all">
        {account?.address.toString()}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {[1,2,3,4].map((item)=>(
          <div
            key={item}
            className="rounded-xl border p-4 hover:shadow-lg transition cursor-pointer"
          >
            <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-4xl">
              🖼️
            </div>

            <h3 className="mt-3 font-semibold">
              NFT #{item}
            </h3>

            <p className="text-sm text-gray-500">
              Placeholder
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}