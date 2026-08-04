export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  ticketId?: string;
}
