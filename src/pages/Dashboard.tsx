import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import RecentTickets from "../components/RecentTickets";
import TicketAnalytics from "../components/TicketAnalytics";
import TicketStatusBreakdown from "../components/TicketStatusBreakdown";
import { useTickets } from "../context/TicketContext";
import { useTheme } from "../context/ThemeContext";
import {
  getAgentWorkload,
  getMonthlyTrend,
  getPerformanceMetrics,
  getSlaCompliance,
} from "../lib/ticketMetrics";

function slaBarColor(percent: number): string {
  if (percent >= 90) {
    return "bg-emerald-500";
  }

  if (percent >= 70) {
    return "bg-amber-500";
  }

  return "bg-red-500";
}

export default function Dashboard() {
  const { tickets } = useTickets();
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const dashboardCards = useMemo(() => {
    const openTickets = tickets.filter(
      (ticket) => ticket.status === "Open",
    ).length;

    const assignedToMe = tickets.filter(
      (ticket) =>
        ticket.assignedTo === "Raymond Wannamaker" &&
        ticket.status !== "Closed",
    ).length;

    const resolvedTickets = tickets.filter(
      (ticket) => ticket.status === "Resolved",
    ).length;

    const criticalTickets = tickets.filter(
      (ticket) => ticket.priority === "Critical",
    ).length;

    return [
      {
        title: "Open Tickets",
        value: openTickets,
        description: `${tickets.length} total tickets`,
      },
      {
        title: "Assigned to Me",
        value: assignedToMe,
        description: "Active tickets assigned to you",
      },
      {
        title: "Resolved",
        value: resolvedTickets,
        description: "Tickets marked as resolved",
      },
      {
        title: "Critical Priority",
        value: criticalTickets,
        description: "Tickets requiring immediate attention",
      },
    ];
  }, [tickets]);

  const slaCompliance = useMemo(() => getSlaCompliance(tickets), [tickets]);

  const agentWorkload = useMemo(
    () => getAgentWorkload(tickets).slice(0, 5),
    [tickets],
  );

  const maxAgentTotal = Math.max(
    1,
    ...agentWorkload.map((agent) => agent.total),
  );

  const performance = useMemo(
    () => getPerformanceMetrics(tickets),
    [tickets],
  );

  const monthlyTrend = useMemo(() => getMonthlyTrend(tickets, 6), [tickets]);

  return (
    <main className="min-h-screen bg-slate-50 p-8 transition-colors dark:bg-slate-950">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <TicketAnalytics />

        <div className="grid gap-8">
          <RecentTickets />
          <TicketStatusBreakdown />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            SLA Compliance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Resolved tickets that met their priority target.
          </p>

          <p className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
            {slaCompliance.percent}%
          </p>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${slaBarColor(slaCompliance.percent)}`}
              style={{ width: `${slaCompliance.percent}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {slaCompliance.met} met · {slaCompliance.breached} breached
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Team Workload
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Ticket load by agent.
          </p>

          <div className="mt-5 space-y-4">
            {agentWorkload.map((agent) => (
              <div key={agent.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {agent.name}
                  </span>

                  <span className="text-slate-500 dark:text-slate-400">
                    {agent.active} active · {agent.total} total
                  </span>
                </div>

                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${(agent.total / maxAgentTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Performance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Team throughput at a glance.
          </p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Avg. Resolution Time
              </span>

              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {performance.avgResolutionHours}h
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Resolved This Month
              </span>

              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {performance.resolvedThisMonth}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Resolution Rate
              </span>

              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {performance.resolutionRate}%
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Monthly Trend
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tickets created vs. resolved over the last 6 months.
          </p>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid
                  stroke={isDark ? "#334155" : "#e2e8f0"}
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="month"
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
                />

                <Legend
                  wrapperStyle={{
                    color: isDark ? "#e2e8f0" : "#334155",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="created"
                  name="Created"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
