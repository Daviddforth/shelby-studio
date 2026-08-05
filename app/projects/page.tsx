"use client";

import { useState } from "react";

import {
  FolderKanban,
  Wallet,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectsGrid from "@/components/projects/ProjectsGrid";
import NewProjectModal from "@/components/projects/NewProjectModal";

import { useProject } from "@/context/project/ProjectContext";
import { useWallet } from "@/context/WalletContext";

export default function ProjectsPage() {
  const {
    projects,
  } = useProject();

  const {
    walletConnected,
  } = useWallet();

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  function handleCreateProject() {
    /*
     * Projects belong to a wallet.
     * Never open the project creator
     * while disconnected.
     */
    if (!walletConnected) {
      return;
    }

    setCreateOpen(true);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <ProjectsHeader
          onCreateProject={
            handleCreateProject
          }
        />

        {!walletConnected ? (
          /*
           * Fresh disconnected state.
           *
           * No saved projects or previous
           * workspace data should be shown.
           */
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 p-8">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
                <Wallet
                  size={28}
                  className="text-blue-400"
                />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                Connect Your Wallet
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Connect your wallet to access your
                Shelby Studio projects and continue
                your workspace.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-500">
                <FolderKanban size={15} />

                Projects are wallet-specific
              </div>
            </div>
          </div>
        ) : (
          /*
           * Connected wallet workspace.
           *
           * ProjectContext already ensures
           * these projects belong only to
           * the connected wallet.
           */
          <ProjectsGrid
            projects={projects}
            onCreateProject={
              handleCreateProject
            }
          />
        )}

        {/* Create Project Modal */}
        {walletConnected && (
          <NewProjectModal
            open={createOpen}
            onClose={() =>
              setCreateOpen(false)
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
