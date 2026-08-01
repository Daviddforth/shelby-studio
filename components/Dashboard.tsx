"use client";

import DashboardCard from "./DashboardCard";

import {
  FaCubes,
  FaTags,
  FaLayerGroup,
} from "react-icons/fa";

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
        icon={<FaCubes />}
      />

      <DashboardCard
        title="Attributes"
        value={attributes}
        icon={<FaTags />}
      />

      <DashboardCard
        title="Collection Size"
        value={collection}
        icon={<FaLayerGroup />}
      />

    </div>
  );
}