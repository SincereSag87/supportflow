import type { DragEvent } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import type { Ticket } from "../types/Ticket";

const priorityStyles = {
  Low: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  Medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

type KanbanCardProps = {
  ticket: Ticket;
  onSelect: (ticket: Ticket) => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, ticket: Ticket) => void;
};

export default function KanbanCard({
  ticket,
  onSelect,
  onDragStart,
}: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, ticket)}
      onClick={() => onSelect(ticket)}
      className="cursor-grab rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {ticket.id}
        </p>

        {ticket.isFavorite ? (
          <FaStar className="text-amber-400" />
        ) : (
          <FaRegStar className="text-slate-300 dark:text-slate-600" />
        )}
      </div>

      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
        {ticket.subject}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {ticket.customer}
      </p>

      {ticket.labels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ticket.labels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${priorityStyles[ticket.priority]}`}
        >
          {ticket.priority}
        </span>

        <span className="text-xs text-slate-400 dark:text-slate-500">
          {ticket.assignedTo}
        </span>
      </div>
    </div>
  );
}
