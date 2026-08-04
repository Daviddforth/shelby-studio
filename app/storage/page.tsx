import DashboardLayout from "@/components/layout/DashboardLayout";
import StorageHeader from "@/components/storage/StorageHeader";
import StorageStats from "@/components/storage/StorageStats";
import UploadPanel from "@/components/storage/UploadPanel";
import RecentFiles from "@/components/storage/RecentFiles";

export default function StoragePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <p className="uppercase tracking-widest text-blue-400">
            Shelby Studio
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Storage Manager
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Manage files stored on <span className="font-semibold text-white">Shelbynet</span>,
            upload new assets, monitor storage usage, and track every file linked
            to your NFTs.
          </p>
        </div>

        <StorageHeader />

        <StorageStats />

        <UploadPanel />

        <RecentFiles />

      </div>
    </DashboardLayout>
  );
}