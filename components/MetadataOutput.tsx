"use client";

interface Props {
  metadata: string;
}

export default function MetadataOutput({ metadata }: Props) {
  if (!metadata) return null;

  function copyMetadata() {
    navigator.clipboard.writeText(metadata);
    alert("Metadata copied!");
  }

  function downloadMetadata() {
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
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold text-blue-700">
          Metadata JSON
        </h2>

        <div className="space-x-2">

          <button
            onClick={copyMetadata}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Copy
          </button>

          <button
            onClick={downloadMetadata}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
          >
            Download
          </button>

        </div>

      </div>

      <pre className="bg-slate-900 text-green-400 p-5 rounded-xl overflow-auto text-sm">
        {metadata}
      </pre>

    </div>
  );
}