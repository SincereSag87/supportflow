import { useTickets } from "../context/TicketContext";

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Pending: "bg-slate-200 text-slate-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-800 text-white",
};

export default function RecentTickets() {
  const { tickets } = useTickets();

  const recentTickets = tickets.slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Recent Tickets
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          The latest support requests in the service desk.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100">
        {recentTickets.map((ticket) => (
          <article
            key={ticket.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-indigo-600">
                {ticket.id}
              </p>

              <p className="mt-1 truncate font-medium text-slate-900">
                {ticket.subject}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {ticket.customer} · {ticket.updatedAt}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                statusStyles[ticket.status]
              }`}
            >
              {ticket.status}
            </span>
          </article>
        ))}

        {recentTickets.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            No tickets available.
          </p>
        )}
      </div>
    </section>
  );
}