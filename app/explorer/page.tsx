import DashboardLayout from "@/components/layout/DashboardLayout";
import ExplorerHeader from "@/components/explorer/ExplorerHeader";
import SearchBar from "@/components/explorer/SearchBar";
import ExplorerFilters from "@/components/explorer/ExplorerFilters";
import AssetTable from "@/components/explorer/AssetTable";

export default function ExplorerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ExplorerHeader />

        <SearchBar />

        <ExplorerFilters />

        <AssetTable />
      </div>
    </DashboardLayout>
  );
}