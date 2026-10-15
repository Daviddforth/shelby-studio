"use client";

import { useState, useSyncExternalStore } from "react";

import { Check, Copy, ExternalLink } from "lucide-react";

import {
  buildEmbedCode,
  getSiteOrigin,
  mediaPagePath,
  mediaStreamPath,
  type MediaKind,
} from "@/lib/media/types";

interface Props {
  owner: string;
  blobName: string;
  kind: MediaKind;
}

// The origin never changes while the page is open, so there is nothing to subscribe to.
function subscribeToNothing() {
  return () => {};
}

/**
 * Copyable public link, embed code and direct file link for one hosted
 * media file. Absolute URLs are built from the browser origin so the same
 * component works in local development and in production.
 */
export default function ShareLinks({ owner, blobName, kind }: Props) {
  // Browser origin on the client, configured site origin during server render.
  const origin = useSyncExternalStore(
    subscribeToNothing,
    () => window.location.origin,
    () => getSiteOrigin()
  );

  const [copied, setCopied] = useState<string | null>(null);

  const pagePath = mediaPagePath(owner, blobName);

  const pageUrl = `${origin}${pagePath}`;

  const directUrl = `${origin}${mediaStreamPath(owner, blobName)}`;

  const embedCode = buildEmbedCode(origin, owner, blobName, kind);

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);

      setCopied(label);

      window.setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  return (
    <div className="space-y-3">
      <Field
        label="Public page"
        value={pageUrl}
        copied={copied === "page"}
        onCopy={() => copy("page", pageUrl)}
        href={pagePath}
      />

      <Field
        label="Embed code"
        value={embedCode}
        copied={copied === "embed"}
        onCopy={() => copy("embed", embedCode)}
      />

      <Field
        label="Direct file link"
        value={directUrl}
        copied={copied === "direct"}
        onCopy={() => copy("direct", directUrl)}
      />
    </div>
  );
}

function Field({
  label,
  value,
  copied,
  onCopy,
  href,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  href?: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{label}</p>

        <div className="flex items-center gap-3">
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <ExternalLink size={13} />
              Open
            </a>
          )}

          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            {copied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <p className="mt-2 break-all font-mono text-xs text-slate-300">
        {value}
      </p>
    </div>
  );
}
