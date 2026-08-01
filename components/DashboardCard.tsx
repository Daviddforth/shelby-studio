import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export default function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {value}
          </h2>
        </div>

        <div className="text-4xl text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}