import type { ProjectProgress as ProjectProgressType } from "@/context/project/types";

interface ProjectProgressProps {
  progress: ProjectProgressType;
  compact?: boolean;
}

export default function ProjectProgress({
  progress,
  compact = false,
}: ProjectProgressProps) {
  const steps = [
    {
      label: "Wallet",
      complete: progress.wallet,
    },
    {
      label: "Assets",
      complete: progress.assets,
    },
    {
      label: "Metadata",
      complete: progress.metadata,
    },
    {
      label: "Collection",
      complete: progress.collection,
    },
    {
      label: "Storage",
      complete: progress.storage,
    },
    {
      label: "Published",
      complete: progress.published,
    },
  ];

  const completed = steps.filter(
    (step) => step.complete
  ).length;

  const percentage = Math.round(
    (completed / steps.length) * 100
  );

  if (compact) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-400">
            Progress
          </span>

          <span className="font-medium text-white">
            {percentage}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">
          Project Progress
        </h3>

        <span className="text-sm font-medium text-blue-400">
          {percentage}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3"
          >
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                step.complete
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {step.complete ? "✓" : "○"}
            </div>

            <span
              className={
                step.complete
                  ? "text-sm text-slate-300"
                  : "text-sm text-slate-500"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}