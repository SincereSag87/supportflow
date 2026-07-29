import {
  FaChartPie,
  FaChevronDown,
  FaCog,
  FaFileAlt,
  FaPlus,
  FaTicketAlt,
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

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
          S
        </div>

        <div>
          <p className="text-lg font-bold text-slate-900">
            SupportFlow
          </p>

          <p className="text-xs text-slate-500">
            Service management
          </p>
        </div>
      </div>

      <button
        type="button"
        className="mt-7 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Workspace
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            IT Support Team
          </p>
        </div>

        <FaChevronDown className="text-xs text-slate-400" />
      </button>

      <NavLink
        to="/tickets/new"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
      >
        <FaPlus />
        Create ticket
      </NavLink>

      <div className="mt-8">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Service desk
        </p>

        <nav className="mt-3 space-y-1">
          {mainNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        <nav className="mt-3 space-y-1">
          {workspaceNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-5">
        <div className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-slate-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            RW
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              Raymond Wannamaker
            </p>

            <p className="truncate text-xs text-slate-500">
              Support Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}