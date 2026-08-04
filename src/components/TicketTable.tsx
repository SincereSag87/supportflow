import { FaRegStar, FaStar } from "react-icons/fa";
import type { Ticket } from "../types/Ticket";
import {
  formatDueDate,
  formatRelativeTime,
  isOverdue,
} from "../lib/formatDate";

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
  onToggleFavorite: (ticket: Ticket) => void;
};

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

const priorityStyles = {
  Low:
    "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",

  Medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",

  High:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",

  Critical:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
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
  onToggleFavorite,
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
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-auto">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
            <tr className="text-left text-sm font-semibold text-slate-600 dark:text-slate-300">
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
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
                      ? "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800",
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleFavorite(ticket);
                        }}
                        aria-label={
                          ticket.isFavorite
                            ? `Remove ${ticket.id} from favorites`
                            : `Add ${ticket.id} to favorites`
                        }
                        className="shrink-0 text-amber-400 transition hover:text-amber-500"
                      >
                        {ticket.isFavorite ? <FaStar /> : <FaRegStar />}
                      </button>

                      <p className="whitespace-nowrap text-base font-semibold text-slate-900 dark:text-white">
                        {ticket.id}
                      </p>
                    </div>

                    <p className="mt-1 max-w-64 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {ticket.subject}
                    </p>

                    {ticket.labels.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {ticket.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}

                    {ticket.dueDate && (
                      <p
                        className={[
                          "mt-2 text-xs font-medium",
                          isOverdue(ticket.dueDate)
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-400 dark:text-slate-500",
                        ].join(" ")}
                      >
                        {isOverdue(ticket.dueDate) ? "Overdue: " : "Due "}
                        {formatDueDate(ticket.dueDate)}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5 align-middle text-slate-700 dark:text-slate-300">
                    <span className="whitespace-nowrap">
                      {ticket.customer}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-middle text-slate-700 dark:text-slate-300">
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

                  <td className="px-6 py-5 align-middle text-slate-500 dark:text-slate-400">
                    <span className="whitespace-nowrap">
                      {formatRelativeTime(ticket.updatedAt)}
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