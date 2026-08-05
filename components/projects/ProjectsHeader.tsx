"use client";

import {
  FolderKanban,
  Plus,
  Wallet,
} from "lucide-react";

import { useWallet } from "@/context/WalletContext";

interface ProjectsHeaderProps {
  onCreateProject: () => void;
}

export default function ProjectsHeader({
  onCreateProject,
}: ProjectsHeaderProps) {
  const {
    walletConnected,
  } = useWallet();

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <FolderKanban
              size={22}
              className="text-blue-400"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Projects
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              {walletConnected
                ? "Create and manage your Shelby Studio projects."
                : "Connect your wallet to access your Shelby Studio projects."}
            </p>
          </div>
        </div>
      </div>

      {/* Project Action */}
      {walletConnected ? (
        <button
          type="button"
          onClick={onCreateProject}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
        >
          <Plus size={18} />

          Create Project
        </button>
      ) : (
        <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 font-medium text-slate-400">
          <Wallet size={18} />

          Wallet Required
        </div>
      )}
    </div>
  );
}
