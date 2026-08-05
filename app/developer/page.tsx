import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DeveloperPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Developer
          </h1>

          <p className="mt-2 text-slate-400">
            Developer tools and integration resources for
            Shelby Studio.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            Coming Soon
          </span>

          <h2 className="mt-5 text-xl font-semibold text-white">
            Developer Workspace
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            API tools, SDK integrations, debugging utilities,
            and developer resources will be available here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}