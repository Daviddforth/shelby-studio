"use client";

export default function DashboardStats() {
  const stats = [
    {
      title: "Shelby NFTs",
      value: "0",
    },
    {
      title: "Aptos NFTs",
      value: "0",
    },
    {
      title: "Collections",
      value: "0",
    },
    {
      title: "Storage Used",
      value: "0 MB",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >
          <p className="text-sm text-slate-400">
            {item.title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}