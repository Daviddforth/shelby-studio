interface Props {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition">

      <div className="flex items-center justify-between">

        <div>

          <h3 className="text-gray-500 text-sm uppercase tracking-wide">
            {title}
          </h3>

          <h2 className="text-4xl font-bold text-blue-700 mt-2">
            {value}
          </h2>

          <p className="text-gray-500 mt-3">
            {subtitle}
          </p>

        </div>

        <div className="text-5xl">
          {icon}
        </div>

      </div>

    </div>
  );
}