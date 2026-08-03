"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}