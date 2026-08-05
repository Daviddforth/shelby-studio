"use client";

import {
  Clock3,
  Sparkles,
} from "lucide-react";

import { useActivity } from "@/context/ActivityContext";

export default function ActivityFeed() {
  const { activities } = useActivity();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
      <div className="flex items-center gap-3">
        <Sparkles
          size={24}
          className="text-blue-400"
        />

        <h2 className="text-2xl font-bold text-white">
          Recent Activity
        </h2>
      </div>

      {activities.length === 0 ? (
        <div className="py-14 text-center">
          <Clock3
            size={42}
            className="mx-auto text-slate-600"
          />

          <p className="mt-4 text-slate-400">
            No activity yet.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Start creating assets and collections to see activity here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4"
            >
              <div>
                <p className="font-medium text-white">
                  {activity.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}