"use client";

import ConnectWallet from "../wallet/ConnectWallet";

export default function Topbar() {
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">
      <div>
        <h2 className="text-3xl font-bold">
          {greeting} 👋
        </h2>

        <p className="text-gray-500">
          Welcome to Shelby Studio
        </p>
      </div>

      <ConnectWallet />
    </header>
  );
}