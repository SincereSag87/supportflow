import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ticketComments } from "../data/ticketComments";
import { ticketTimeline } from "../data/ticketTimeline";
import type { Ticket } from "../types/Ticket";
import type { TicketComment } from "../types/TicketComment";
import TicketActions from "./TicketActions";

type TicketDetailsProps = {
  ticket: Ticket | null;
  onClose: () => void;
  onUpdateTicket: (ticket: Ticket) => void;
};

export default function TicketDetails({
  ticket,
  onClose,
  onUpdateTicket,
}: TicketDetailsProps) {
  const [comments, setComments] =
    useState<TicketComment[]>(ticketComments);

  const [newComment, setNewComment] = useState("");

  const [editingCommentId, setEditingCommentId] =
    useState<number | null>(null);

  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setComments(ticketComments);
    setNewComment("");
    setEditingCommentId(null);
    setEditingText("");
  }, [ticket]);

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
    const updatedTicket: Ticket = {
      ...currentTicket,
      assignedTo: "Raymond Wannamaker",
      status: 
        currentTicket.status === "Open" 
          ? "In Progress" 
          : currentTicket.status,
      updatedAt: "Just now",
    };

    onUpdateTicket(updatedTicket);
    toast.success(`${currentTicket.id} assigned to Raymond Wannamaker.`);
  }

  function handleResolve() {
    const updatedTicket: Ticket = {
      ...currentTicket,
      status: "Resolved",
      updatedAt: "Just now",
    };

    onUpdateTicket(updatedTicket);
    toast.success(`${currentTicket.id} marked as resolved.`);
  }

  function handleEscalate() {
    const updatedTicket: Ticket = {
      ...currentTicket,
      priority: "Critical",
      updatedAt: "Just now",
    };

    onUpdateTicket(updatedTicket);

    toast(`${currentTicket.id} escalated to Critical priority.`, {
      icon: "⚠️",
    });
  }

  function handleCloseTicket() {
    const updatedTicket: Ticket = {
      ...currentTicket,
      status: "Closed",
      updatedAt: "Just now",
    };

    onUpdateTicket(updatedTicket);
    toast.success(`${currentTicket.id} has been closed.`);
  }

  function handleAddComment() {
    const trimmedComment = newComment.trim();

    if (!trimmedComment) {
      toast.error("Please enter a comment.");
      return;
    }

    const comment: TicketComment = {
      id: Date.now(),
      author: "Raymond Wannamaker",
      comment: trimmedComment,
      time: "Just now",
    };

    setComments((currentComments) => [
      comment,
      ...currentComments,
    ]);

    setNewComment("");
    toast.success("Comment added.");
  }

  function handleDeleteComment(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    setComments((currentComments) =>
      currentComments.filter((comment) => comment.id !== id),
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

    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              comment: trimmedText,
              time: "Edited just now",
            }
          : comment,
      ),
    );

    setEditingCommentId(null);
    setEditingText("");
    toast.success("Comment updated.");
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-sm text-slate-500">
            Ticket
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {ticket.id}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close ticket details"
          className="rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-100"
        >
          ✕
        </button>
      </div>

      <div className="h-[calc(100vh-81px)] space-y-6 overflow-y-auto p-6">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Subject
          </p>

          <p className="mt-1 text-slate-900">
            {ticket.subject}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              {customerInitials}
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                {ticket.customer}
              </h3>

              <p className="text-sm text-slate-500">
                Enterprise Customer
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Ticket</p>
              <p className="font-semibold text-slate-900">
                {ticket.id}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Priority</p>
              <p className="font-semibold text-slate-900">
                {ticket.priority}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Status</p>
              <p className="font-semibold text-slate-900">
                {ticket.status}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Assigned</p>
              <p className="font-semibold text-slate-900">
                {ticket.assignedTo}
              </p>
            </div>
          </div>
        </div>

        <TicketActions
          onAssign={handleAssign}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          onCloseTicket={handleCloseTicket}
        />

        <div>
          <p className="text-sm font-semibold text-slate-500">
            Last Updated
          </p>

          <p className="mt-1 text-slate-900">
            {ticket.updatedAt}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-500">
            Activity
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Recent updates for this ticket.
          </p>

          <div className="mt-5 space-y-5">
            {ticketTimeline.map((event, index) => (
              <div
                key={event.id}
                className="relative flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <span className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />

                  {index < ticketTimeline.length - 1 && (
                    <span className="mt-2 h-full w-px bg-slate-200" />
                  )}
                </div>

                <div className="pb-5">
                  <p className="font-semibold text-slate-900">
                    {event.title}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {event.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Internal Comments
            </p>

            <p className="mt-1 text-sm text-slate-400">
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
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {comment.author}
                          </p>

                          <p className="text-xs text-slate-400">
                            {comment.time}
                          </p>
                        </div>

                        {!isEditing && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleStartEdit(comment)
                              }
                              className="rounded-lg px-2 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteComment(comment.id)
                              }
                              className="rounded-lg px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
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
                            className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-indigo-500"
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
                              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {comment.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <textarea
              value={newComment}
              onChange={(event) =>
                setNewComment(event.target.value)
              }
              rows={4}
              placeholder="Add an internal comment..."
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-indigo-500"
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