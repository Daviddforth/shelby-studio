"use client";

import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";
import { isProjectPublished } from "@/lib/project/publication";

import PublishedProjectCard from "./PublishedProjectCard";

export default function PublishedProjectsGrid() {
  const { projects } = useProject();

  const published = projects.filter(isProjectPublished);

  if (published.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900">
          <FolderOpen size={22} className="text-slate-500" />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          No published projects yet
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Projects you successfully publish through Shelby Studio
          will appear here automatically.
        </p>

        <Link
          href="/projects"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
        >
          Go to Projects
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {published.map((project) => (
        <PublishedProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}
