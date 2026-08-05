"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface Activity {
  id: string;
  title: string;
  time: string;
}

interface ActivityContextType {
  activities: Activity[];

  addActivity: (
    title: string
  ) => void;
}

const ActivityContext =
  createContext<ActivityContextType | null>(
    null
  );

export function ActivityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  function addActivity(
    title: string
  ) {
    setActivities((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        time: "Just now",
      },
      ...prev,
    ]);
  }

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context =
    useContext(ActivityContext);

  if (!context) {
    throw new Error(
      "useActivity must be used inside ActivityProvider"
    );
  }

  return context;
}