"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface Notification {
  id: string;
  title: string;
  read: boolean;
  time: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unread: number;

  addNotification: (
    title: string
  ) => void;

  markAllRead: () => void;
}

const NotificationContext =
  createContext<NotificationContextType | null>(
    null
  );

export function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  function addNotification(title: string) {
    setNotifications((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        read: false,
        time: "Just now",
      },
      ...prev,
    ]);
  }

  function markAllRead() {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    );
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unread: notifications.filter(
          (item) => !item.read
        ).length,
        addNotification,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}