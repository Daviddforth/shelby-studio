import { Clapperboard, ImageIcon, Music2 } from "lucide-react";

/** A mock of a public creator page. The data is an example, not a real creator. */
const tiles = [
  {
    title: "Studio session, take 2",
    kind: "Video",
    icon: Clapperboard,
    gradient: "from-blue-600/40 to-indigo-700/40",
  },
  {
    title: "Late night demo",
    kind: "Audio",
    icon: Music2,
    gradient: "from-indigo-600/40 to-violet-700/40",
  },
  {
    title: "Album cover",
    kind: "Image",
    icon: ImageIcon,
    gradient: "from-cyan-600/40 to-blue-700/40",
  },
];

export default function ProductPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-blue-950/20">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-5 py-1.5 font-mono text-[11px] text-slate-500">
            shelbystudio.xyz/c/0x26…e16a
          </div>

          <div className="w-12" />
        </div>

        <div className="bg-slate-950/60 p-5 sm:p-8">
          <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
            <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-red-600 px-2 py-1 text-xs font-bold uppercase text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Live now
            </span>

            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
              Launch day Q&amp;A
            </span>

            <span className="shrink-0 text-xs text-slate-300">Watch</span>
          </div>

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-400">
              Creator
            </p>

            <h3 className="mt-1 font-mono text-xl font-bold text-white">
              0x2659…e16a
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              1 video · 1 audio · 1 image, hosted on Shelby
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {tiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <div
                  key={tile.title}
                  className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900"
                >
                  <div
                    className={`flex aspect-video items-center justify-center bg-gradient-to-br ${tile.gradient}`}
                  >
                    <Icon size={30} className="text-white/80" />
                  </div>

                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-white">
                      {tile.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {tile.kind} · Stored on Shelby
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-600">
        An example of a public creator page.
      </p>
    </section>
  );
}
