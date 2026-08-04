import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { tickets as initialTickets } from "../data/tickets";
import type { Ticket } from "../types/Ticket";

const STORAGE_KEY = "supportflow-tickets";

type TicketContextType = {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  updateTicket: (ticket: Ticket) => void;
  deleteTicket: (id: string) => void;
};

const TicketContext = createContext<
  TicketContextType | undefined
>(undefined);

type TicketProviderProps = {
  children: ReactNode;
};

function normalizeTicket(ticket: Partial<Ticket>): Ticket | null {
  if (
    typeof ticket.id !== "string" ||
    typeof ticket.subject !== "string" ||
    typeof ticket.customer !== "string" ||
    typeof ticket.assignedTo !== "string" ||
    typeof ticket.status !== "string" ||
    typeof ticket.priority !== "string"
  ) {
    return null;
  }

  return {
    id: ticket.id,
    subject: ticket.subject,
    customer: ticket.customer,
    assignedTo: ticket.assignedTo,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt ?? new Date().toISOString(),
    updatedAt: ticket.updatedAt ?? new Date().toISOString(),
    dueDate: ticket.dueDate ?? null,
    labels: Array.isArray(ticket.labels) ? ticket.labels : [],
    watchers: Array.isArray(ticket.watchers) ? ticket.watchers : [],
    attachments: Array.isArray(ticket.attachments)
      ? ticket.attachments
      : [],
    isFavorite: ticket.isFavorite ?? false,
    comments: Array.isArray(ticket.comments) ? ticket.comments : [],
    timeline: Array.isArray(ticket.timeline) ? ticket.timeline : [],
  };
}

function loadTickets(): Ticket[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return initialTickets;
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return initialTickets;
    }

    const normalized = parsed
      .map((ticket) => normalizeTicket(ticket))
      .filter((ticket): ticket is Ticket => ticket !== null);

    return normalized.length > 0 ? normalized : initialTickets;
  } catch {
    return initialTickets;
  }
}

export function TicketProvider({
  children,
}: TicketProviderProps) {
  const [tickets, setTickets] =
    useState<Ticket[]>(loadTickets);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  function addTicket(ticket: Ticket) {
    setTickets((currentTickets) => [
      ticket,
      ...currentTickets,
    ]);
  }

  function updateTicket(updatedTicket: Ticket) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket.id === updatedTicket.id
          ? updatedTicket
          : ticket,
      ),
    );
  }

  function deleteTicket(id: string) {
    setTickets((currentTickets) =>
      currentTickets.filter(
        (ticket) => ticket.id !== id,
      ),
    );
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error(
      "useTickets must be used inside a TicketProvider.",
    );
  }

  return context;
}