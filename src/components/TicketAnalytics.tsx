import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ticketData = [
  { day: "Mon", opened: 28, resolved: 22 },
  { day: "Tue", opened: 34, resolved: 29 },
  { day: "Wed", opened: 31, resolved: 35 },
  { day: "Thu", opened: 42, resolved: 36 },
  { day: "Fri", opened: 38, resolved: 41 },
  { day: "Sat", opened: 19, resolved: 24 },
  { day: "Sun", opened: 16, resolved: 18 },
];

export default function TicketAnalytics() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Ticket Activity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Opened and resolved tickets during the last seven days.
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
              dataKey="day"
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
            />

            <Legend />

            <Bar
              dataKey="opened"
              name="Opened"
              fill="#4f46e5"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="resolved"
              name="Resolved"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}