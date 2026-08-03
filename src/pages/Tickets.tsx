import { useEffect, useMemo, useState } from "react";
import TicketDetails from "../components/TicketDetails";
import TicketTable, {
  type SortDirection,
  type SortField,
} from "../components/TicketTable";
import { useTickets } from "../context/TicketContext";
import type { Ticket } from "../types/Ticket";

export default function Tickets() {
  const {tickets: ticketList,updateTicket,deleteTicket} = useTickets();

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

  const [selectedTicketIds, setSelectedTicketIds] =
  useState<string[]>([]);

  const [assigneeFilter, setAssigneeFilter] =
  useState("All Assignees");

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    assigneeFilter,
  ]);

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

  const assignees = useMemo(() => {
  return [
    "All Assignees",
    ...Array.from(
      new Set(
        ticketList.map((ticket) => ticket.assignedTo),
      ),
    ).sort(),
  ];
}, [ticketList]);

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

      const matchesAssignee =
        assigneeFilter === "All Assignees" ||
        ticket.assignedTo === assigneeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
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
    assigneeFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / ticketsPerPage),
  );

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const endIndex = startIndex + ticketsPerPage;

    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage]);

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

            <select
              value={assigneeFilter}
              onChange={(event) =>
                setAssigneeFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500"
          >
            {assignees.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("All Statuses");
              setPriorityFilter("All Priorities");
              setAssigneeFilter("All Assignees");
            }}
            className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Clear Filters
          </button>

            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
            >
              Export
            </button>
          </div>

          <TicketTable
            tickets={paginatedTickets}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedTicketIds={selectedTicketIds}
            onSort={handleSort}
            onSelectTicket={setSelectedTicket}
            onToggleTicket={(ticketId) => {
              setSelectedTicketIds((currentIds) =>
                currentIds.includes(ticketId)
                  ? currentIds.filter((id) => id !== ticketId)
                  : [...currentIds, ticketId],
              );
            }}
            onToggleAll={() => {
              const currentPageIds = paginatedTickets.map(
                (ticket) => ticket.id,
              );

            setSelectedTicketIds((currentIds) => {
              const allCurrentPageTicketsSelected =
                currentPageIds.length > 0 &&
                currentPageIds.every((ticketId) =>
                  currentIds.includes(ticketId),
                );
                    
              if (allCurrentPageTicketsSelected) {
                  return currentIds.filter(
                    (ticketId) => !currentPageIds.includes(ticketId),
                  );
                }

                return Array.from(
                  new Set([
                    ...currentIds,
                    ...currentPageIds,
                  ]),
                );
              });
            }}
          />
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {paginatedTickets.length}
              </span>
              of{" "}
              <span className="font-semibold text-slate-900">
                {filteredTickets.length}
              </span>{" "}
              tickets • Page{" "}
              <span className="font-semibold text-slate-900">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
                disabled={currentPage === 1}
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-medium transition",
                  currentPage === 1
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((current) =>
                    Math.min(totalPages, current + 1),
                  )
                }
                disabled={currentPage === totalPages}
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-medium transition",
                  currentPage === totalPages
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                Next
            </button>
          </div>
        </div>
        </div>
      </main>

      <TicketDetails
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateTicket={(updatedTicket) => {
          updateTicket(updatedTicket);
          setSelectedTicket(updatedTicket);
        }}
        onDeleteTicket={(ticketId) => {
          deleteTicket(ticketId);
          setSelectedTicket(null);
        }}
      />
    </>
  );
}