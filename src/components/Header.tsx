import { FaBars, FaPlus, FaSearch } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";
import ProfileMenu from "./ProfileMenu";

type HeaderProps = {
  onMenuClick: () => void;
  onSearchClick: () => void;
};

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: "Welcome back. Here's what's happening today.",
  },
  "/tickets": {
    title: "Tickets",
    subtitle: "Review, assign, and manage support requests.",
  },
  "/tickets/new": {
    title: "Create Ticket",
    subtitle: "Log a new support request.",
  },
  "/customers": {
    title: "Customers",
    subtitle: "Manage customer accounts and ticket activity.",
  },
  "/reports": {
    title: "Reports",
    subtitle: "Service desk performance and ticket trends.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage your profile and preferences.",
  },
};

export default function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const location = useLocation();

  const page = pageTitles[location.pathname] ?? pageTitles["/"];

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-5 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <FaBars />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            {page.title}
          </h1>

          <p className="mt-1 hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            {page.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Open command palette"
          className="relative hidden lg:block"
        >
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <span className="flex w-80 items-center rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-left text-sm text-slate-400 transition dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500">
            Search tickets...
            <kbd className="ml-auto rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
              Ctrl K
            </kbd>
          </span>
        </button>

        <Link
          to="/tickets/new"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 font-medium text-white transition hover:bg-indigo-500 sm:px-5"
        >
          <FaPlus />
          <span className="hidden sm:inline">New Ticket</span>
        </Link>

        <NotificationPanel />

        <ProfileMenu />
      </div>
    </header>
  );
}
