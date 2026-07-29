import { FaBell, FaPlus, FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search tickets..."
            className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
        >
          <FaPlus />
          New Ticket
        </button>

        <button
          type="button"
          aria-label="Open notifications"
          className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-100"
        >
          <FaBell />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
            RW
          </div>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold text-slate-900">
              Raymond Wannamaker
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}