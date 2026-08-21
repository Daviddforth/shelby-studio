"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AssetTabs from "@/components/asset-manager/AssetTabs";

export default function AssetsPage() {
  return (
    <DashboardLayout>
      <div className="min-w-0 space-y-7">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
            Shelby Storage
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Assets
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Upload and manage your digital assets on Shelby.
          </p>
        </div>

        <AssetTabs />
      </div>
    </DashboardLayout>
  );
}
