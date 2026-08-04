import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaCog,
  FaFileAlt,
  FaPlus,
  FaTicketAlt,
  FaUsers,
} from "react-icons/fa";
import { useTickets } from "../context/TicketContext";

type PaletteResult = {
  id: string;
  label: string;
  sublabel?: string;
  icon: ReactNode;
  onSelect: () => void;
};

const pages = [
  { label: "Dashboard", path: "/", icon: <FaChartPie /> },
  { label: "Tickets", path: "/tickets", icon: <FaTicketAlt /> },
  { label: "Create Ticket", path: "/tickets/new", icon: <FaPlus /> },
  { label: "Customers", path: "/customers", icon: <FaUsers /> },
  { label: "Reports", path: "/reports", icon: <FaFileAlt /> },
  { label: "Settings", path: "/settings", icon: <FaCog /> },
];

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();
  const { tickets } = useTickets();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery]);

  const pageResults: PaletteResult[] = useMemo(() => {
    return pages
      .filter((page) =>
        page.label.toLowerCase().includes(normalizedQuery),
      )
      .map((page) => ({
        id: `page-${page.path}`,
        label: page.label,
        sublabel: "Page",
        icon: page.icon,
        onSelect: () => navigate(page.path),
      }));
  }, [normalizedQuery, navigate]);

  const ticketResults: PaletteResult[] = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return [];
    }

    return tickets
      .filter((ticket) =>
        [ticket.id, ticket.subject, ticket.customer]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 6)
      .map((ticket) => ({
        id: `ticket-${ticket.id}`,
        label: ticket.subject,
        sublabel: `${ticket.id} · ${ticket.customer}`,
        icon: <FaTicketAlt />,
        onSelect: () => navigate("/tickets"),
      }));
  }, [normalizedQuery, tickets, navigate]);

  const results = [...pageResults, ...ticketResults];

  function handleSelect(result: PaletteResult) {
    result.onSelect();
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 pt-24"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((current) =>
                Math.min(current + 1, results.length - 1),
              );
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((current) => Math.max(current - 1, 0));
            }

            if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              handleSelect(results[activeIndex]);
            }
          }}
          placeholder="Search pages and tickets..."
          className="w-full border-b border-slate-200 px-5 py-4 text-slate-900 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              No matches found.
            </p>
          ) : (
            results.map((result, index) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setActiveIndex(index)}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition",
                  index === activeIndex
                    ? "bg-indigo-50 dark:bg-indigo-950/40"
                    : "",
                ].join(" ")}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {result.icon}
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">
                    {result.label}
                  </span>

                  {result.sublabel && (
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {result.sublabel}
                    </span>
                  )}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          ↑↓ to navigate · Enter to select · Esc to close
        </div>
      </div>
    </div>
  );
}
