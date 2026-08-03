import DashboardLayout from "@/components/layout/DashboardLayout";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PortfolioHeader />
        <PortfolioGrid />
      </div>
    </DashboardLayout>
  );
}