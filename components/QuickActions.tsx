"use client";

import Link from "next/link";

import {
  FolderKanban,
  FileJson,
  HardDrive,
  Images,
  LockKeyhole,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

const actions = [
  {
    title: "Portfolio",
    description:
      "View NFTs associated with your wallet.",
    href: "/portfolio",
    icon: Images,
  },
  {
    title: "Storage",
    description:
      "Upload and manage your digital assets.",
    href: "/storage",
    icon: HardDrive,
  },
  {
    title: "Metadata",
    description:
      "Create and validate NFT metadata.",
    href: "/metadata",
    icon: FileJson,
  },
  {
    title: "Collections",
    description:
      "Configure your NFT collections.",
    href: "/collections",
    icon: FolderKanban,
  },
];

export default function QuickActions() {
  const {
    walletConnected,
  } = useWallet();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {walletConnected
            ? "Continue working in your Shelby Studio workspace."
            : "Connect your wallet to access your workspace tools."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          if (!walletConnected) {
            return (
              <div
                key={action.title}
                className="cursor-not-allowed rounded-2xl border border-slate-800 bg-slate-950 p-5 opacity-60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Icon
                      size={22}
                      className="text-slate-500"
                    />

                    <h3 className="mt-4 font-semibold text-slate-300">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      {action.description}
                    </p>
                  </div>

                  <LockKeyhole
                    size={17}
                    className="text-slate-600"
                  />
                </div>
              </div>
            );
          }

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-blue-500/50 hover:bg-slate-900"
            >
              <Icon
                size={22}
                className="text-blue-400"
              />

              <h3 className="mt-4 font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
