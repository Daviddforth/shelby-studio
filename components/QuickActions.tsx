import Link from "next/link";

const actions = [
  {
    title: "Portfolio",
    href: "/portfolio",
  },
  {
    title: "Storage",
    href: "/storage",
  },
  {
    title: "Metadata",
    href: "/metadata",
  },
  {
    title: "Collections",
    href: "/collections",
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="rounded-xl border border-slate-700 p-5 transition hover:border-blue-500 hover:bg-slate-800"
          >
            {action.title}
          </Link>
        ))}
      </div>
    </div>
  );
}