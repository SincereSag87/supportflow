import { useTickets } from "../context/TicketContext";
import { formatRelativeTime } from "../lib/formatDate";

const statusStyles = {
  Open:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",

  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",

  Pending:
    "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",

  Resolved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",

  Closed:
    "bg-slate-800 text-white dark:bg-slate-600 dark:text-white",
};

export default function RecentTickets() {
  const { tickets } = useTickets();

  const recentTickets = tickets.slice(0, 5);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Tickets
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The latest support requests in the service desk.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
        {recentTickets.map((ticket) => (
          <article
            key={ticket.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {ticket.id}
              </p>

              <p className="mt-1 truncate font-medium text-slate-900 dark:text-white">
                {ticket.subject}
              </p>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {ticket.customer} · {formatRelativeTime(ticket.updatedAt)}
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
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No tickets available.
          </p>
        )}
      </div>
    </section>
  );
}