export default function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/20">
        {/* Browser chrome */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-1.5 text-[11px] text-slate-500">
            app.shelbystudio.xyz
          </div>

          <div className="w-12" />
        </div>

        {/* Workspace */}
        <div className="grid min-h-[460px] lg:grid-cols-[190px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-slate-800 bg-slate-950 p-4 lg:block">
            <div className="mb-8 text-sm font-bold text-white">
              Shelby Studio
            </div>

            <div className="space-y-1 text-xs">
              <div className="rounded-lg bg-blue-500/10 px-3 py-2.5 text-blue-400">
                Dashboard
              </div>

              <div className="px-3 py-2.5 text-slate-500">
                Assets
              </div>

              <div className="px-3 py-2.5 text-slate-500">
                Collections
              </div>

              <div className="px-3 py-2.5 text-slate-500">
                Metadata
              </div>

              <div className="px-3 py-2.5 text-slate-500">
                Storage
              </div>

              <div className="px-3 py-2.5 text-slate-500">
                Explorer
              </div>
            </div>

            <div className="mt-10 border-t border-slate-800 pt-5">
              <p className="px-3 text-[10px] uppercase tracking-widest text-slate-600">
                Developer
              </p>

              <div className="mt-2 px-3 py-2.5 text-xs text-slate-500">
                API Playground
              </div>

              <div className="px-3 py-2.5 text-xs text-slate-500">
                SDK Explorer
              </div>
            </div>
          </aside>

          {/* Main dashboard preview */}
          <div className="bg-slate-950/60 p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Workspace
                </p>

                <h3 className="mt-1 text-xl font-bold text-white">
                  Project Overview
                </h3>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[11px] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Shelby connected
              </div>
            </div>

            {/* Stats */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Assets", "—", "Stored files"],
                ["Collections", "—", "Organized assets"],
                ["Metadata", "—", "Structured records"],
                ["Network", "Shelbynet", "Connected network"],
              ].map(([label, value, description]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
                >
                  <p className="text-xs text-slate-500">
                    {label}
                  </p>

                  <p className="mt-3 text-lg font-bold text-white">
                    {value}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent assets */}
            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Recent Assets
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage and inspect Shelby-backed files.
                  </p>
                </div>

                <span className="text-xs text-blue-400">
                  View all
                </span>
              </div>

              <div className="divide-y divide-slate-800">
                {[
                  ["collection-cover.png", "Image", "Stored"],
                  ["metadata.json", "JSON", "Stored"],
                  ["game-assets.zip", "Archive", "Stored"],
                ].map(([name, type, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-4 px-4 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs text-blue-400">
                        {type === "JSON" ? "{}" : "●"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white">
                          {name}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          {type} • Shelby-backed asset
                        </p>
                      </div>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-600">
        A preview of the Shelby Studio workspace.
      </p>
    </section>
  );
}
