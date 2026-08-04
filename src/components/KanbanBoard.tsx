import { useState, type DragEvent } from "react";
import type { Ticket, TicketStatus } from "../types/Ticket";
import { useTickets } from "../context/TicketContext";
import KanbanCard from "./KanbanCard";

const columns: TicketStatus[] = [
  "Open",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];

const columnStyles: Record<TicketStatus, string> = {
  Open: "border-t-blue-500",
  "In Progress": "border-t-amber-500",
  Pending: "border-t-slate-400",
  Resolved: "border-t-emerald-500",
  Closed: "border-t-slate-800 dark:border-t-slate-500",
};

type KanbanBoardProps = {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
};

export default function KanbanBoard({
  tickets,
  onSelectTicket,
}: KanbanBoardProps) {
  const { updateTicket } = useTickets();
  const [dragOverColumn, setDragOverColumn] = useState<TicketStatus | null>(
    null,
  );

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    ticket: Ticket,
  ) {
    event.dataTransfer.setData("text/plain", ticket.id);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, status: TicketStatus) {
    event.preventDefault();
    setDragOverColumn(null);

    const ticketId = event.dataTransfer.getData("text/plain");
    const ticket = tickets.find((current) => current.id === ticketId);

    if (!ticket || ticket.status === status) {
      return;
    }

    updateTicket({
      ...ticket,
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((status) => {
        const columnTickets = tickets.filter(
          (ticket) => ticket.status === status,
        );

        return (
          <div
            key={status}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverColumn(status);
            }}
            onDragLeave={() =>
              setDragOverColumn((current) =>
                current === status ? null : current,
              )
            }
            onDrop={(event) => handleDrop(event, status)}
            className={[
              "flex w-72 shrink-0 flex-col rounded-2xl border-t-4 bg-slate-100 p-3 transition-colors dark:bg-slate-900/60",
              columnStyles[status],
              dragOverColumn === status ? "ring-2 ring-indigo-400" : "",
            ].join(" ")}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {status}
              </h3>

              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {columnTickets.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
              {columnTickets.map((ticket) => (
                <KanbanCard
                  key={ticket.id}
                  ticket={ticket}
                  onSelect={onSelectTicket}
                  onDragStart={handleDragStart}
                />
              ))}

              {columnTickets.length === 0 && (
                <p className="rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
                  No tickets
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
