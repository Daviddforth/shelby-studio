"use client";

import {
  CheckCircle2,
  PartyPopper,
} from "lucide-react";

interface PublishSuccessProps {
  projectName: string;
  onClose: () => void;
}

export default function PublishSuccess({
  projectName,
  onClose,
}: PublishSuccessProps) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
        <CheckCircle2
          size={34}
          className="text-emerald-400"
        />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        <PartyPopper
          size={20}
          className="text-emerald-400"
        />

        <h2 className="text-2xl font-bold text-white">
          Project Published
        </h2>
      </div>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        <span className="font-medium text-white">
          {projectName}
        </span>{" "}
        has completed the Shelby Studio publishing
        workflow.
      </p>

      <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left">
        <p className="text-xs leading-5 text-amber-200/80">
          This currently records the project as published
          inside Shelby Studio. On-chain publishing will be
          connected when the Shelby publishing APIs are
          integrated.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-7 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500"
      >
        Done
      </button>
    </div>
  );
}