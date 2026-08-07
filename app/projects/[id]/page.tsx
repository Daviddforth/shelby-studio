"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";

import ProjectDashboardHeader from "@/components/projects/dashboard/ProjectDashboardHeader";
import ProjectOverview from "@/components/projects/dashboard/ProjectOverview";
import ProjectStats from "@/components/projects/dashboard/ProjectStats";
import ProjectActions from "@/components/projects/dashboard/ProjectActions";
import ProjectReadiness from "@/components/projects/dashboard/ProjectReadiness";
import { buildProjectView } from "@/lib/project/projectView";

import { useProject } from "@/context/project/ProjectContext";
import { useWallet } from "@/context/WalletContext";

export default function ProjectDashboardPage() {
  const params = useParams();

  const {
    projects,
    activeProject,
    selectProject,
  } = useProject();

  const {
    walletConnected,
  } = useWallet();

  /*
   * Get project ID from:
   *
   * /projects/[id]
   */
  const projectId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  /*
   * Find the project belonging
   * to the current route.
   */
  const project = projects.find(
    (item) => item.id === projectId
  );

const projectView =
  project
    ? buildProjectView(project)
    : null;

  /*
   * Keep the route project synchronized
   * with the active project.
   */
  useEffect(() => {
    if (
      walletConnected &&
      project &&
      activeProject?.id !== project.id
    ) {
      selectProject(project.id);
    }
  }, [
    walletConnected,
    project,
    activeProject?.id,
    selectProject,
  ]);

  /*
   * Never expose a previous project
   * while the wallet is disconnected.
   */
  if (!walletConnected) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl">
              ðŸ”
            </div>

            <h1 className="mt-6 text-2xl font-bold text-white">
              Connect Your Wallet
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Connect your wallet to access this
              Shelby Studio project.
            </p>

            <Link
              href="/projects"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * Connected, but this project does
   * not belong to the current wallet.
   */
  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-2xl">
              ðŸ“
            </div>

            <h1 className="mt-6 text-2xl font-bold text-white">
              Project Not Found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This project does not exist or does
              not belong to the connected wallet.
            </p>

            <Link
              href="/projects"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Project Header */}
<ProjectDashboardHeader
  project={project}
/>

{/* Project Overview */}
<ProjectOverview
  project={project}
/>

{/* Project Statistics */}
<ProjectStats
  project={project}
/>

{/* Project Workspace */}
<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
  <ProjectActions />

  <ProjectReadiness
    project={project}
  />
</div>
      </div>
    </DashboardLayout>
  );
}




