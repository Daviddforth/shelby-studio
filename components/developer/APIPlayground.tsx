"use client";

import { useState } from "react";

type Operation =
  | "assets"
  | "asset"
  | "object"
  | "locations"
  | "download";

const operations = {
  assets: {
    label: "List Assets",
    endpoint: "/api/shelby/assets",
    description:
      "List assets owned by the configured Shelby Studio account.",
  },

  asset: {
    label: "Inspect Asset",
    endpoint: "/api/shelby/asset",
    description:
      "Retrieve metadata for a specific Shelby asset.",
  },

  object: {
    label: "Object Lookup",
    endpoint: "/api/shelby/object",
    description:
      "Perform a direct Shelby object metadata lookup.",
  },

  locations: {
    label: "List Locations",
    endpoint: "/api/shelby/locations",
    description:
      "Retrieve available Shelby storage locations.",
  },

  download: {
    label: "Download Asset",
    endpoint: "/api/shelby/download",
    description:
      "Download a Shelby asset directly from storage.",
  },
};

export default function APIPlayground() {
  const [operation, setOperation] =
    useState<Operation>("assets");

  const [blobName, setBlobName] = useState("");

  const [owner, setOwner] = useState("");

  const [loading, setLoading] = useState(false);

  const [response, setResponse] =
    useState<unknown>(null);

  const [error, setError] = useState("");

  const selected = operations[operation];

  async function executeRequest() {
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      let url = selected.endpoint;

      if (
        operation === "asset" ||
        operation === "object"
      ) {
        if (!blobName.trim()) {
          throw new Error(
            "Enter a blob name before running this request."
          );
        }

        url += `?blobName=${encodeURIComponent(
          blobName.trim()
        )}`;
      }

      if (operation === "download") {
        if (!blobName.trim()) {
          throw new Error(
            "Enter a blob name before downloading."
          );
        }

        if (!owner.trim()) {
          throw new Error(
            "Enter the asset owner address before downloading."
          );
        }

        url +=
          `?blobName=${encodeURIComponent(
            blobName.trim()
          )}` +
          `&owner=${encodeURIComponent(
            owner.trim()
          )}`;
      }

      const result = await fetch(url);

      if (operation === "download") {
        const contentType =
          result.headers.get("content-type") || "";

        if (!result.ok) {
          if (
            contentType.includes(
              "application/json"
            )
          ) {
            const data = await result.json();

            throw new Error(
              data?.error ||
                `Download failed with status ${result.status}.`
            );
          }

          throw new Error(
            `Download failed with status ${result.status}.`
          );
        }

        const blob = await result.blob();

        const contentDisposition =
          result.headers.get(
            "content-disposition"
          ) || "";

        const filenameMatch =
          contentDisposition.match(
            /filename="([^"]+)"/
          );

        const filename =
          filenameMatch?.[1] ||
          blobName.split("/").pop() ||
          "shelby-download";

        const downloadUrl =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = downloadUrl;
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
          downloadUrl
        );

        setResponse({
          success: true,
          action: "download",
          filename,
          size: blob.size,
          contentType:
            blob.type ||
            "application/octet-stream",
        });

        return;
      }

      const contentType =
        result.headers.get("content-type") || "";

      if (
        !contentType.includes(
          "application/json"
        )
      ) {
        throw new Error(
          `Request returned ${result.status} ${result.statusText}.`
        );
      }

      const data = await result.json();

      if (!result.ok) {
        throw new Error(
          data?.error ||
            `Request failed with status ${result.status}.`
        );
      }

      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unknown request error."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    if (response === null) return;

    await navigator.clipboard.writeText(
      JSON.stringify(
        response,
        null,
        2
      )
    );
  }

  const needsBlobName =
    operation === "asset" ||
    operation === "object" ||
    operation === "download";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            API Playground
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Execute Shelby Studio API operations and inspect
            live responses.
          </p>
        </div>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[320px_1fr]">
        <div className="border-b border-slate-800 p-6 lg:border-b-0 lg:border-r">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Operation
          </label>

          <select
            value={operation}
            onChange={(event) =>
              setOperation(
                event.target.value as Operation
              )
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          >
            {Object.entries(
              operations
            ).map(
              ([key, value]) => (
                <option
                  key={key}
                  value={key}
                >
                  {value.label}
                </option>
              )
            )}
          </select>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {selected.description}
          </p>

          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Endpoint
            </p>

            <code className="mt-1 block break-all text-xs text-blue-400">
              GET {selected.endpoint}
            </code>
          </div>

          {needsBlobName && (
            <div className="mt-5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Blob Name
              </label>

              <input
                value={blobName}
                onChange={(event) =>
                  setBlobName(
                    event.target.value
                  )
                }
                placeholder="example/file.json"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500"
              />
            </div>
          )}

          {operation === "download" && (
            <div className="mt-5">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Owner Address
              </label>

              <input
                value={owner}
                onChange={(event) =>
                  setOwner(
                    event.target.value
                  )
                }
                placeholder="0x..."
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500"
              />

              <p className="mt-2 text-xs leading-5 text-slate-600">
                The Aptos/Shelby account that owns the
                requested blob.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={executeRequest}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? operation === "download"
                ? "Downloading..."
                : "Running..."
              : operation === "download"
                ? "Download Asset"
                : "Run Request"}
          </button>
        </div>

        <div className="min-h-[420px]">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Response
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {response
                  ? operation ===
                    "download"
                    ? "Download completed successfully"
                    : "Request completed successfully"
                  : error
                    ? "Request failed"
                    : "Run a request to see the response"}
              </p>
            </div>

            {response !== null &&
              operation !== "download" && (
                <button
                  type="button"
                  onClick={
                    copyResponse
                  }
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  Copy JSON
                </button>
              )}
          </div>

          <div className="p-6">
            {error ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Error
                </p>

                <p className="mt-2 text-sm leading-6 text-red-300">
                  {error}
                </p>
              </div>
            ) : response !== null ? (
              <pre className="max-h-[520px] overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-5 text-xs leading-6 text-slate-300">
                {JSON.stringify(
                  response,
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-500">
                    No response yet
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    Select an operation and run
                    the request.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
