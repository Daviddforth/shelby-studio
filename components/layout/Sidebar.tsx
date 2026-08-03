"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Portfolio",
    href: "/portfolio",
  },
  {
    name: "Storage",
    href: "/storage",
  },
  {
    name: "Metadata",
    href: "/metadata",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "Profile",
    href: "/profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">
          Shelby Studio
        </h1>

        <p className="text-sm text-gray-500">
          Shelby Workspace
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 text-xs text-gray-400">
        Shelby Studio v1.0
      </div>
    </aside>
  );
}