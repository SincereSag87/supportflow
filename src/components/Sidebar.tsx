import {
  FaChartPie,
  FaChevronDown,
  FaCog,
  FaFileAlt,
  FaPlus,
  FaTicketAlt,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const mainNavigation = [
  {
    label: "Overview",
    path: "/",
    icon: <FaChartPie />,
  },
  {
    label: "Tickets",
    path: "/tickets",
    icon: <FaTicketAlt />,
  },
  {
    label: "Customers",
    path: "/customers",
    icon: <FaUsers />,
  },
];

const workspaceNavigation = [
  {
    label: "Reports",
    path: "/reports",
    icon: <FaFileAlt />,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: <FaCog />,
  },
];

type SidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-xl transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
              S
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                SupportFlow
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Service management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <FaTimes />
          </button>
        </div>

        <button
          type="button"
          className="mt-7 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Workspace
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
              IT Support Team
            </p>
          </div>

          <FaChevronDown className="text-xs text-slate-400 dark:text-slate-500" />
        </button>

        <NavLink
          to="/tickets/new"
          onClick={onClose}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        >
          <FaPlus />
          Create ticket
        </NavLink>

        <div className="mt-8">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Service desk
          </p>

          <nav className="mt-3 space-y-1">
            {mainNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  ].join(" ")
                }
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base dark:bg-slate-800">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Workspace
          </p>

          <nav className="mt-3 space-y-1">
            {workspaceNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                  ].join(" ")
                }
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base dark:bg-slate-800">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              RW
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                Raymond Wannamaker
              </p>

              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Support Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
