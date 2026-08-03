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

export interface TicketComment {
  id: number;
  author: string;
  comment: string;
  time: string;
}

export interface TicketTimelineEvent {
  id: number;
  title: string;
  description: string;
  time: string;
}

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  assignedTo: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: string;
  comments: TicketComment[];
  timeline: TicketTimelineEvent[];
}