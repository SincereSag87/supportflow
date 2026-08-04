import { useState } from "react";
import toast from "react-hot-toast";
import { useTickets } from "../context/TicketContext";
import type { Ticket, TicketPriority } from "../types/Ticket";
import { useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";

type FormErrors = {
  subject?: string;
  customer?: string;
  assignedTo?: string;
  description?: string;
};

export default function CreateTicket() {
  const [subject, setSubject] = useState("");
  const [customer, setCustomer] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("Medium");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const { addTicket } = useTickets();

  const navigate = useNavigate();

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!subject.trim()) {
      nextErrors.subject = "Subject is required.";
    }

    if (!customer.trim()) {
      nextErrors.customer = "Customer is required.";
    }

    if (!assignedTo.trim()) {
      nextErrors.assignedTo = "Assigned agent is required.";
    }

    if (!description.trim()) {
      nextErrors.description = "Description is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: `TKT-${Date.now()}`,
      subject: subject.trim(),
      customer: customer.trim(),
      assignedTo: assignedTo.trim(),
      status: "Open",
      priority,
      createdAt: now,
      updatedAt: now,
      dueDate: dueDate || null,
      labels,
      watchers: [],
      attachments: [],
      isFavorite: false,
      comments: [],
      timeline: [],
    };

    addTicket(newTicket);
    navigate("/tickets");

    toast.success(`${newTicket.id} created successfully.`);

    setSubject("");
    setCustomer("");
    setAssignedTo("");
    setPriority("Medium");
    setDescription("");
    setDueDate("");
    setLabels([]);
    setErrors({});
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Service Desk
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            Create Ticket
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Create a new support request for a customer.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="ticket-subject"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Subject
              </label>

              <input
                id="ticket-subject"
                type="text"
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);

                  if (errors.subject) {
                    setErrors((current) => ({
                      ...current,
                      subject: undefined,
                    }));
                  }
                }}
                placeholder="Enter ticket subject"
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "subject-error" : undefined
                }
                className={[
                  "w-full rounded-xl border px-4 py-3 outline-none transition dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
                  errors.subject
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-indigo-500 dark:border-slate-700",
                ].join(" ")}
              />

              {errors.subject && (
                <p
                  id="subject-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ticket-customer"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Customer
              </label>

              <input
                id="ticket-customer"
                type="text"
                value={customer}
                onChange={(event) => {
                  setCustomer(event.target.value);

                  if (errors.customer) {
                    setErrors((current) => ({
                      ...current,
                      customer: undefined,
                    }));
                  }
                }}
                placeholder="Customer name"
                aria-invalid={Boolean(errors.customer)}
                aria-describedby={
                  errors.customer ? "customer-error" : undefined
                }
                className={[
                  "w-full rounded-xl border px-4 py-3 outline-none transition dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
                  errors.customer
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-indigo-500 dark:border-slate-700",
                ].join(" ")}
              />

              {errors.customer && (
                <p
                  id="customer-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.customer}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ticket-assignee"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Assigned To
              </label>

              <input
                id="ticket-assignee"
                type="text"
                value={assignedTo}
                onChange={(event) => {
                  setAssignedTo(event.target.value);

                  if (errors.assignedTo) {
                    setErrors((current) => ({
                      ...current,
                      assignedTo: undefined,
                    }));
                  }
                }}
                placeholder="Support agent"
                aria-invalid={Boolean(errors.assignedTo)}
                aria-describedby={
                  errors.assignedTo
                    ? "assigned-to-error"
                    : undefined
                }
                className={[
                  "w-full rounded-xl border px-4 py-3 outline-none transition dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
                  errors.assignedTo
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-indigo-500 dark:border-slate-700",
                ].join(" ")}
              />

              {errors.assignedTo && (
                <p
                  id="assigned-to-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.assignedTo}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="ticket-priority"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Priority
              </label>

              <select
                id="ticket-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as TicketPriority,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="ticket-due-date"
                className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Due Date <span className="text-slate-400">(optional)</span>
              </label>

              <input
                id="ticket-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Labels <span className="text-slate-400">(optional)</span>
              </label>

              <LabelInput labels={labels} onChange={setLabels} />
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="ticket-description"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
            </label>

            <textarea
              id="ticket-description"
              rows={6}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);

                if (errors.description) {
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }));
                }
              }}
              placeholder="Describe the issue..."
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "description-error"
                  : undefined
              }
              className={[
                "w-full rounded-xl border p-4 outline-none transition dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500",
                errors.description
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-indigo-500 dark:border-slate-700",
              ].join(" ")}
            />

            {errors.description && (
              <p
                id="description-error"
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {errors.description}
              </p>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
