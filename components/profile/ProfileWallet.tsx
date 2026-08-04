"use client";

import { Wallet, Globe, ShieldCheck } from "lucide-react";

export default function ProfileWallet() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Profile Information
      </h2>

      <div className="space-y-6">
        <Info
          icon={<Wallet className="text-blue-400" size={20} />}
          label="Wallet Address"
          value="Not Connected"
        />

        <Info
          icon={<Globe className="text-green-400" size={20} />}
          label="Network"
          value="Shelbynet"
        />

        <Info
          icon={<ShieldCheck className="text-purple-400" size={20} />}
          label="Shelby UID"
          value="Not Assigned"
        />
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="flex items-center gap-4">
        {icon}

        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}