import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/DashboardStats";
import QuickActions from "@/components/QuickActions";
import RecentActivity from "@/components/RecentActivity";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardStats />

        <QuickActions />

        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}