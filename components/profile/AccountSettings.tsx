"use client";

import {
  User,
  Bell,
  Lock,
  Moon,
} from "lucide-react";

const settings = [
  {
    title: "Edit Profile",
    icon: User,
  },
  {
    title: "Notifications",
    icon: Bell,
  },
  {
    title: "Security",
    icon: Lock,
  },
  {
    title: "Appearance",
    icon: Moon,
  },
];

export default function AccountSettings() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Settings
      </h2>

      <div className="space-y-4">
        {settings.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="flex w-full items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-blue-500"
            >
              <Icon
                className="text-blue-400"
                size={20}
              />

              <span className="text-white">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}