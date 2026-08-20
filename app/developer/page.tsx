import DashboardLayout from "@/components/layout/DashboardLayout";
import DeveloperHeader from "@/components/developer/DeveloperHeader";
import APIPlayground from "@/components/developer/APIPlayground";
import SDKExplorer from "@/components/developer/SDKExplorer";
import CodeGenerator from "@/components/developer/CodeGenerator";
import Examples from "@/components/developer/Examples";

export default function DeveloperPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DeveloperHeader />

        <APIPlayground />
        <SDKExplorer />
        <CodeGenerator />
        <Examples />
      </div>
    </DashboardLayout>
  );
}
