"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";

import type { Project } from "./types";
import { defaultProject } from "./defaultProject";

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string | null;

  createProject: (
    name: string,
    description?: string
  ) => string;

  selectProject: (id: string) => void;

  updateProject: (
    updates: Partial<Project>
  ) => void;

  deleteProject: (id: string) => void;
}

const ProjectContext =
  createContext<ProjectContextType | null>(null);

function getWalletStorageKeys(
  walletAddress: string
) {
  const normalized =
    walletAddress.toLowerCase();

  return {
    projects:
      `shelby-studio-projects:${normalized}`,

    activeProject:
      `shelby-studio-active-project:${normalized}`,
  };
}

export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    connected,
    account,
  } = useAptosWallet();

  const walletAddress =
    connected
      ? account?.address?.toString() ?? null
      : null;

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [
    activeProjectId,
    setActiveProjectId,
  ] = useState<string | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  /*
   * Load projects only for the
   * currently connected wallet.
   *
   * When disconnected, the workspace
   * immediately becomes empty.
   */
  useEffect(() => {
    setHydrated(false);

    if (!walletAddress) {
      setProjects([]);
      setActiveProjectId(null);
      setHydrated(true);

      return;
    }

    const keys =
      getWalletStorageKeys(walletAddress);

    try {
      const savedProjects =
        localStorage.getItem(
          keys.projects
        );

      const savedActiveProject =
        localStorage.getItem(
          keys.activeProject
        );

      let restoredProjects: Project[] = [];

      if (savedProjects) {
        const parsed =
          JSON.parse(savedProjects);

        if (Array.isArray(parsed)) {
          restoredProjects =
            parsed as Project[];
        }
      }

      setProjects(restoredProjects);

      if (
        savedActiveProject &&
        restoredProjects.some(
          (project) =>
            project.id ===
            savedActiveProject
        )
      ) {
        setActiveProjectId(
          savedActiveProject
        );
      } else {
        setActiveProjectId(null);
      }
    } catch (error) {
      console.error(
        "Failed to restore wallet projects:",
        error
      );

      setProjects([]);
      setActiveProjectId(null);
    } finally {
      setHydrated(true);
    }
  }, [walletAddress]);

  /*
   * Save projects only under the
   * connected wallet address.
   */
  useEffect(() => {
    if (
      !hydrated ||
      !walletAddress
    ) {
      return;
    }

    const keys =
      getWalletStorageKeys(walletAddress);

    try {
      localStorage.setItem(
        keys.projects,
        JSON.stringify(projects)
      );
    } catch (error) {
      console.error(
        "Failed to save wallet projects:",
        error
      );
    }
  }, [
    projects,
    hydrated,
    walletAddress,
  ]);

  /*
   * Save the active project only
   * for the connected wallet.
   */
  useEffect(() => {
    if (
      !hydrated ||
      !walletAddress
    ) {
      return;
    }

    const keys =
      getWalletStorageKeys(walletAddress);

    try {
      if (activeProjectId) {
        localStorage.setItem(
          keys.activeProject,
          activeProjectId
        );
      } else {
        localStorage.removeItem(
          keys.activeProject
        );
      }
    } catch (error) {
      console.error(
        "Failed to save active project:",
        error
      );
    }
  }, [
    activeProjectId,
    hydrated,
    walletAddress,
  ]);

  /*
   * Clear stale active project IDs.
   */
  useEffect(() => {
    if (
      !hydrated ||
      !activeProjectId
    ) {
      return;
    }

    const exists =
      projects.some(
        (project) =>
          project.id ===
          activeProjectId
      );

    if (!exists) {
      setActiveProjectId(null);
    }
  }, [
    projects,
    activeProjectId,
    hydrated,
  ]);

  const createProject =
    useCallback(
      (
        name: string,
        description = ""
      ) => {
        /*
         * A wallet must be connected
         * before a project can be created.
         */
        if (!walletAddress) {
          return "";
        }

        const now =
          new Date().toISOString();

        const project: Project = {
          ...defaultProject,

          id: crypto.randomUUID(),

          name,

          description,

          createdAt: now,

          updatedAt: now,

          progress: {
            ...defaultProject.progress,
            wallet: true,
          },
        };

        setProjects((previous) => [
          ...previous,
          project,
        ]);

        setActiveProjectId(
          project.id
        );

        return project.id;
      },
      [walletAddress]
    );

  const selectProject =
    useCallback(
      (id: string) => {
        if (!walletAddress) {
          return;
        }

        const exists =
          projects.some(
            (project) =>
              project.id === id
          );

        if (!exists) {
          return;
        }

        setActiveProjectId(id);
      },
      [
        projects,
        walletAddress,
      ]
    );

  const getProject =
useCallback(
(id: string) => {
return (
projects.find(
(project) =>
project.id === id
) ?? null
);
},
[projects]
);

const updateProject =
    useCallback(
      (
        updates: Partial<Project>
      ) => {
        if (
          !walletAddress ||
          !activeProjectId
        ) {
          return;
        }

        setProjects((previous) =>
          previous.map((project) => {
            if (
              project.id !==
              activeProjectId
            ) {
              return project;
            }

            return {
              ...project,
              ...updates,

              id: project.id,

              updatedAt:
                new Date().toISOString(),
            };
          })
        );
      },
      [
        activeProjectId,
        walletAddress,
      ]
    );

  const updateProjectById =
useCallback(
(
id: string,
updates: Partial<Project>
) => {
if (!walletAddress) {
return;
}

setProjects((previous) =>
previous.map((project) => {
if (project.id !== id) {
return project;
}

return {
...project,
...updates,

id: project.id,

updatedAt:
new Date().toISOString(),
};
})
);
},
[walletAddress]
);

const deleteProject =
    useCallback(
      (id: string) => {
        if (!walletAddress) {
          return;
        }

        setProjects((previous) =>
          previous.filter(
            (project) =>
              project.id !== id
          )
        );

        if (
          activeProjectId === id
        ) {
          setActiveProjectId(null);
        }
      },
      [
        activeProjectId,
        walletAddress,
      ]
    );

  const activeProject =
    useMemo(
      () =>
        walletAddress
          ? projects.find(
              (project) =>
                project.id ===
                activeProjectId
            ) ?? null
          : null,
      [
        projects,
        activeProjectId,
        walletAddress,
      ]
    );

  const value =
    useMemo<ProjectContextType>(
      () => ({
        projects:
          walletAddress
            ? projects
            : [],

        activeProject:
          walletAddress
            ? activeProject
            : null,

        activeProjectId:
          walletAddress
            ? activeProjectId
            : null,

        createProject,
        selectProject,
        updateProject,
        deleteProject,
      }),
      [
        projects,
        activeProject,
        activeProjectId,
        walletAddress,
        createProject,
        selectProject,
        updateProject,
        deleteProject,
      ]
    );

  return (
    <ProjectContext.Provider
      value={value}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context =
    useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProject must be used inside ProjectProvider"
    );
  }

  return context;
}






