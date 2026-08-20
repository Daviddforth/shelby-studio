export default function DeveloperHeader() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white">
          Developer
        </h1>

        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
          ShelbyNet
        </span>
      </div>

      <p className="max-w-2xl text-sm leading-6 text-slate-400">
        Build, test, inspect, and integrate with Shelby
        directly from Shelby Studio.
      </p>
    </div>
  );
}
