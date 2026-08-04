import { useMemo } from "react";
import { useTickets } from "../context/TicketContext";
import { getStatusBreakdown } from "../lib/ticketMetrics";
import type { TicketStatus } from "../types/Ticket";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-blue-500",
  "In Progress": "bg-amber-500",
  Pending: "bg-slate-500",
  Resolved: "bg-emerald-500",
  Closed: "bg-slate-900 dark:bg-slate-400",
};

export default function TicketStatusBreakdown() {
  const { tickets } = useTickets();

  const rows = useMemo(() => {
    return getStatusBreakdown(tickets).map((entry) => ({
      label: entry.status,
      value: entry.count,
      color: statusColors[entry.status],
    }));
  }, [tickets]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Ticket Status
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Live breakdown of all ticket statuses.
      </p>

      <div className="mt-6 space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${row.color}`}
              />

              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {row.label}
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}