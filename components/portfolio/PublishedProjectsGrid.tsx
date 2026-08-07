"use client";

import { FolderOpen } from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";
import { isProjectPublished } from "@/lib/project/publication";

import PublishedProjectCard from "./PublishedProjectCard";

export default function PublishedProjectsGrid() {
  const { projects } = useProject();

  const published =
    projects.filter(isProjectPublished);

  if (published.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-20 text-center">
        <FolderOpen
          className="mx-auto text-slate-600"
          size={50}
        />

        <h2 className="mt-6 text-2xl font-bold text-white">
          No Published Projects
        </h2>

        <p className="mt-3 text-slate-400">
          Publish a Shelby project and it
          will automatically appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {published.map((project) => (
        <PublishedProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}