const stats = [
  {
    title: "Shelby NFTs",
    value: 0,
  },
  {
    title: "Aptos NFTs",
    value: 0,
  },
  {
    title: "Collections",
    value: 0,
  },
];

export default function PortfolioStats() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
        >
          <p className="text-slate-400">
            {item.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {item.value}
          </h2>
        </div>
      ))}
    </div>
  );
}