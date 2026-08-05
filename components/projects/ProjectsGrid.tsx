"use client";

import type { Project } from "@/context/project/types";

import EmptyProjects from "./EmptyProjects";
import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  onCreateProject: () => void;
}

export default function ProjectsGrid({
  projects,
  onCreateProject,
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyProjects
        onCreateProject={onCreateProject}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}