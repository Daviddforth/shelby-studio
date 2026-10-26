"use client";

import { useState } from "react";

import { Check, Code2, Copy } from "lucide-react";

import { useWallet } from "@/context/WalletContext";
import { useOrigin } from "@/components/media/useOrigin";

/** Shown only to the owner of a page: copy a card for your own website. */
export default function SupportCardSnippet({ owner }: { owner: string }) {
  const { walletAddress } = useWallet();

  const origin = useOrigin();

  const [copied, setCopied] = useState(false);

  if (!walletAddress || walletAddress.toLowerCase() !== owner.toLowerCase()) return null;

  const code = `<iframe src="${origin}/embed/c/${owner}" width="420" height="110" style="border:0" loading="lazy" title="Support me on Shelby Studio"></iframe>`;

  return (
    <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
        <Code2 size={15} className="text-blue-400" />
        Put a support card on your own website
      </h2>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Paste this where you want the card. It shows your followers and whether you are live, and its buttons open this page.
      </p>

      <div className="mt-3 flex items-start gap-2">
        <code className="min-w-0 flex-1 break-all rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-300">{code}</code>

        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);

              setCopied(true);

              setTimeout(() => setCopied(false), 1800);
            } catch {
              // Copying needs permission in some browsers.
            }
          }}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:text-white"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </section>
  );
}
