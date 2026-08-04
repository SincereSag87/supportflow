import { useMemo, useState } from "react";
import { useTickets } from "../context/TicketContext";
import CustomerDetails from "../components/CustomerDetails";

export default function Customers() {
  const { tickets } = useTickets();

  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
  useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        tickets: number;
        open: number;
        resolved: number;
      }
    >();

    tickets.forEach((ticket) => {
      if (!map.has(ticket.customer)) {
        map.set(ticket.customer, {
          name: ticket.customer,
          tickets: 0,
          open: 0,
          resolved: 0,
        });
      }

      const customer = map.get(ticket.customer)!;

      customer.tickets++;

      if (
        ticket.status === "Open" ||
        ticket.status === "In Progress" ||
        ticket.status === "Pending"
      ) {
        customer.open++;
      }

      if (
        ticket.status === "Resolved" ||
        ticket.status === "Closed"
      ) {
        customer.resolved++;
      }
    });

    return [...map.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [tickets]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selectedCustomerData =
  customers.find(
    (customer) => customer.name === selectedCustomer,
  ) ?? null;

  const selectedCustomerTickets = tickets.filter(
  (ticket) => ticket.customer === selectedCustomer,
);

  const totalCustomers = customers.length;

  const customersWithActiveTickets = customers.filter(
    (customer) => customer.open > 0,
  ).length;

  const totalActiveTickets = customers.reduce(
    (total, customer) => total + customer.open,
    0,
  );

  const totalResolvedTickets = customers.reduce(
    (total, customer) => total + customer.resolved,
    0,
  );

  return (
    <main className="min-h-screen bg-slate-50 p-8 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            CRM
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Customers
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage customer accounts and monitor ticket activity.
          </p>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Customers
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
              {totalCustomers}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Customers With Active Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">
              {customersWithActiveTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalActiveTickets}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved Tickets
            </p>

            <p className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalResolvedTickets}
            </p>
          </article>
        </div>

        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search customers..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <article
              key={customer.name}
              onClick={() => setSelectedCustomer(customer.name)}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {customer.name}
                </h2>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                  {customer.tickets} Tickets
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Active Tickets
                  </span>

                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {customer.open}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Resolved Tickets
                  </span>

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {customer.resolved}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">
                    Completion Rate
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {customer.tickets === 0
                      ? "0%"
                      : `${Math.round(
                          (customer.resolved /
                            customer.tickets) *
                            100,
                        )}%`}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              No customers found
            </h3>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Try searching with a different customer name.
            </p>
          </div>
        )}
      </div>

      <CustomerDetails
        customerName={selectedCustomer}
        totalTickets={selectedCustomerData?.tickets ?? 0}
        activeTickets={selectedCustomerData?.open ?? 0}
        resolvedTickets={selectedCustomerData?.resolved ?? 0}
        customerTickets={selectedCustomerTickets}
        onClose={() => setSelectedCustomer(null)}
      />
    </main>
  );
}
