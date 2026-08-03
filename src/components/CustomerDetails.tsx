import type { Ticket } from "../types/Ticket";

type CustomerDetailsProps = {
  customerName: string | null;
  totalTickets: number;
  activeTickets: number;
  resolvedTickets: number;
  customerTickets: Ticket[];
  onClose: () => void;
};

export default function CustomerDetails({
  customerName,
  totalTickets,
  activeTickets,
  resolvedTickets,
  customerTickets,
  onClose,
}: CustomerDetailsProps) {
  if (!customerName) {
    return null;
  }

  const initials = customerName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-sm text-slate-500">
            Customer
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {customerName}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close customer details"
          className="rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <div className="h-[calc(100vh-81px)] space-y-6 overflow-y-auto p-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">
              {initials}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {customerName}
              </h3>

              <p className="text-sm text-slate-500">
                Enterprise Customer
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">
            Customer Statistics
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-500">
                Total Tickets
              </span>

              <span className="font-semibold text-slate-900">
                {totalTickets}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Active Tickets
              </span>

              <span className="font-semibold text-amber-600">
                {activeTickets}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Resolved Tickets
              </span>

              <span className="font-semibold text-emerald-600">
                {resolvedTickets}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">
                Resolution Rate
              </span>

              <span className="font-semibold text-slate-900">
                {totalTickets === 0
                  ? "0%"
                  : `${Math.round(
                      (resolvedTickets / totalTickets) * 100,
                    )}%`}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900">
            Customer Tickets
          </h3>

          <div className="mt-5 space-y-3">
            {customerTickets.length === 0 ? (
              <p className="text-sm text-slate-500">
                No tickets found.
              </p>
            ) : (
              customerTickets.map((ticket) => (
                <article
                  key={ticket.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">
                      {ticket.id}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {ticket.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {ticket.subject}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span>
                      Assigned: {ticket.assignedTo}
                    </span>

                    <span>{ticket.priority}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}