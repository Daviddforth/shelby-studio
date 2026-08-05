"use client";

import { useEffect, useState } from "react";
import { X, FolderPlus } from "lucide-react";

import { useProject } from "@/context/project/ProjectContext";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewProjectModal({
  open,
  onClose,
}: NewProjectModalProps) {
  const { createProject } = useProject();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function handleCreate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const projectName = name.trim();
    const projectDescription = description.trim();

    if (!projectName) {
      return;
    }

    createProject(
      projectName,
      projectDescription
    );

    setName("");
    setDescription("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close create project modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
              <FolderPlus
                size={22}
                className="text-blue-400"
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Create Project
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Start a new Shelby Studio workspace.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCreate}
          className="space-y-6 p-6"
        >
          <div>
            <label
              htmlFor="project-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Genesis Collection"
              autoFocus
              maxLength={80}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Give your project a recognizable name.
            </p>
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Description
              <span className="ml-2 text-slate-500">
                Optional
              </span>
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="A digital collection built on Shelby..."
              rows={4}
              maxLength={300}
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>
                Describe what you're building.
              </span>

              <span>
                {description.length}/300
              </span>
            </div>
          </div>

          {/* Network */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Network
            </label>

            <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
              <div>
                <p className="font-medium text-white">
                  Shelbynet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Development network
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Active
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FolderPlus size={18} />

              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}