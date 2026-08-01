import StatsCard from "./StatsCard";

interface Props {
  attributes: number;
  metadata: boolean;
}

export default function DashboardStats({
  attributes,
  metadata,
}: Props) {
  return (

    <div className="grid grid-cols-3 gap-6 mb-8">

      <StatsCard

        title="NFTs Created"

        value={metadata ? 1 : 0}

      />

      <StatsCard

        title="Attributes"

        value={attributes}

      />

      <StatsCard

        title="Metadata Generated"

        value={metadata ? 1 : 0}

      />

    </div>

  );
}