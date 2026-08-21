"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import QuickActions from "@/components/dashboard/QuickActions";
import NetworkStatus from "@/components/dashboard/NetworkStatus";
import StorageOverview from "@/components/dashboard/StorageOverview";
import StorageAnalytics from "@/components/dashboard/StorageAnalytics";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHero />

        <DashboardStats />

        <QuickActions />

        <div className="grid min-w-0 gap-5 xl:grid-cols-[1.5fr_1fr]">
          <StorageOverview />
          <NetworkStatus />
        </div>

        <StorageAnalytics />
      </div>
    </DashboardLayout>
  );
}
