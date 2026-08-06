"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentAssets from "@/components/dashboard/RecentAssets";
import NetworkStatus from "@/components/dashboard/NetworkStatus";
import StorageOverview from "@/components/dashboard/StorageOverview";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Main workspace overview */}
        <DashboardHero />

        {/* Live workspace statistics */}
        <DashboardStats />

        {/* Primary developer actions */}
        <QuickActions />

        {/* Storage + Network */}
        <div className="grid gap-8 xl:grid-cols-2">
          <StorageOverview />
          <NetworkStatus />
        </div>

        {/* Assets + Activity */}
        <div className="grid gap-8 xl:grid-cols-2">
          <RecentAssets />
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}
