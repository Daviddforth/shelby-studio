"use client";

import {
  Database,
  Globe,
  Link2,
  Shield,
} from "lucide-react";

import type { ProjectView } from "@/lib/project/projectView";

interface Props {
  project: ProjectView;
}

export default function StorageDetailsCard({
  project,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Shelby Storage
      </h2>

      <div className="mt-8 space-y-6">
        <Info
          icon={Globe}
          label="Network"
          value={project.network ?? "Unknown"}
        />

        <Info
          icon={Database}
          label="Storage URI"
          value={
            project.storageUri ??
            "Not Available"
          }
        />

        <Info
          icon={Link2}
          label="Transaction"
          value={
            project.transactionHash ??
            "Pending"
          }
        />

        <Info
          icon={Shield}
          label="Publication"
          value={
            project.publicationComplete
              ? "Complete"
              : "Incomplete"
          }
        />
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon
        className="mt-1 text-blue-400"
        size={20}
      />

      <div>
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="break-all font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
