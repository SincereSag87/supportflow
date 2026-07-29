import type { Ticket } from "../types/Ticket";

export type SortField =
  | "id"
  | "customer"
  | "assignedTo"
  | "status"
  | "priority"
  | "updatedAt";

export type SortDirection = "asc" | "desc";

type TicketTableProps = {
  tickets: Ticket[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onSelectTicket: (ticket: Ticket) => void;
};

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Pending: "bg-slate-200 text-slate-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Closed: "bg-slate-800 text-white",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

export default function TicketTable({
  tickets,
  sortField,
  sortDirection,
  onSort,
  onSelectTicket,
}: TicketTableProps) {
  function getSortIndicator(field: SortField) {
    if (sortField !== field) {
      return null;
    }

    return sortDirection === "asc" ? "▲" : "▼";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("id")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Ticket
                  <span>{getSortIndicator("id")}</span>
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("customer")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Customer
                  <span>{getSortIndicator("customer")}</span>
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("assignedTo")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Assigned
                  <span>{getSortIndicator("assignedTo")}</span>
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Status
                  <span>{getSortIndicator("status")}</span>
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("priority")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Priority
                  <span>{getSortIndicator("priority")}</span>
                </button>
              </th>

              <th className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("updatedAt")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Updated
                  <span>{getSortIndicator("updatedAt")}</span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectTicket(ticket);
                  }
                }}
                className="cursor-pointer border-b border-slate-100 transition hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {ticket.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {ticket.subject}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-5 text-slate-700">
                  {ticket.customer}
                </td>

                <td className="px-6 py-5 text-slate-700">
                  {ticket.assignedTo}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[ticket.status]
                    }`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      priorityStyles[ticket.priority]
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td className="px-6 py-5 text-slate-500">
                  {ticket.updatedAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tickets.length === 0 && (
        <p className="p-8 text-center text-slate-500">
          No tickets found.
        </p>
      )}
    </section>
  );
}