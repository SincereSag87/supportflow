import { useMemo } from "react";
import TicketAnalytics from "../components/TicketAnalytics";
import { useTickets } from "../context/TicketContext";
import RecentTickets from "../components/RecentTickets";
import TicketStatusBreakdown from "../components/TicketStatusBreakdown";

export default function Dashboard() {
  const { tickets } = useTickets();

  const dashboardCards = useMemo(() => {
    const openTickets = tickets.filter(
      (ticket) => ticket.status === "Open",
    ).length;

    const assignedToMe = tickets.filter(
      (ticket) =>
        ticket.assignedTo === "Raymond Wannamaker" &&
        ticket.status !== "Closed",
    ).length;

    const resolvedTickets = tickets.filter(
      (ticket) => ticket.status === "Resolved",
    ).length;

    const criticalTickets = tickets.filter(
      (ticket) => ticket.priority === "Critical",
    ).length;

    return [
      {
        title: "Open Tickets",
        value: openTickets,
        description: `${tickets.length} total tickets`,
      },
      {
        title: "Assigned to Me",
        value: assignedToMe,
        description: "Active tickets assigned to you",
      },
      {
        title: "Resolved",
        value: resolvedTickets,
        description: "Tickets marked as resolved",
      },
      {
        title: "Critical Priority",
        value: criticalTickets,
        description: "Tickets requiring immediate attention",
      },
    ];
  }, [tickets]);

  return (
    <main className="p-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              {card.value}
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <TicketAnalytics />

        <div className="grid gap-8">
        <RecentTickets />
        <TicketStatusBreakdown />
        </div>
      </div>
    </main>
  );
}