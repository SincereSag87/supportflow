import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { notifications as initialNotifications } from "../data/notifications";
import type { AppNotification } from "../types/Notification";

const STORAGE_KEY = "supportflow-notifications";

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

type NotificationProviderProps = {
  children: ReactNode;
};

function loadNotifications(): AppNotification[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return initialNotifications;
  }

  try {
    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : initialNotifications;
  } catch {
    return initialNotifications;
  }
}

export function NotificationProvider({
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    loadNotifications,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  function markRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }

  function markAllRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside a NotificationProvider.",
    );
  }

  return context;
}
