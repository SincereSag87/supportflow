export type TicketStatus =
  | "Open"
  | "In Progress"
  | "Pending"
  | "Resolved"
  | "Closed";

export type TicketPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  assignedTo: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
}