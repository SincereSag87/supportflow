import { useEffect, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import { FaPaperclip, FaRegStar, FaStar, FaTimes } from "react-icons/fa";
import type { Ticket, TicketAttachment } from "../types/Ticket";
import type { TicketComment } from "../types/TicketComment";
import TicketActions from "./TicketActions";
import LabelInput from "./LabelInput";
import { agents } from "../data/agents";
import {
  formatDueDate,
  formatRelativeTime,
  isOverdue,
} from "../lib/formatDate";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type TicketDetailsProps = {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
};

export default function TicketDetails({
  ticket,
  onClose,
  onUpdateTicket,
  onDeleteTicket,
}: TicketDetailsProps) {
  const [comments, setComments] =
    useState<TicketComment[]>([]);

  const [newComment, setNewComment] = useState("");

  const [editingCommentId, setEditingCommentId] =
    useState<number | null>(null);

  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if(!ticket){
      return;
    }

    setComments(ticket.comments);
    setNewComment("");
    setEditingCommentId(null);
    setEditingText("");
  }, [ticket?.id]);

  if (!ticket) {
    return null;
  }

  const currentTicket = ticket;

  const customerInitials = currentTicket.customer
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function handleAssign() {
    updateTicketWithTimeline(
      {
        assignedTo: "Raymond Wannamaker",
        status:
          currentTicket.status === "Open"
            ? "In Progress"
            : currentTicket.status,
      },
      "Ticket assigned",
      "Assigned to Raymond Wannamaker.",
    );

    toast.success(
      `${currentTicket.id} assigned to Raymond Wannamaker.`,
    );
  }

  function handleResolve() {
    updateTicketWithTimeline(
      {
        status: "Resolved",
      },
      "Ticket resolved",
      "Resolved by Raymond Wannamaker",
    );

    toast.success(
      `${currentTicket.id} marked as resolved.`,
    );
  }

  function handleEscalate() {
    updateTicketWithTimeline(
      {
        priority: "Critical",
      },
      "Ticket escalated",
      "Priority changed to Critical.",
    );

    toast(`${currentTicket.id} escalated to Critical priority.`, {
      icon: "⚠️",
    });
  }

  function handleCloseTicket() {
  updateTicketWithTimeline(
    {
      status: "Closed",
    },
    "Ticket closed",
    "Closed by Raymond Wannamaker.",
  );

  toast.success(`${currentTicket.id} has been closed.`);
}

  function updateTicketWithTimeline(
  updates: Partial<Ticket>,
  title: string,
  description: string,
) {
  const now = new Date().toISOString();

  const timelineEvent = {
    id: Date.now(),
    title,
    description,
    time: now,
  };

  const updatedTicket: Ticket = {
    ...currentTicket,
    ...updates,
    updatedAt: now,
    timeline: [
      timelineEvent,
      ...currentTicket.timeline,
    ],
  };

  onUpdateTicket(updatedTicket);
}

  function saveComments(updatedComments: TicketComment[]) {
  setComments(updatedComments);

  onUpdateTicket({
    ...currentTicket,
    comments: updatedComments,
    updatedAt: new Date().toISOString(),
  });
}

  function handleDeleteTicket() {
  const confirmed = window.confirm(
    `Are you sure you want to permanently delete ${currentTicket.id}?`,
  );

  if (!confirmed) {
    return;
  }

  onDeleteTicket(currentTicket.id);
  toast.success(`${currentTicket.id} deleted successfully.`);
}

  function handleToggleFavorite() {
    onUpdateTicket({
      ...currentTicket,
      isFavorite: !currentTicket.isFavorite,
    });
  }

  function handleDueDateChange(value: string) {
    onUpdateTicket({
      ...currentTicket,
      dueDate: value || null,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleLabelsChange(labels: string[]) {
    onUpdateTicket({
      ...currentTicket,
      labels,
      updatedAt: new Date().toISOString(),
    });
  }

  function handleToggleWatcher(agent: string) {
    const isWatching = currentTicket.watchers.includes(agent);

    onUpdateTicket({
      ...currentTicket,
      watchers: isWatching
        ? currentTicket.watchers.filter((watcher) => watcher !== agent)
        : [...currentTicket.watchers, agent],
      updatedAt: new Date().toISOString(),
    });
  }

  function handleAddAttachment(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const newAttachments: TicketAttachment[] = Array.from(files).map(
      (file) => ({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        type: file.type || "file",
        uploadedAt: new Date().toISOString(),
      }),
    );

    onUpdateTicket({
      ...currentTicket,
      attachments: [...currentTicket.attachments, ...newAttachments],
      updatedAt: new Date().toISOString(),
    });

    event.target.value = "";
    toast.success("Attachment added.");
  }

  function handleRemoveAttachment(id: string) {
    onUpdateTicket({
      ...currentTicket,
      attachments: currentTicket.attachments.filter(
        (attachment) => attachment.id !== id,
      ),
      updatedAt: new Date().toISOString(),
    });
  }

  function handleAddComment() {
  const trimmedComment = newComment.trim();

  if (trimmedComment.length === 0) {
    toast.error("Please enter a comment.");
    return;
  }

  const timestamp = Date.now();
  const now = new Date(timestamp).toISOString();

  const newTicketComment: TicketComment = {
    id: timestamp,
    author: "Raymond Wannamaker",
    comment: trimmedComment,
    time: now,
  };

  const updatedComments = [
    newTicketComment,
    ...currentTicket.comments,
  ];

  const updatedTicket: Ticket = {
    ...currentTicket,
    comments: updatedComments,
    timeline: [
      {
        id: timestamp + 1,
        title: "Internal comment added",
        description:
          "Raymond Wannamaker added an internal comment.",
        time: now,
      },
      ...currentTicket.timeline,
    ],
    updatedAt: now,
  };

  setComments(updatedComments);
  setNewComment("");
  onUpdateTicket(updatedTicket);

  toast.success("Comment added.");
}

  function handleDeleteComment(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    saveComments(
      comments.filter((comment) => comment.id !== id),
    );

    if (editingCommentId === id) {
      setEditingCommentId(null);
      setEditingText("");
    }

    toast.success("Comment deleted.");
  }

  function handleStartEdit(comment: TicketComment) {
    setEditingCommentId(comment.id);
    setEditingText(comment.comment);
  }

  function handleCancelEdit() {
    setEditingCommentId(null);
    setEditingText("");
  }

  function handleSaveEdit(id: number) {
    const trimmedText = editingText.trim();

    if (!trimmedText) {
      toast.error("Comment cannot be empty.");
      return;
    }

    saveComments(
      comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              comment: trimmedText,
              time: new Date().toISOString(),
            }
          : comment,
        ),
    );

    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment updated.");
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-200 bg-white shadow-2xl transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ticket
          </p>

          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {ticket.id}
            </h2>

            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-label={
                ticket.isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className="text-amber-400 transition hover:text-amber-500"
            >
              {ticket.isFavorite ? <FaStar /> : <FaRegStar />}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close ticket details"
          className="rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      <div className="h-[calc(100vh-81px)] space-y-6 overflow-y-auto p-6">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Subject
          </p>

          <p className="mt-1 text-slate-900 dark:text-white">
            {ticket.subject}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              {customerInitials}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {ticket.customer}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Enterprise Customer
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Ticket</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {ticket.id}
              </p>
            </div>

            <div>
              <p className="text-slate-500 dark:text-slate-400">Priority</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {ticket.priority}
              </p>
            </div>

            <div>
              <p className="text-slate-500 dark:text-slate-400">Status</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {ticket.status}
              </p>
            </div>

            <div>
              <p className="text-slate-500 dark:text-slate-400">Assigned</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {ticket.assignedTo}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Due Date
          </p>

          <div className="flex items-center gap-3">
            <input
              type="date"
              value={ticket.dueDate ?? ""}
              onChange={(event) =>
                handleDueDateChange(event.target.value)
              }
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />

            {isOverdue(ticket.dueDate) && (
              <span className="whitespace-nowrap rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                Overdue
              </span>
            )}
          </div>

          {ticket.dueDate && (
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Due {formatDueDate(ticket.dueDate)}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Labels
          </p>

          <LabelInput
            labels={ticket.labels}
            onChange={handleLabelsChange}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Watchers
          </p>

          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => {
              const isWatching = ticket.watchers.includes(agent);

              return (
                <button
                  key={agent}
                  type="button"
                  onClick={() => handleToggleWatcher(agent)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    isWatching
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  {agent}
                </button>
              );
            })}
          </div>
        </div>

        <TicketActions
          onAssign={handleAssign}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          onCloseTicket={handleCloseTicket}
        />
        <button
          type="button"
          onClick={handleDeleteTicket}
          disabled={ticket.status === "Closed"}
          className={[
            "w-full rounded-xl border px-4 py-3 font-medium transition",
            ticket.status === "Closed"
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500"
            : "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 dark:hover:border-red-800 dark:hover:bg-red-950/60",
          ].join(" ")}
        >
          Delete Ticket
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Last Updated
          </p>

          <p className="mt-1 text-slate-900 dark:text-white">
            {formatRelativeTime(ticket.updatedAt)}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Activity
          </p>

          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Recent updates for this ticket.
          </p>

          <div className="mt-5 space-y-5">
            {currentTicket.timeline.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                No activity has been recorded for this ticket yet.
              </p>
            )}

            {currentTicket.timeline.map((event, index) => (
              <div
                key={event.id}
                className="relative flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />

                  {index < currentTicket.timeline.length - 1 && (
                    <span className="mt-2 h-full w-px bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>

                <div className="pb-5">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {event.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {event.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                    {formatRelativeTime(event.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Attachments
          </p>

          <div className="mt-3 space-y-2">
            {currentTicket.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5 dark:border-slate-700"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <FaPaperclip className="shrink-0 text-slate-400 dark:text-slate-500" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {attachment.name}
                    </p>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                  aria-label={`Remove ${attachment.name}`}
                  className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>

          <label className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <FaPaperclip />
            Add attachment
            <input
              type="file"
              multiple
              onChange={handleAddAttachment}
              className="hidden"
            />
          </label>
        </div>

        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Internal Comments
            </p>

            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Private notes shared between support staff.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {comments.map((comment) => {
              const initials = comment.author
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isEditing =
                editingCommentId === comment.id;

              return (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {comment.author}
                          </p>

                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatRelativeTime(comment.time)}
                          </p>
                        </div>

                        {!isEditing && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleStartEdit(comment)
                              }
                              className="rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteComment(comment.id)
                              }
                              className="rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-3">
                          <textarea
                            value={editingText}
                            onChange={(event) =>
                              setEditingText(event.target.value)
                            }
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveEdit(comment.id)
                              }
                              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {comment.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <textarea
              value={newComment}
              onChange={(event) =>
                setNewComment(event.target.value)
              }
              rows={4}
              placeholder="Add an internal comment..."
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
            />

            <button
              type="button"
              onClick={handleAddComment}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-500"
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}