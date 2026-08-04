import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTickets } from "../context/TicketContext";
import { useTheme } from "../context/ThemeContext";
import {
  getAgentWorkload,
  getPerformanceMetrics,
  getPriorityBreakdown,
  getStatusBreakdown,
  getTopCustomers,
} from "../lib/ticketMetrics";

const statusColors = [
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#64748b",
];

export default function Reports() {
  const { tickets } = useTickets();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const reportMetrics = useMemo(() => {
    const statusBreakdown = getStatusBreakdown(tickets);
    const priorityBreakdown = getPriorityBreakdown(tickets);
    const performance = getPerformanceMetrics(tickets);

    const openTickets =
      statusBreakdown.find((entry) => entry.status === "Open")?.count ?? 0;

    const resolvedTickets = tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" || ticket.status === "Closed",
    ).length;

    const criticalTickets =
      priorityBreakdown.find((entry) => entry.priority === "Critical")
        ?.count ?? 0;

    return {
      totalTickets: tickets.length,
      openTickets,
      resolvedTickets,
      criticalTickets,
      resolutionRate: performance.resolutionRate,
      statusData: statusBreakdown.map((entry) => ({
        name: entry.status,
        value: entry.count,
      })),
      priorityData: priorityBreakdown.map((entry) => ({
        name: entry.priority,
        value: entry.count,
      })),
      topCustomers: getTopCustomers(tickets, 5),
      agentWorkload: getAgentWorkload(tickets),
    };
  }, [tickets]);

  return (
    <main className="min-h-screen bg-slate-50 p-8 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Analytics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Reports
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Review service desk performance and ticket trends.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {reportMetrics.totalTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Open Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {reportMetrics.openTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved or Closed
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {reportMetrics.resolvedTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Critical Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">
              {reportMetrics.criticalTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolution Rate
            </p>

            <p className="mt-3 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {reportMetrics.resolutionRate}%
            </p>
          </article>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Tickets by Status
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Live distribution of tickets by current workflow
                status.
              </p>
            </div>

            <div className="mt-6 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportMetrics.statusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={125}
                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }
                  >
                    {reportMetrics.statusData.map(
                      (entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={
                            statusColors[
                              index % statusColors.length
                            ]
                          }
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                      borderRadius: "10px",
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      color: isDark ? "#e2e8f0" : "#334155",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Tickets by Priority
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Current ticket volume grouped by priority level.
              </p>
            </div>

            <div className="mt-6 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportMetrics.priorityData}>
                  <CartesianGrid
                    stroke={isDark ? "#334155" : "#e2e8f0"}
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    dataKey="name"
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
                    dataKey="value"
                    name="Tickets"
                    fill={isDark ? "#6366f1" : "#4f46e5"}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Top Customers
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Active
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Resolved
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {reportMetrics.topCustomers.map((customer) => (
                    <tr key={customer.name}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {customer.name}
                      </td>

                      <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                        {customer.total}
                      </td>

                      <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">
                        {customer.active}
                      </td>

                      <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">
                        {customer.resolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Agent Workload
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-950">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Agent
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Active
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Completed
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {reportMetrics.agentWorkload.map((agent) => (
                    <tr key={agent.name}>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {agent.name}
                      </td>

                      <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                        {agent.total}
                      </td>

                      <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">
                        {agent.active}
                      </td>

                      <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">
                        {agent.completed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
