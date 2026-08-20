"use client";

import { useState } from "react";

type Operation = {
  name: string;
  sdk: string;
  method: "GET";
  endpoint: string;
  description: string;
  params: string[];
  runtime: "Node";
  status: "Implemented";
};

const operations: Operation[] = [
  {
    name: "List Assets",
    sdk: "coordination.getAccountBlobs()",
    method: "GET",
    endpoint: "/api/shelby/assets",
    description:
      "Lists Shelby blobs owned by the configured Shelby Studio account. The request is executed server-side using the Shelby Node SDK.",
    params: [],
    runtime: "Node",
    status: "Implemented",
  },
  {
    name: "Inspect Asset",
    sdk: "coordination.getFullObjectMetadata()",
    method: "GET",
    endpoint: "/api/shelby/asset",
    description:
      "Retrieves complete metadata for a specific Shelby blob, including ownership, size, creation and expiration information, encryption state, and slice address.",
    params: ["blobName"],
    runtime: "Node",
    status: "Implemented",
  },
  {
    name: "Object Lookup",
    sdk: "coordination.getFullObjectMetadata()",
    method: "GET",
    endpoint: "/api/shelby/object",
    description:
      "Performs a direct Shelby object metadata lookup without relying on the Explorer listing flow.",
    params: ["blobName"],
    runtime: "Node",
    status: "Implemented",
  },
  {
    name: "Download Asset",
    sdk: "client.download()",
    method: "GET",
    endpoint: "/api/shelby/download",
    description:
      "Downloads the contents of a Shelby blob and streams the resulting data back to the browser as a file.",
    params: ["blobName", "owner"],
    runtime: "Node",
    status: "Implemented",
  },
  {
    name: "List Locations",
    sdk: "metadata.getLocationNames()",
    method: "GET",
    endpoint: "/api/shelby/locations",
    description:
      "Retrieves the storage locations currently exposed by the configured Shelby network.",
    params: [],
    runtime: "Node",
    status: "Implemented",
  },
];

export default function SDKExplorer() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const operation = operations[selected];

  async function copyEndpoint() {
    try {
      await navigator.clipboard.writeText(
        operation.endpoint
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              SDK Explorer
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Explore the Shelby SDK operations currently
              implemented behind Shelby Studio&apos;s developer API.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            {operations.length} operations
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr]">
        <div className="border-b border-slate-800 p-4 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
            Shelby Operations
          </p>

          <div className="space-y-1">
            {operations.map((item, index) => (
              <button
                key={item.endpoint}
                type="button"
                onClick={() => setSelected(index)}
                className={`w-full rounded-xl px-3 py-3 text-left transition ${
                  selected === index
                    ? "bg-blue-500/10 text-white ring-1 ring-inset ring-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    {item.name}
                  </span>

                  <span className="rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-400">
                    {item.method}
                  </span>
                </div>

                <p className="mt-1 truncate text-[10px] text-slate-600">
                  {item.sdk}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-400">
              {operation.method}
            </span>

            <code className="break-all text-sm text-slate-300">
              {operation.endpoint}
            </code>

            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-400">
              {operation.status}
            </span>
          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            {operation.name}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {operation.description}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                SDK Operation
              </p>

              <code className="mt-2 block break-all text-xs leading-5 text-blue-400">
                {operation.sdk}
              </code>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Runtime
              </p>

              <p className="mt-2 text-sm font-medium text-white">
                {operation.runtime}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Parameters
              </p>

              <p className="mt-2 text-sm font-medium text-white">
                {operation.params.length > 0
                  ? operation.params.join(", ")
                  : "None"}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Shelby Studio API
                </p>

                <code className="mt-1 block break-all text-xs text-slate-300">
                  {operation.method} {operation.endpoint}
                </code>
              </div>

              <button
                type="button"
                onClick={copyEndpoint}
                className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="p-4">
              <p className="text-xs leading-5 text-slate-600">
                This endpoint is implemented in Shelby Studio and
                executes the corresponding Shelby SDK operation
                server-side.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />

              <div>
                <p className="text-xs font-semibold text-blue-300">
                  Server-side SDK execution
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Shelby credentials remain on the server. The
                  browser calls the Shelby Studio API rather than
                  receiving the private signer key or API secret.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
