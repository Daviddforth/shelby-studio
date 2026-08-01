import DashboardCard from "./DashboardCard";

interface Props {
  nfts: number;
  attributes: number;
  collection: number;
}

export default function Dashboard({
  nfts,
  attributes,
  collection,
}: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <DashboardCard
        title="NFTs Created"
        value={nfts}
        subtitle="Status: Ready"
        icon="📦"
      />

      <DashboardCard
        title="Attributes"
        value={attributes}
        subtitle="Traits Added"
        icon="🏷️"
      />

      <DashboardCard
        title="Collection"
        value={collection}
        subtitle="Ready to Generate"
        icon="🗂️"
      />

    </div>
  );
}