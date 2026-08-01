"use client";

interface Props {
  amount: number;
  setAmount: (value: number) => void;
}

export default function CollectionGenerator({
  amount,
  setAmount,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-5">
        Collection Generator
      </h2>

      <label className="font-semibold block mb-2">
        Number of NFTs
      </label>

      <input
        type="number"
        min={1}
        max={1000}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full border border-blue-200 rounded-lg p-3"
      />

      <button
        className="mt-5 w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg"
      >
        Generate Collection
      </button>

      <p className="text-gray-500 text-sm mt-3">
        Bulk generation will be available in the next version.
      </p>

    </div>
  );
}