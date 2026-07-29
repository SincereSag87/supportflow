import TicketAnalytics from "../components/TicketAnalytics";

const dashboardCards = [
  {
    title: "Open Tickets",
    value: "128",
    description: "24 new today",
  },
  {
    title: "Assigned to Me",
    value: "16",
    description: "5 high priority",
  },
  {
    title: "Resolved Today",
    value: "42",
    description: "92% SLA compliance",
  },
  {
    title: "Pending Approval",
    value: "7",
    description: "Awaiting manager review",
  },
];

export default function Dashboard() {
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

      <div className="mt-8">
        <TicketAnalytics />
      </div>
    </main>
  );
}