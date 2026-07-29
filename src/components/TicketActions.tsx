type TicketActionsProps = {
  onAssign: () => void;
  onResolve: () => void;
  onEscalate: () => void;
  onCloseTicket: () => void;
};

export default function TicketActions({
  onAssign,
  onResolve,
  onEscalate,
  onCloseTicket,
}: TicketActionsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Quick Actions
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onAssign}
          className="rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500"
        >
          Assign
        </button>

        <button
          type="button"
          onClick={onResolve}
          className="rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-500"
        >
          Resolve
        </button>

        <button
          type="button"
          onClick={onEscalate}
          className="rounded-xl bg-amber-500 px-4 py-3 font-medium text-white transition hover:bg-amber-400"
        >
          Escalate
        </button>

        <button
          type="button"
          onClick={onCloseTicket}
          className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white transition hover:bg-red-500"
        >
          Close Ticket
        </button>
      </div>
    </div>
  );
}