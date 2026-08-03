import DashboardLayout from "@/components/layout/DashboardLayout";
import StorageHeader from "@/components/storage/StorageHeader";
import StorageStats from "@/components/storage/StorageStats";
import UploadPanel from "@/components/storage/UploadPanel";
import RecentFiles from "@/components/storage/RecentFiles";

export default function StoragePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <StorageHeader />

        <StorageStats />

        <UploadPanel />

        <RecentFiles />

      </div>
    </DashboardLayout>
  );
}