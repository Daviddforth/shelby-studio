interface Attribute {
  trait_type: string;
  value: string;
}

interface NFTReadinessScoreProps {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export default function NFTReadinessScore({
  name,
  description,
  image,
  attributes,
}: NFTReadinessScoreProps) {
  let score = 0;

  if (name.trim()) score += 25;
  if (description.trim()) score += 25;
  if (image.trim()) score += 25;
  if (attributes.length > 0) score += 25;

  const status =
    score === 100
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 50
      ? "Fair"
      : "Needs Work";

  const color =
    score >= 75
      ? "text-green-600"
      : score >= 50
      ? "text-blue-600"
      : score >= 25
      ? "text-orange-500"
      : "text-red-500";

  const progressColor =
    score >= 75
      ? "bg-green-500"
      : score >= 50
      ? "bg-blue-500"
      : score >= 25
      ? "bg-orange-500"
      : "bg-red-500";

  const suggestions: string[] = [];

  if (!name.trim()) suggestions.push("Add a clear NFT name");
  if (!description.trim()) suggestions.push("Write a detailed description");
  if (!image.trim()) suggestions.push("Upload an NFT image");
  if (attributes.length === 0)
    suggestions.push("Add at least one attribute");
  if (score === 100)
    suggestions.push("Ready to upload to Shelby Storage 🚀");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">NFT Readiness</h2>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${color} bg-gray-100`}
        >
          {status}
        </span>
      </div>

      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className={`font-bold ${color}`}>{score}%</span>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full ${progressColor} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div>{name ? "✅ Name added" : "❌ Missing name"}</div>
        <div>
          {description
            ? "✅ Description added"
            : "❌ Missing description"}
        </div>
        <div>{image ? "✅ Image uploaded" : "❌ No image uploaded"}</div>
        <div>
          {attributes.length
            ? `✅ ${attributes.length} attribute(s)`
            : "❌ No attributes"}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 font-semibold">Suggestions</h3>

        <ul className="space-y-2 text-sm text-gray-600">
          {suggestions.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}