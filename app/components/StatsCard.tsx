interface Props {
  title: string;
  value: number;
}

export default function StatsCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-bold text-blue-700 mt-3">
        {value}
      </h2>

    </div>
  );
}