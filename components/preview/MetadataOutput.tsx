interface Props {
  metadata: string;
}

export default function MetadataOutput({ metadata }: Props) {
  if (!metadata) return null;

  function copy() {
    navigator.clipboard.writeText(metadata);
    alert("Copied!");
  }

  function download() {
    const blob = new Blob([metadata], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "metadata.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-blue-700">
          Metadata JSON
        </h2>

        <div className="space-x-3">

          <button
            onClick={copy}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Copy
          </button>

          <button
            onClick={download}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Download
          </button>

        </div>

      </div>

      <pre className="bg-slate-900 text-green-400 mt-6 p-5 rounded-lg overflow-auto text-sm">
        {metadata}
      </pre>

    </div>
  );
}