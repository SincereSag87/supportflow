import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
          RW
        </div>

        <div className="hidden text-left lg:block">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Raymond Wannamaker
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Administrator
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Raymond Wannamaker
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              raymond@example.com
            </p>
          </div>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="mt-2 block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            View Profile
          </Link>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Settings
          </Link>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              toast("Sign-out will be added once accounts exist.");
            }}
            className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
