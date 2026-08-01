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

      <h2 className="text-xl font-bold text-blue-700 mb-4">
        Collection Generator
      </h2>

      <input
        type="number"
        min={1}
        value={amount}
        onChange={(e) =>
          setAmount(Number(e.target.value))
        }
        className="w-full border p-3 rounded"
      />

    </div>
  );
}