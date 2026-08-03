"use client";

import Link from "next/link";
import ConnectWallet from "./wallet/ConnectWallet";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <div>
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-700 cursor-pointer">
              Shelby NFT Metadata Manager
            </h1>
          </Link>

          <p className="text-sm text-gray-500">
            Professional NFT Creation Toolkit
          </p>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <button className="rounded-xl border px-4 py-2 hover:bg-gray-100 transition">
            Documentation
          </button>

          <ConnectWallet />

        </div>

      </div>
    </header>
  );
}