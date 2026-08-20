"use client";

import { useState } from "react";

const examples = [
  {
    title: "List your assets",
    description:
      "Retrieve the assets currently available through Shelby Studio.",
    steps: [
      "Open the Developer workspace.",
      "Select List Assets in the API Playground.",
      "Run the request.",
      "Inspect the returned asset metadata.",
    ],
    code: `const response = await fetch("/api/shelby/assets");

const data = await response.json();

console.log(data.assets);`,
  },
  {
    title: "Inspect an asset",
    description:
      "Look up detailed metadata for a specific Shelby asset.",
    steps: [
      "Copy the asset blob name.",
      "Open Inspect Asset in the API Playground.",
      "Enter the blob name.",
      "Run the request and inspect the metadata.",
    ],
    code: `const blobName = "example/file.json";

const response = await fetch(
  \`/api/shelby/asset?blobName=\${encodeURIComponent(blobName)}\`
);

const data = await response.json();

console.log(data.asset);`,
  },
  {
    title: "Look up an object",
    description:
      "Perform a direct object metadata lookup on Shelby.",
    steps: [
      "Enter the blob name you want to inspect.",
      "Select Object Lookup.",
      "Run the request.",
      "Review the returned object metadata.",
    ],
    code: `const blobName = "example/file.json";

const response = await fetch(
  \`/api/shelby/object?blobName=\${encodeURIComponent(blobName)}\`
);

const data = await response.json();

console.log(data.asset);`,
  },
  {
    title: "Download an asset",
    description:
      "Retrieve the contents of an existing Shelby asset.",
    steps: [
      "Identify the asset blob name.",
      "Identify the asset owner.",
      "Request the download endpoint.",
      "Handle the returned file response.",
    ],
    code: `const blobName = "example/file.json";
const owner = "0x...";

const response = await fetch(
  \`/api/shelby/download?blobName=\${encodeURIComponent(blobName)}&owner=\${encodeURIComponent(owner)}\`
);

if (!response.ok) {
  throw new Error("Download failed");
}

const file = await response.blob();`,
  },
  {
    title: "Check storage locations",
    description:
      "Retrieve the Shelby storage locations exposed by the configured network.",
    steps: [
      "Open List Locations.",
      "Run the request.",
      "Inspect the returned locations.",
      "Use the available location information when building integrations.",
    ],
    code: `const response = await fetch(
  "/api/shelby/locations"
);

const data = await response.json();

console.log(data.locations);`,
  },
];

export default function Examples() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];

  async function copyCode() {
    await navigator.clipboard.writeText(example.code);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Examples
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Practical examples for working with Shelby through
          Shelby Studio.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr]">
        <div className="border-b border-slate-800 p-4 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Workflows
          </p>

          <div className="space-y-1">
            {examples.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setSelected(index)}
                className={`w-full rounded-xl px-3 py-3 text-left transition ${
                  selected === index
                    ? "bg-blue-500/10 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <span className="text-sm font-medium">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-white">
            {example.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            {example.description}
          </p>

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Steps
            </p>

            <ol className="mt-3 space-y-3">
              {example.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm text-slate-400"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
                    {index + 1}
                  </span>

                  <span className="pt-0.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[#020617]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-600">
                TypeScript
              </span>

              <button
                type="button"
                onClick={copyCode}
                className="text-xs font-medium text-slate-400 transition hover:text-white"
              >
                Copy
              </button>
            </div>

            <pre className="overflow-x-auto p-5 text-xs leading-6 text-slate-300">
              <code>{example.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
