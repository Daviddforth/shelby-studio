interface Props {
  errors: string[];
}

export default function ValidationAlert({ errors }: Props) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-100 border border-red-300 rounded-xl p-5 mb-6">
      <h3 className="font-bold text-red-700 mb-2">
        Please fix the following:
      </h3>

      <ul className="list-disc pl-5 space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-red-700">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}