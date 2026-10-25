"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

/** Paste a wallet address to open that creator, or type a name to filter the creators below. */
export default function CreatorSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const router = useRouter();

  const [error, setError] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const text = value.trim();

    if (/^0x[0-9a-fA-F]{64}$/.test(text)) {
      router.push(`/c/${text.toLowerCase()}`);
      return;
    }

    setError(text.startsWith("0x") ? "That does not look like a full wallet address." : "");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 focus-within:border-blue-500">
        <Search size={16} className="shrink-0 text-slate-500" />

        <input
          value={value}
          onChange={(event) => {
            setError("");
            onChange(event.target.value);
          }}
          placeholder="Find a creator by name, or paste a wallet address"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </form>
  );
}
