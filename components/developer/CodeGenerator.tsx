"use client";

import { useMemo, useState } from "react";

type Operation =
  | "assets"
  | "asset"
  | "object"
  | "download"
  | "locations";

type Language = "curl" | "javascript" | "typescript";

const operations: Record<
  Operation,
  {
    label: string;
    endpoint: string;
    description: string;
    params: string[];
  }
> = {
  assets: {
    label: "List Assets",
    endpoint: "/api/shelby/assets",
    description:
      "List assets owned by the configured Shelby Studio account.",
    params: [],
  },
  asset: {
    label: "Inspect Asset",
    endpoint: "/api/shelby/asset",
    description:
      "Retrieve metadata for a specific Shelby asset.",
    params: ["blobName"],
  },
  object: {
    label: "Object Lookup",
    endpoint: "/api/shelby/object",
    description:
      "Perform a direct Shelby object metadata lookup.",
    params: ["blobName"],
  },
  download: {
    label: "Download Asset",
    endpoint: "/api/shelby/download",
    description:
      "Download the contents of a Shelby asset.",
    params: ["blobName", "owner"],
  },
  locations: {
    label: "List Locations",
    endpoint: "/api/shelby/locations",
    description:
      "Retrieve available Shelby storage locations.",
    params: [],
  },
};

function buildEndpoint(
  operation: Operation,
  values: Record<string, string>
) {
  const base = operations[operation].endpoint;

  const params = Object.entries(values)
    .filter(([, value]) => value.trim())
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(
          value.trim()
        )}`
    );

  return params.length
    ? `${base}?${params.join("&")}`
    : base;
}

function generateCode(
  operation: Operation,
  language: Language,
  values: Record<string, string>
) {
  const endpoint = buildEndpoint(operation, values);

  if (language === "curl") {
    if (operation === "download") {
      return `curl -L "https://your-domain.com${endpoint}" \\
  -o downloaded-file`;
    }

    return `curl "https://your-domain.com${endpoint}"`;
  }

  if (language === "javascript") {
    if (operation === "download") {
      return `const response = await fetch(
  "https://your-domain.com${endpoint}"
);

if (!response.ok) {
  throw new Error("Download failed");
}

const blob = await response.blob();

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "downloaded-file";
link.click();

URL.revokeObjectURL(url);`;
    }

    return `const response = await fetch(
  "https://your-domain.com${endpoint}"
);

if (!response.ok) {
  throw new Error("Request failed");
}

const data = await response.json();

console.log(data);`;
  }

  if (operation === "download") {
    return `const response = await fetch(
  "https://your-domain.com${endpoint}"
);

if (!response.ok) {
  throw new Error("Download failed");
}

const blob = await response.blob();

const url = URL.createObjectURL(blob);
const link = document.createElement("a");

link.href = url;
link.download = "downloaded-file";
link.click();

URL.revokeObjectURL(url);`;
  }

  return `const response: Response = await fetch(
  "https://your-domain.com${endpoint}"
);

if (!response.ok) {
  throw new Error("Request failed");
}

const data: unknown = await response.json();

console.log(data);`;
}

export default function CodeGenerator() {
  const [operation, setOperation] =
    useState<Operation>("assets");

  const [language, setLanguage] =
    useState<Language>("curl");

  const [values, setValues] =
    useState<Record<string, string>>({});

  const selected = operations[operation];

  const code = useMemo(
    () =>
      generateCode(
        operation,
        language,
        values
      ),
    [operation, language, values]
  );

  function changeOperation(
    next: Operation
  ) {
    setOperation(next);
    setValues({});
  }

  async function copyCode() {
    await navigator.clipboard.writeText(code);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Code Generator
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Generate copy-pasteable examples for the
          Shelby Studio API.
        </p>
      </div>

      <div className="grid min-w-0 lg:grid-cols-[320px_1fr]">
        <div className="border-b border-slate-800 p-6 lg:border-b-0 lg:border-r">
          <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Operation
          </label>

          <select
            value={operation}
            onChange={(event) =>
              changeOperation(
                event.target.value as Operation
              )
            }
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
          >
            {Object.entries(operations).map(
              ([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              )
            )}
          </select>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {selected.description}
          </p>

          <div className="mt-5">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Language
            </label>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {(
                [
                  ["curl", "cURL"],
                  ["javascript", "JavaScript"],
                  ["typescript", "TypeScript"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setLanguage(key)
                  }
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                    language === key
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {selected.params.length > 0 && (
            <div className="mt-5 space-y-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Parameters
              </p>

              {selected.params.map((param) => (
                <div key={param}>
                  <label className="text-xs text-slate-500">
                    {param}
                  </label>

                  <input
                    value={values[param] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [param]:
                          event.target.value,
                      }))
                    }
                    placeholder={
                      param === "blobName"
                        ? "example/file.json"
                        : "0x..."
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Endpoint
            </p>

            <code className="mt-1 block break-all text-xs text-blue-400">
              GET {buildEndpoint(operation, values)}
            </code>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Generated Code
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {language === "curl"
                  ? "cURL"
                  : language === "javascript"
                    ? "JavaScript"
                    : "TypeScript"}
              </p>
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Copy Code
            </button>
          </div>

          <div className="p-6">
            <pre className="min-h-[320px] overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-5 text-xs leading-6 text-slate-300">
              <code>{code}</code>
            </pre>

            <div className="mt-4 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
              <p className="text-xs font-semibold text-blue-400">
                About these examples
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                These examples call the Shelby Studio API
                routes. Replace{" "}
                <code className="text-slate-400">
                  your-domain.com
                </code>{" "}
                with the domain where Shelby Studio is
                deployed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
