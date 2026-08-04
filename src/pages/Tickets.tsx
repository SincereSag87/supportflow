import { useEffect, useMemo, useState } from "react";
import { FaColumns, FaTable } from "react-icons/fa";
import TicketDetails from "../components/TicketDetails";
import TicketTable, {
  type SortDirection,
  type SortField,
} from "../components/TicketTable";
import KanbanBoard from "../components/KanbanBoard";
import { useTickets } from "../context/TicketContext";
import type { Ticket } from "../types/Ticket";

export default function Tickets() {
  const {
    tickets: ticketList,
    updateTicket,
    deleteTicket,
  } = useTickets();

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [priorityFilter, setPriorityFilter] =
    useState("All Priorities");

  const [assigneeFilter, setAssigneeFilter] =
    useState("All Assignees");

  const [labelFilter, setLabelFilter] = useState("All Labels");

  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [sortField, setSortField] =
    useState<SortField>("id");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [selectedTicketIds, setSelectedTicketIds] =
    useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [view, setView] = useState<"table" | "board">("table");

  const ticketsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    labelFilter,
    favoritesOnly,
  ]);

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((current) =>
        current === "asc" ? "desc" : "asc",
      );

      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  const assignees = useMemo(() => {
    return [
      "All Assignees",
      ...Array.from(
        new Set(
          ticketList.map(
            (ticket) => ticket.assignedTo,
          ),
        ),
      ).sort(),
    ];
  }, [ticketList]);

  const labelOptions = useMemo(() => {
    return [
      "All Labels",
      ...Array.from(
        new Set(ticketList.flatMap((ticket) => ticket.labels)),
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

      const matchesLabel =
        labelFilter === "All Labels" ||
        ticket.labels.includes(labelFilter);

      const matchesFavorite = !favoritesOnly || ticket.isFavorite;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesLabel &&
        matchesFavorite
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
    assigneeFilter,
    labelFilter,
    favoritesOnly,
    sortField,
    sortDirection,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTickets.length / ticketsPerPage,
    ),
  );

  const paginatedTickets = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ticketsPerPage;

    const endIndex = startIndex + ticketsPerPage;

    return filteredTickets.slice(
      startIndex,
      endIndex,
    );
  }, [filteredTickets, currentPage]);

  return (
    <>
      <main className="min-h-screen bg-slate-50 p-8 transition-colors dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 sm:flex sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                Service desk
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                Tickets
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-slate-500 dark:text-slate-400">
                  Review, assign, and manage customer
                  support requests.
                </p>

              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                {filteredTickets.length} ticket
                {filteredTickets.length !== 1
                  ? "s"
                  : ""}
              </span>

              {statusFilter !== "All Statuses" && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {statusFilter}
                </span>
              )}

              {priorityFilter !==
                "All Priorities" && (
                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  {priorityFilter}
                </span>
              )}

              {assigneeFilter !==
                "All Assignees" && (
                <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {assigneeFilter}
                </span>
              )}
              </div>
            </div>

            <div className="mt-4 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 sm:mt-0">
              <button
                type="button"
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
                className={[
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  view === "table"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                <FaTable />
                Table
              </button>

              <button
                type="button"
                onClick={() => setView("board")}
                aria-pressed={view === "board"}
                className={[
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  view === "board"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                <FaColumns />
                Board
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search tickets..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
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
                  setPriorityFilter(
                    event.target.value,
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option>All Priorities</option>
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <select
                value={assigneeFilter}
                onChange={(event) =>
                  setAssigneeFilter(
                    event.target.value,
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {assignees.map((assignee) => (
                  <option
                    key={assignee}
                    value={assignee}
                  >
                    {assignee}
                  </option>
                ))}
              </select>

              <select
                value={labelFilter}
                onChange={(event) =>
                  setLabelFilter(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {labelOptions.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setFavoritesOnly((current) => !current)}
                className={[
                  "rounded-xl border px-5 py-3 font-medium transition",
                  favoritesOnly
                    ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                ⭐ Favorites
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All Statuses");
                  setPriorityFilter(
                    "All Priorities",
                  );
                  setAssigneeFilter(
                    "All Assignees",
                  );
                  setLabelFilter("All Labels");
                  setFavoritesOnly(false);
                  setCurrentPage(1);
                }}
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Clear Filters
              </button>

              <button
                type="button"
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
              >
                Export
              </button>
            </div>
          </div>

          {view === "board" && (
            <KanbanBoard
              tickets={filteredTickets}
              onSelectTicket={setSelectedTicket}
            />
          )}

          {view === "table" && (
            <>
          {selectedTicketIds.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 transition-colors dark:border-indigo-800 dark:bg-indigo-950/40">
              <div>
                <p className="font-semibold text-indigo-900 dark:text-indigo-200">
                  {selectedTicketIds.length} ticket
                  {selectedTicketIds.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                  Choose an action to apply to the
                  selected tickets.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedTicketIds([])
                }
                className="rounded-xl border border-indigo-300 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
              >
                Clear Selection
              </button>
            </div>
          )}

          <TicketTable
            tickets={paginatedTickets}
            sortField={sortField}
            sortDirection={sortDirection}
            selectedTicketIds={selectedTicketIds}
            onSort={handleSort}
            onSelectTicket={setSelectedTicket}
            onToggleTicket={(ticketId) => {
              setSelectedTicketIds(
                (currentIds) =>
                  currentIds.includes(ticketId)
                    ? currentIds.filter(
                        (id) => id !== ticketId,
                      )
                    : [...currentIds, ticketId],
              );
            }}
            onToggleFavorite={(ticket) => {
              updateTicket({
                ...ticket,
                isFavorite: !ticket.isFavorite,
              });
            }}
            onToggleAll={() => {
              const currentPageIds =
                paginatedTickets.map(
                  (ticket) => ticket.id,
                );

              setSelectedTicketIds(
                (currentIds) => {
                  const allCurrentPageSelected =
                    currentPageIds.length > 0 &&
                    currentPageIds.every(
                      (ticketId) =>
                        currentIds.includes(
                          ticketId,
                        ),
                    );

                  if (allCurrentPageSelected) {
                    return currentIds.filter(
                      (ticketId) =>
                        !currentPageIds.includes(
                          ticketId,
                        ),
                    );
                  }

                  return Array.from(
                    new Set([
                      ...currentIds,
                      ...currentPageIds,
                    ]),
                  );
                },
              );
            }}
          />

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {paginatedTickets.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {filteredTickets.length}
              </span>{" "}
              tickets • Page{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
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
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1,
                    ),
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-medium transition",
                  currentPage === totalPages
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-600"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                Next
              </button>
            </div>
          </div>
            </>
          )}
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

          setSelectedTicketIds((currentIds) =>
            currentIds.filter(
              (id) => id !== ticketId,
            ),
          );
        }}
      />
    </>
  );
}