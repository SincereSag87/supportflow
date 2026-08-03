import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTickets } from "../context/TicketContext";

export default function TicketAnalytics() {
  const { tickets } = useTickets();

  const ticketData = useMemo(() => {
    return [
      {
        status: "Open",
        total: tickets.filter(
          (ticket) => ticket.status === "Open",
        ).length,
      },
      {
        status: "In Progress",
        total: tickets.filter(
          (ticket) => ticket.status === "In Progress",
        ).length,
      },
      {
        status: "Pending",
        total: tickets.filter(
          (ticket) => ticket.status === "Pending",
        ).length,
      },
      {
        status: "Resolved",
        total: tickets.filter(
          (ticket) => ticket.status === "Resolved",
        ).length,
      },
      {
        status: "Closed",
        total: tickets.filter(
          (ticket) => ticket.status === "Closed",
        ).length,
      },
    ];
  }, [tickets]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Ticket Status Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Live ticket totals grouped by current status.
        </p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ticketData}>
            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="status"
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
              }}
              formatter={(value) => [value, "Tickets"]}
            />

            <Bar
              dataKey="total"
              name="Tickets"
              fill="#4f46e5"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}