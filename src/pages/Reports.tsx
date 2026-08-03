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

const statusColors = [
  "#2563eb",
  "#f59e0b",
  "#8b5cf6",
  "#10b981",
  "#64748b",
];

export default function Reports() {
  const { tickets } = useTickets();

  const reportMetrics = useMemo(() => {
    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
      (ticket) => ticket.status === "Open",
    ).length;

    const resolvedTickets = tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" ||
        ticket.status === "Closed",
    ).length;

    const criticalTickets = tickets.filter(
      (ticket) => ticket.priority === "Critical",
    ).length;

    const resolutionRate =
      totalTickets === 0
        ? 0
        : Math.round(
            (resolvedTickets / totalTickets) * 100,
          );

    const statusData = [
      {
        name: "Open",
        value: tickets.filter(
          (ticket) => ticket.status === "Open",
        ).length,
      },
      {
        name: "In Progress",
        value: tickets.filter(
          (ticket) => ticket.status === "In Progress",
        ).length,
      },
      {
        name: "Pending",
        value: tickets.filter(
          (ticket) => ticket.status === "Pending",
        ).length,
      },
      {
        name: "Resolved",
        value: tickets.filter(
          (ticket) => ticket.status === "Resolved",
        ).length,
      },
      {
        name: "Closed",
        value: tickets.filter(
          (ticket) => ticket.status === "Closed",
        ).length,
      },
    ];

    const priorityData = [
      {
        name: "Low",
        value: tickets.filter(
          (ticket) => ticket.priority === "Low",
        ).length,
      },
      {
        name: "Medium",
        value: tickets.filter(
          (ticket) => ticket.priority === "Medium",
        ).length,
      },
      {
        name: "High",
        value: tickets.filter(
          (ticket) => ticket.priority === "High",
        ).length,
      },
      {
        name: "Critical",
        value: tickets.filter(
          (ticket) => ticket.priority === "Critical",
        ).length,
      },
    ];

    const customerMap = new Map<
      string,
      {
        name: string;
        total: number;
        active: number;
        resolved: number;
      }
    >();

    tickets.forEach((ticket) => {
      const customer = customerMap.get(ticket.customer) ?? {
        name: ticket.customer,
        total: 0,
        active: 0,
        resolved: 0,
      };

      customer.total += 1;

      if (
        ticket.status === "Open" ||
        ticket.status === "In Progress" ||
        ticket.status === "Pending"
      ) {
        customer.active += 1;
      }

      if (
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
      ) {
        customer.resolved += 1;
      }

      customerMap.set(ticket.customer, customer);
    });

    const topCustomers = [...customerMap.values()]
      .sort((left, right) => right.total - left.total)
      .slice(0, 5);

    const agentMap = new Map<
      string,
      {
        name: string;
        total: number;
        active: number;
        completed: number;
      }
    >();

    tickets.forEach((ticket) => {
      const agent = agentMap.get(ticket.assignedTo) ?? {
        name: ticket.assignedTo,
        total: 0,
        active: 0,
        completed: 0,
      };

      agent.total += 1;

      if (
        ticket.status === "Open" ||
        ticket.status === "In Progress" ||
        ticket.status === "Pending"
      ) {
        agent.active += 1;
      }

      if (
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
      ) {
        agent.completed += 1;
      }

      agentMap.set(ticket.assignedTo, agent);
    });

    const agentWorkload = [...agentMap.values()].sort(
      (left, right) => right.total - left.total,
    );

    return {
      totalTickets,
      openTickets,
      resolvedTickets,
      criticalTickets,
      resolutionRate,
      statusData,
      priorityData,
      topCustomers,
      agentWorkload,
    };
  }, [tickets]);

  return (
    <main className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Analytics
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Reports
          </h1>

          <p className="mt-2 text-slate-500">
            Review service desk performance and ticket trends.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {reportMetrics.totalTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Open Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-600">
              {reportMetrics.openTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolved or Closed
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-600">
              {reportMetrics.resolvedTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Critical Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-red-600">
              {reportMetrics.criticalTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Resolution Rate
            </p>

            <p className="mt-3 text-3xl font-bold text-indigo-600">
              {reportMetrics.resolutionRate}%
            </p>
          </article>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Tickets by Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
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

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Tickets by Priority
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current ticket volume grouped by priority level.
              </p>
            </div>

            <div className="mt-6 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportMetrics.priorityData}>
                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    dataKey="name"
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
                    dataKey="value"
                    name="Tickets"
                    fill="#4f46e5"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Top Customers
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Active
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resolved
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {reportMetrics.topCustomers.map((customer) => (
                    <tr key={customer.name}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {customer.name}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {customer.total}
                      </td>

                      <td className="px-4 py-3 text-center text-amber-600">
                        {customer.active}
                      </td>

                      <td className="px-4 py-3 text-center text-emerald-600">
                        {customer.resolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Agent Workload
            </h2>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Agent
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Active
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Completed
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {reportMetrics.agentWorkload.map((agent) => (
                    <tr key={agent.name}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {agent.name}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {agent.total}
                      </td>

                      <td className="px-4 py-3 text-center text-amber-600">
                        {agent.active}
                      </td>

                      <td className="px-4 py-3 text-center text-emerald-600">
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