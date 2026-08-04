import type { Ticket, TicketPriority, TicketStatus } from "../types/Ticket";

const STATUSES: TicketStatus[] = [
  "Open",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];

const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Critical"];

export function getStatusBreakdown(tickets: Ticket[]) {
  return STATUSES.map((status) => ({
    status,
    count: tickets.filter((ticket) => ticket.status === status).length,
  }));
}

export function getPriorityBreakdown(tickets: Ticket[]) {
  return PRIORITIES.map((priority) => ({
    priority,
    count: tickets.filter((ticket) => ticket.priority === priority).length,
  }));
}

export type AgentWorkload = {
  name: string;
  total: number;
  active: number;
  completed: number;
};

export function getAgentWorkload(tickets: Ticket[]): AgentWorkload[] {
  const agentMap = new Map<string, AgentWorkload>();

  tickets.forEach((ticket) => {
    const agent = agentMap.get(ticket.assignedTo) ?? {
      name: ticket.assignedTo,
      total: 0,
      active: 0,
      completed: 0,
    };

    agent.total += 1;

    if (
      ticket.status === "Open" ||
      ticket.status === "In Progress" ||
      ticket.status === "Pending"
    ) {
      agent.active += 1;
    }

    if (ticket.status === "Resolved" || ticket.status === "Closed") {
      agent.completed += 1;
    }

    agentMap.set(ticket.assignedTo, agent);
  });

  return [...agentMap.values()].sort(
    (left, right) => right.total - left.total,
  );
}

export type CustomerSummary = {
  name: string;
  total: number;
  active: number;
  resolved: number;
};

export function getTopCustomers(
  tickets: Ticket[],
  limit = 5,
): CustomerSummary[] {
  const customerMap = new Map<string, CustomerSummary>();

  tickets.forEach((ticket) => {
    const customer = customerMap.get(ticket.customer) ?? {
      name: ticket.customer,
      total: 0,
      active: 0,
      resolved: 0,
    };

    customer.total += 1;

    if (
      ticket.status === "Open" ||
      ticket.status === "In Progress" ||
      ticket.status === "Pending"
    ) {
      customer.active += 1;
    }

    if (ticket.status === "Resolved" || ticket.status === "Closed") {
      customer.resolved += 1;
    }

    customerMap.set(ticket.customer, customer);
  });

  return [...customerMap.values()]
    .sort((left, right) => right.total - left.total)
    .slice(0, limit);
}

export const SLA_HOURS: Record<TicketPriority, number> = {
  Critical: 4,
  High: 24,
  Medium: 72,
  Low: 120,
};

export function getSlaCompliance(tickets: Ticket[]) {
  const relevant = tickets.filter(
    (ticket) => ticket.status === "Resolved" || ticket.status === "Closed",
  );

  if (relevant.length === 0) {
    return { met: 0, breached: 0, total: 0, percent: 100 };
  }

  let met = 0;

  relevant.forEach((ticket) => {
    const targetHours = SLA_HOURS[ticket.priority];

    const elapsedHours =
      (new Date(ticket.updatedAt).getTime() -
        new Date(ticket.createdAt).getTime()) /
      (60 * 60 * 1000);

    if (elapsedHours <= targetHours) {
      met += 1;
    }
  });

  return {
    met,
    breached: relevant.length - met,
    total: relevant.length,
    percent: Math.round((met / relevant.length) * 100),
  };
}

export function getOverdueCount(tickets: Ticket[]): number {
  const today = new Date().toISOString().slice(0, 10);

  return tickets.filter(
    (ticket) =>
      ticket.dueDate !== null &&
      ticket.dueDate < today &&
      ticket.status !== "Resolved" &&
      ticket.status !== "Closed",
  ).length;
}

export type MonthlyTrendPoint = {
  month: string;
  created: number;
  resolved: number;
};

export function getMonthlyTrend(
  tickets: Ticket[],
  months = 6,
): MonthlyTrendPoint[] {
  const now = new Date();

  const buckets: MonthlyTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i -= 1) {
    const bucketDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

    buckets.push({
      month: bucketDate.toLocaleDateString(undefined, { month: "short" }),
      created: 0,
      resolved: 0,
    });
  }

  function bucketIndexFor(date: Date) {
    const monthsAgo =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());

    const index = months - 1 - monthsAgo;

    return index >= 0 && index < months ? index : null;
  }

  tickets.forEach((ticket) => {
    const createdIndex = bucketIndexFor(new Date(ticket.createdAt));

    if (createdIndex !== null) {
      buckets[createdIndex].created += 1;
    }

    if (ticket.status === "Resolved" || ticket.status === "Closed") {
      const resolvedIndex = bucketIndexFor(new Date(ticket.updatedAt));

      if (resolvedIndex !== null) {
        buckets[resolvedIndex].resolved += 1;
      }
    }
  });

  return buckets;
}

export function getPerformanceMetrics(tickets: Ticket[]) {
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "Resolved" || ticket.status === "Closed",
  );

  const resolutionRate =
    tickets.length === 0
      ? 0
      : Math.round((resolvedTickets.length / tickets.length) * 100);

  const avgResolutionHours =
    resolvedTickets.length === 0
      ? 0
      : Math.round(
          resolvedTickets.reduce((total, ticket) => {
            const hours =
              (new Date(ticket.updatedAt).getTime() -
                new Date(ticket.createdAt).getTime()) /
              (60 * 60 * 1000);

            return total + hours;
          }, 0) / resolvedTickets.length,
        );

  const now = new Date();

  const resolvedThisMonth = resolvedTickets.filter((ticket) => {
    const resolvedDate = new Date(ticket.updatedAt);

    return (
      resolvedDate.getFullYear() === now.getFullYear() &&
      resolvedDate.getMonth() === now.getMonth()
    );
  }).length;

  return {
    resolutionRate,
    avgResolutionHours,
    resolvedThisMonth,
  };
}
