interface Props {
  image: string;
  name: string;
  description: string;
}

export default function NFTPreview({
  image,
  name,
  description,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        NFT Preview
      </h2>

      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover rounded"
        />
      ) : (
        <div className="w-full h-64 rounded bg-gray-200 flex items-center justify-center">
          No Image
        </div>
      )}

      <h3 className="text-lg font-semibold mt-4">
        {name || "NFT Name"}
      </h3>

      <p className="text-gray-600">
        {description || "NFT Description"}
      </p>
    </div>
  );
}