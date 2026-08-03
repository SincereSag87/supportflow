import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { tickets as initialTickets } from "../data/tickets";
import type { Ticket } from "../types/Ticket";

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

export function TicketProvider({
  children,
}: TicketProviderProps) {
  const [tickets, setTickets] =
    useState<Ticket[]>(initialTickets);

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