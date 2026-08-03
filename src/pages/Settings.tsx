import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ThemePreference = "Light" | "Dark" | "System";
type DefaultPage = "Dashboard" | "Tickets" | "Customers" | "Reports";
type SavedSettings = {
  name: string;
  email: string;
  jobTitle: string;
  emailNotifications: boolean;
  desktopNotifications: boolean;
  soundAlerts: boolean;
  theme: ThemePreference;
  compactMode: boolean;
  defaultPage: DefaultPage;
  ticketsPerPage: string;
  autoRefresh: string;
};

export default function Settings() {
  const [name, setName] = useState("Raymond Wannamaker");
  const [email, setEmail] = useState("raymond@example.com");
  const [jobTitle, setJobTitle] = useState(
    "Application Support Specialist",
  );

  const [emailNotifications, setEmailNotifications] =
    useState(true);
  const [desktopNotifications, setDesktopNotifications] =
    useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const [theme, setTheme] =
    useState<ThemePreference>("System");
  const [compactMode, setCompactMode] = useState(false);

  const [defaultPage, setDefaultPage] =
    useState<DefaultPage>("Dashboard");
  const [ticketsPerPage, setTicketsPerPage] = useState("10");
  const [autoRefresh, setAutoRefresh] = useState("5");

  useEffect(() => {
  const savedSettings = localStorage.getItem(
    "supportflow-settings",
  );

  if (!savedSettings) {
    return;
  }

  try {
    const parsedSettings =
      JSON.parse(savedSettings) as SavedSettings;

    setName(parsedSettings.name);
    setEmail(parsedSettings.email);
    setJobTitle(parsedSettings.jobTitle);
    setEmailNotifications(
      parsedSettings.emailNotifications,
    );
    setDesktopNotifications(
      parsedSettings.desktopNotifications,
    );
    setSoundAlerts(parsedSettings.soundAlerts);
    setTheme(parsedSettings.theme);
    setCompactMode(parsedSettings.compactMode);
    setDefaultPage(parsedSettings.defaultPage);
    setTicketsPerPage(parsedSettings.ticketsPerPage);
    setAutoRefresh(parsedSettings.autoRefresh);
  } catch {
    localStorage.removeItem("supportflow-settings");
  }
}, []);

  function handleSave() {
    const settings: SavedSettings = {
      name: name.trim(),
      email: email.trim(),
      jobTitle: jobTitle.trim(),
      emailNotifications,
      desktopNotifications,
      soundAlerts,
      theme,
      compactMode,
      defaultPage,
      ticketsPerPage,
      autoRefresh,
    };
    localStorage.setItem("supportflow-settings", JSON.stringify(settings));
    toast.success("Settings saved successfully.");
  }

  return (
    <main className="p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Preferences
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your profile, notifications, appearance, and
            application preferences.
          </p>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your personal and professional information.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="settings-name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="settings-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="settings-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="settings-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="settings-job-title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Job Title
                </label>

                <input
                  id="settings-job-title"
                  type="text"
                  value={jobTitle}
                  onChange={(event) =>
                    setJobTitle(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Choose how SupportFlow should notify you.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Email Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Receive ticket updates and daily summaries by
                    email.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(event) =>
                    setEmailNotifications(event.target.checked)
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Desktop Notifications
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Show browser notifications for important ticket
                    activity.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={desktopNotifications}
                  onChange={(event) =>
                    setDesktopNotifications(
                      event.target.checked,
                    )
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Sound Alerts
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Play a sound when critical tickets are assigned.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(event) =>
                    setSoundAlerts(event.target.checked)
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Appearance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customize how SupportFlow looks and feels.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="settings-theme"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Theme
                </label>

                <select
                  id="settings-theme"
                  value={theme}
                  onChange={(event) =>
                    setTheme(
                      event.target.value as ThemePreference,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="Light">Light</option>
                  <option value="Dark">Dark</option>
                  <option value="System">System</option>
                </select>
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">
                    Compact Mode
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Reduce spacing to show more information.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(event) =>
                    setCompactMode(event.target.checked)
                  }
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Application Preferences
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure your default SupportFlow experience.
              </p>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <label
                  htmlFor="settings-default-page"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Default Page
                </label>

                <select
                  id="settings-default-page"
                  value={defaultPage}
                  onChange={(event) =>
                    setDefaultPage(
                      event.target.value as DefaultPage,
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="Dashboard">Dashboard</option>
                  <option value="Tickets">Tickets</option>
                  <option value="Customers">Customers</option>
                  <option value="Reports">Reports</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="settings-tickets-per-page"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Tickets Per Page
                </label>

                <select
                  id="settings-tickets-per-page"
                  value={ticketsPerPage}
                  onChange={(event) =>
                    setTicketsPerPage(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="settings-auto-refresh"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Auto-Refresh
                </label>

                <select
                  id="settings-auto-refresh"
                  value={autoRefresh}
                  onChange={(event) =>
                    setAutoRefresh(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500"
                >
                  <option value="0">Off</option>
                  <option value="1">Every minute</option>
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Security
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage account security and sign-in preferences.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  toast("Password management will be added later.")
                }
                className="rounded-xl border border-slate-300 px-5 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Change Password
              </button>

              <button
                type="button"
                onClick={() =>
                  toast(
                    "Two-factor authentication will be added later.",
                  )
                }
                className="rounded-xl border border-slate-300 px-5 py-3 text-left font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Configure Two-Factor Authentication
              </button>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}