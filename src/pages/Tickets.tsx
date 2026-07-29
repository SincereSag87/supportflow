import { useMemo, useState } from "react";
import TicketDetails from "../components/TicketDetails";
import TicketTable, {
  type SortDirection,
  type SortField,
} from "../components/TicketTable";
import { tickets } from "../data/tickets";
import type { Ticket } from "../types/Ticket";

export default function Tickets() {
  const [ticketList, setTicketList] = useState<Ticket[]>(tickets);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");
  const [priorityFilter, setPriorityFilter] =
    useState("All Priorities");

  const [sortField, setSortField] =
    useState<SortField>("id");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  const filteredTickets = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase();

    const results = ticketList.filter((ticket) => {
      const searchableText = [
        ticket.id,
        ticket.subject,
        ticket.customer,
        ticket.assignedTo,
        ticket.status,
        ticket.priority,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch === "" ||
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All Statuses" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priorities" ||
        ticket.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

    results.sort((a, b) => {
      const left = a[sortField];
      const right = b[sortField];

      if (left < right) {
        return sortDirection === "asc" ? -1 : 1;
      }

      if (left > right) {
        return sortDirection === "asc" ? 1 : -1;
      }

      return 0;
    });

    return results;
  }, [
    ticketList,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortField,
    sortDirection,
  ]);

  return (
    <>
      <main className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Service desk
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Tickets
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <p className="text-slate-500">
                Review, assign, and manage customer support requests.
              </p>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">
                {filteredTickets.length} ticket
                {filteredTickets.length !== 1 ? "s" : ""}
              </span>

              {statusFilter !== "All Statuses" && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {statusFilter}
                </span>
              )}

              {priorityFilter !== "All Priorities" && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                  {priorityFilter}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search tickets..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <option>All Statuses</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Pending</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 px-4 py-3"
              >
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
            >
              Export
            </button>
          </div>

          <TicketTable
            tickets={filteredTickets}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSelectTicket={setSelectedTicket}
          />
        </div>
      </main>

      <TicketDetails
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateTicket={(updatedTicket) => {
          setTicketList((currentTickets) =>
            currentTickets.map((ticket) =>
              ticket.id === updatedTicket.id
                ? updatedTicket
                : ticket,
           ),
         );

          setSelectedTicket(updatedTicket);
        }}
      />
    </>
  );
}