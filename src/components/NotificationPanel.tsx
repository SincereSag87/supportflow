import { useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useNotifications } from "../context/NotificationContext";
import { formatRelativeTime } from "../lib/formatDate";

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();

  useOnClickOutside(panelRef, () => setIsOpen(false));

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Open notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="relative rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <FaBell />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Notifications
            </p>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-slate-500 dark:text-slate-400">
                No notifications.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => {
                    markRead(notification.id);
                    setIsOpen(false);

                    if (notification.ticketId) {
                      navigate("/tickets");
                    }
                  }}
                  className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <span
                    className={[
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      notification.read
                        ? "bg-transparent"
                        : "bg-indigo-600",
                    ].join(" ")}
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {notification.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {notification.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {formatRelativeTime(notification.time)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
