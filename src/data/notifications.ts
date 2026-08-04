import type { AppNotification } from "../types/Notification";

function isoAgo(hours: number, minutes = 0): string {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
}

export const notifications: AppNotification[] = [
  {
    id: "ntf-1",
    title: "Critical ticket assigned to you",
    description: "TKT-1041 — Email delivery delay needs attention.",
    time: isoAgo(0, 24),
    read: false,
    ticketId: "TKT-1041",
  },
  {
    id: "ntf-2",
    title: "Ticket overdue",
    description: "TKT-1034 — Billing statement issue passed its due date.",
    time: isoAgo(2),
    read: false,
    ticketId: "TKT-1034",
  },
  {
    id: "ntf-3",
    title: "New comment on a watched ticket",
    description: "TKT-1042 — Unable to access VPN has a new update.",
    time: isoAgo(5),
    read: false,
    ticketId: "TKT-1042",
  },
  {
    id: "ntf-4",
    title: "Ticket escalated",
    description: "TKT-1021 — Support portal login loop was marked urgent.",
    time: isoAgo(9),
    read: true,
    ticketId: "TKT-1021",
  },
  {
    id: "ntf-5",
    title: "Ticket resolved",
    description: "TKT-1030 — VPN certificate expired was marked resolved.",
    time: isoAgo(30),
    read: true,
    ticketId: "TKT-1030",
  },
  {
    id: "ntf-6",
    title: "Weekly summary ready",
    description: "Your team's ticket performance report is ready to view.",
    time: isoAgo(48),
    read: true,
  },
];
