import { useMemo } from "react";
import { useTickets } from "../context/TicketContext";

export default function TicketStatusBreakdown() {
  const { tickets } = useTickets();

  const stats = useMemo(() => {
    return {
      Open: tickets.filter((t) => t.status === "Open").length,
      "In Progress": tickets.filter(
        (t) => t.status === "In Progress",
      ).length,
      Pending: tickets.filter(
        (t) => t.status === "Pending",
      ).length,
      Resolved: tickets.filter(
        (t) => t.status === "Resolved",
      ).length,
      Closed: tickets.filter(
        (t) => t.status === "Closed",
      ).length,
    };
  }, [tickets]);

  const rows = [
    {
      label: "Open",
      value: stats.Open,
      color: "bg-blue-500",
    },
    {
      label: "In Progress",
      value: stats["In Progress"],
      color: "bg-amber-500",
    },
    {
      label: "Pending",
      value: stats.Pending,
      color: "bg-slate-500",
    },
    {
      label: "Resolved",
      value: stats.Resolved,
      color: "bg-emerald-500",
    },
    {
      label: "Closed",
      value: stats.Closed,
      color: "bg-slate-900",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Ticket Status
      </h2>

      <p className="mt-1 text-sm text-slate-500">
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

              <span className="text-sm font-medium text-slate-700">
                {row.label}
              </span>
            </div>

            <span className="text-lg font-bold text-slate-900">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}