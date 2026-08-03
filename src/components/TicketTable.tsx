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
  selectedTicketIds: string[];
  onSort: (field: SortField) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onToggleTicket: (ticketId: string) => void;
  onToggleAll: () => void;
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
  selectedTicketIds,
  onSort,
  onSelectTicket,
  onToggleTicket,
  onToggleAll,
}: TicketTableProps) {
  const allVisibleTicketsSelected =
    tickets.length > 0 &&
    tickets.every((ticket) =>
      selectedTicketIds.includes(ticket.id),
    );

  function getSortIndicator(field: SortField) {
    if (sortField !== field) {
      return null;
    }

    return sortDirection === "asc" ? "▲" : "▼";
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-auto">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="w-14 px-6 py-4">
                <input
                  type="checkbox"
                  checked={allVisibleTicketsSelected}
                  onChange={onToggleAll}
                  onClick={(event) => event.stopPropagation()}
                  aria-label="Select all tickets on this page"
                  className="h-4 w-4 accent-indigo-600"
                />
              </th>

              <th className="w-72 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("id")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Ticket

                  <span aria-hidden="true">
                    {getSortIndicator("id")}
                  </span>
                </button>
              </th>

              <th className="min-w-48 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("customer")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Customer

                  <span aria-hidden="true">
                    {getSortIndicator("customer")}
                  </span>
                </button>
              </th>

              <th className="min-w-52 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("assignedTo")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Assigned

                  <span aria-hidden="true">
                    {getSortIndicator("assignedTo")}
                  </span>
                </button>
              </th>

              <th className="min-w-36 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("status")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Status

                  <span aria-hidden="true">
                    {getSortIndicator("status")}
                  </span>
                </button>
              </th>

              <th className="min-w-32 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("priority")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Priority

                  <span aria-hidden="true">
                    {getSortIndicator("priority")}
                  </span>
                </button>
              </th>

              <th className="min-w-36 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onSort("updatedAt")}
                  className="flex items-center gap-2 transition hover:text-indigo-600"
                >
                  Updated

                  <span aria-hidden="true">
                    {getSortIndicator("updatedAt")}
                  </span>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => {
              const isSelected = selectedTicketIds.includes(
                ticket.id,
              );

              return (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      onSelectTicket(ticket);
                    }
                  }}
                  className={[
                    "cursor-pointer border-b border-slate-100 transition focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500",
                    isSelected
                      ? "bg-indigo-50 hover:bg-indigo-100"
                      : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <td className="px-6 py-5 align-top">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleTicket(ticket.id)}
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                      aria-label={`Select ${ticket.id}`}
                      className="h-4 w-4 accent-indigo-600"
                    />
                  </td>

                  <td className="w-72 px-6 py-5 align-top">
                    <p className="whitespace-nowrap text-base font-semibold text-slate-900">
                      {ticket.id}
                    </p>

                    <p className="mt-1 max-w-64 text-sm leading-5 text-slate-500">
                      {ticket.subject}
                    </p>
                  </td>

                  <td className="px-6 py-5 align-middle text-slate-700">
                    <span className="whitespace-nowrap">
                      {ticket.customer}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle text-slate-700">
                    <span className="whitespace-nowrap">
                      {ticket.assignedTo}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[ticket.status]
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle">
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                        priorityStyles[ticket.priority]
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle text-slate-500">
                    <span className="whitespace-nowrap">
                      {ticket.updatedAt}
                    </span>
                  </td>
                </tr>
              );
            })}
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