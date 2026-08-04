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
import { useTheme } from "../context/ThemeContext";
import { getStatusBreakdown } from "../lib/ticketMetrics";

export default function TicketAnalytics() {
  const { tickets } = useTickets();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const ticketData = useMemo(() => {
    return getStatusBreakdown(tickets).map((entry) => ({
      status: entry.status,
      total: entry.count,
    }));
  }, [tickets]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Ticket Status Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Live ticket totals grouped by current status.
        </p>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ticketData}>
            <CartesianGrid
              stroke={isDark ? "#334155" : "#e2e8f0"}
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="status"
              stroke={isDark ? "#94a3b8" : "#64748b"}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke={isDark ? "#94a3b8" : "#64748b"}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#0f172a" : "#ffffff",
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                borderRadius: "10px",
                color: isDark ? "#ffffff" : "#0f172a",
              }}
              formatter={(value) => [value, "Tickets"]}
            />

            <Bar
              dataKey="total"
              name="Tickets"
              fill={isDark ? "#6366f1" : "#4f46e5"}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}