"use client";

export default function StorageStats() {
  const stats = [
    {
      title: "Available Space",
      value: "100 GB",
    },
    {
      title: "Used",
      value: "0 MB",
    },
    {
      title: "Files",
      value: "0",
    },
    {
      title: "Uploads Today",
      value: "0",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">
            {stat.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
}