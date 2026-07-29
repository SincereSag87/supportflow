import type { TicketComment } from "../types/TicketComment";

export const ticketComments: TicketComment[] = [
  {
    id: 1,
    author: "Raymond Wannamaker",
    comment:
      "Investigating authentication logs. Initial review suggests a VPN certificate issue.",
    time: "10 minutes ago",
  },
  {
    id: 2,
    author: "Sarah Lee",
    comment:
      "Escalated to the Infrastructure team for additional review.",
    time: "35 minutes ago",
  },
  {
    id: 3,
    author: "Michael Adams",
    comment:
      "Customer confirmed the issue still occurs after restarting the VPN client.",
    time: "1 hour ago",
  },
];