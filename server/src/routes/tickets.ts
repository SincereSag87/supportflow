import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { toPublicUser } from "../lib/serialize";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import {
  createCommentSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  updateCommentSchema,
  updateTicketSchema,
} from "../schemas/tickets";

export const ticketsRouter = Router();

ticketsRouter.use(requireAuth);

const ticketInclude = {
  assignedTo: true,
  watchers: { include: { user: true } },
  favoritedBy: true,
  comments: {
    include: { author: true },
    orderBy: { createdAt: "desc" as const },
  },
  timeline: { orderBy: { createdAt: "desc" as const } },
  attachments: true,
} satisfies Prisma.TicketInclude;

type TicketWithRelations = Prisma.TicketGetPayload<{
  include: typeof ticketInclude;
}>;

function serializeTicket(ticket: TicketWithRelations, currentUserId: string) {
  return {
    id: ticket.id,
    subject: ticket.subject,
    description: ticket.description,
    customer: ticket.customer,
    status: ticket.status,
    priority: ticket.priority,
    dueDate: ticket.dueDate,
    labels: ticket.labels,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    assignedTo: ticket.assignedTo ? toPublicUser(ticket.assignedTo) : null,
    watchers: ticket.watchers.map((watcher) => toPublicUser(watcher.user)),
    isFavorite: ticket.favoritedBy.some(
      (favorite) => favorite.userId === currentUserId,
    ),
    comments: ticket.comments.map((comment) => ({
      id: comment.id,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: toPublicUser(comment.author),
    })),
    timeline: ticket.timeline,
    attachments: ticket.attachments,
  };
}

async function findTicketOr404(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: ticketInclude,
  });

  if (!ticket) {
    throw new HttpError(404, "Ticket not found.");
  }

  return ticket;
}

ticketsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listTicketsQuerySchema.parse(req.query);

    const where: Prisma.TicketWhereInput = {
      status: query.status,
      priority: query.priority,
      assignedToId: query.assignedToId,
      labels: query.label ? { has: query.label } : undefined,
      favoritedBy:
        query.favoritesOnly === "true"
          ? { some: { userId: req.user!.id } }
          : undefined,
      OR: query.search
        ? [
            { subject: { contains: query.search, mode: "insensitive" } },
            { customer: { contains: query.search, mode: "insensitive" } },
          ]
        : undefined,
    };

    const tickets = await prisma.ticket.findMany({
      where,
      include: ticketInclude,
      orderBy: { updatedAt: "desc" },
    });

    res.json({
      tickets: tickets.map((ticket) => serializeTicket(ticket, req.user!.id)),
    });
  }),
);

ticketsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const ticket = await findTicketOr404(req.params.id);
    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = createTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.create({
      data: {
        ...data,
        timeline: {
          create: [
            {
              title: "Ticket created",
              description: "Ticket submitted to the service desk.",
            },
          ],
        },
      },
      include: ticketInclude,
    });

    res.status(201).json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const data = updateTicketSchema.parse(req.body);

    await findTicketOr404(req.params.id);

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data,
      include: ticketInclude,
    });

    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await findTicketOr404(req.params.id);
    await prisma.ticket.delete({ where: { id: req.params.id } });
    res.status(204).send();
  }),
);

ticketsRouter.put(
  "/:id/favorite",
  asyncHandler(async (req, res) => {
    await findTicketOr404(req.params.id);

    const existing = await prisma.ticketFavorite.findUnique({
      where: {
        ticketId_userId: { ticketId: req.params.id, userId: req.user!.id },
      },
    });

    if (existing) {
      await prisma.ticketFavorite.delete({
        where: {
          ticketId_userId: { ticketId: req.params.id, userId: req.user!.id },
        },
      });
    } else {
      await prisma.ticketFavorite.create({
        data: { ticketId: req.params.id, userId: req.user!.id },
      });
    }

    const ticket = await findTicketOr404(req.params.id);
    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.put(
  "/:id/watchers/:userId",
  asyncHandler(async (req, res) => {
    await findTicketOr404(req.params.id);

    const targetUser = await prisma.user.findUnique({
      where: { id: req.params.userId },
    });

    if (!targetUser) {
      throw new HttpError(404, "User not found.");
    }

    const existing = await prisma.ticketWatcher.findUnique({
      where: {
        ticketId_userId: {
          ticketId: req.params.id,
          userId: req.params.userId,
        },
      },
    });

    if (existing) {
      await prisma.ticketWatcher.delete({
        where: {
          ticketId_userId: {
            ticketId: req.params.id,
            userId: req.params.userId,
          },
        },
      });
    } else {
      await prisma.ticketWatcher.create({
        data: { ticketId: req.params.id, userId: req.params.userId },
      });
    }

    const ticket = await findTicketOr404(req.params.id);
    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.post(
  "/:id/comments",
  asyncHandler(async (req, res) => {
    const { comment } = createCommentSchema.parse(req.body);

    await findTicketOr404(req.params.id);

    await prisma.ticketComment.create({
      data: {
        comment,
        ticketId: req.params.id,
        authorId: req.user!.id,
      },
    });

    const ticket = await findTicketOr404(req.params.id);
    res.status(201).json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

async function findCommentOr404(ticketId: string, commentId: string) {
  const comment = await prisma.ticketComment.findFirst({
    where: { id: commentId, ticketId },
  });

  if (!comment) {
    throw new HttpError(404, "Comment not found.");
  }

  return comment;
}

ticketsRouter.patch(
  "/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    const { comment: text } = updateCommentSchema.parse(req.body);

    const comment = await findCommentOr404(req.params.id, req.params.commentId);

    if (comment.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
      throw new HttpError(403, "You can only edit your own comments.");
    }

    await prisma.ticketComment.update({
      where: { id: comment.id },
      data: { comment: text },
    });

    const ticket = await findTicketOr404(req.params.id);
    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);

ticketsRouter.delete(
  "/:id/comments/:commentId",
  asyncHandler(async (req, res) => {
    const comment = await findCommentOr404(req.params.id, req.params.commentId);

    if (comment.authorId !== req.user!.id && req.user!.role !== "ADMIN") {
      throw new HttpError(403, "You can only delete your own comments.");
    }

    await prisma.ticketComment.delete({ where: { id: comment.id } });

    const ticket = await findTicketOr404(req.params.id);
    res.json({ ticket: serializeTicket(ticket, req.user!.id) });
  }),
);
