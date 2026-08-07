"use client";

import {
  ExternalLink,
  HardDrive,
  Globe,
  User,
  FileJson,
  Hash,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function PublicationDetails({
  project,
}: Props) {
  const items = [
    {
      label: "Network",
      value: project.network ?? "Shelbynet",
      icon: Globe,
    },
    {
      label: "Owner",
      value: project.owner ?? "Unknown",
      icon: User,
    },
    {
      label: "Manifest",
      value: project.manifestBlob ?? "Not Available",
      icon: FileJson,
    },
    {
      label: "Storage URI",
      value: project.storageUri ?? "Not Available",
      icon: HardDrive,
    },
    {
      label: "Transaction",
      value: project.transactionHash ?? "Pending",
      icon: Hash,
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-xl font-semibold text-white">
        Publication Details
      </h2>

      <p className="mt-2 text-slate-400">
        Information generated after publishing.
      </p>

      <div className="mt-8 space-y-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-4"
            >
              <div className="rounded-xl bg-blue-500/10 p-3">
                <Icon
                  size={18}
                  className="text-blue-400"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-500">
                  {item.label}
                </p>

                <p className="mt-1 break-all font-medium text-white">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {project.explorerUrl && (
        <a
          href={project.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500"
        >
          Open Explorer

          <ExternalLink size={17} />
        </a>
      )}
    </section>
  );
}