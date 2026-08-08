"use client";

import { useMemo } from "react";

import type { Project } from "@/context/project/types";

import {
  buildProjectView,
} from "@/lib/project/projectView";

import ExplorerEmptyState from "./ExplorerEmptyState";
import PublishedProjectCard from "./PublishedProjectCard";

interface PublishedProjectsGridProps {
  projects: Project[];
  search: string;
  status: string;
  sort: string;
}

export default function PublishedProjectsGrid({
  projects,
  search,
  status,
  sort,
}: PublishedProjectsGridProps) {
  const projectViews = useMemo(
    () =>
      projects.map((project) =>
        buildProjectView(project)
      ),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    const filtered = projectViews.filter(
      (project) => {
        const matchesSearch =
          !query ||
          project.title
            .toLowerCase()
            .includes(query) ||
          project.description
            .toLowerCase()
            .includes(query) ||
          project.owner
            ?.toLowerCase()
            .includes(query);

        let matchesStatus = true;

        if (status === "published") {
          matchesStatus =
            project.published;
        }

        if (status === "complete") {
          matchesStatus =
            project.publicationComplete;
        }

        if (status === "in-progress") {
          matchesStatus =
            !project.publicationComplete;
        }

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

    return filtered.sort((a, b) => {
      if (sort === "name") {
        return a.title.localeCompare(
          b.title
        );
      }

      if (sort === "oldest") {
        return (
          getTimestamp(a) -
          getTimestamp(b)
        );
      }

      if (sort === "largest") {
        return (
          b.assetCount -
          a.assetCount
        );
      }

      if (sort === "smallest") {
        return (
          a.assetCount -
          b.assetCount
        );
      }

      return (
        getTimestamp(b) -
        getTimestamp(a)
      );
    });
  }, [
    projectViews,
    search,
    status,
    sort,
  ]);

  if (filteredProjects.length === 0) {
    return (
      <ExplorerEmptyState
        search={search}
        filtered={
          projects.length > 0
        }
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1
              ? "project"
              : "projects"}{" "}
            found
          </p>
        </div>

        <div className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-500">
          Wallet workspace
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map(
          (project) => (
            <PublishedProjectCard
              key={project.id}
              project={project}
            />
          )
        )}
      </div>
    </div>
  );
}

function getTimestamp(
  project: ReturnType<typeof buildProjectView>
) {
  if (project.publishedDate) {
    const timestamp = Date.parse(
      project.publishedDate
    );

    if (!Number.isNaN(timestamp)) {
      return timestamp;
    }
  }

  return 0;
}
