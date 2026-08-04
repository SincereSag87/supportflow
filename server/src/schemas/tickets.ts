import { z } from "zod";

export const ticketStatusEnum = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "PENDING",
  "RESOLVED",
  "CLOSED",
]);

export const ticketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const createTicketSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().default(""),
  customer: z.string().trim().min(1).max(200),
  priority: ticketPriorityEnum.optional().default("MEDIUM"),
  assignedToId: z.string().cuid().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  labels: z.array(z.string().trim().min(1).max(40)).optional().default([]),
});

export const updateTicketSchema = z
  .object({
    subject: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(5000).optional(),
    customer: z.string().trim().min(1).max(200).optional(),
    status: ticketStatusEnum.optional(),
    priority: ticketPriorityEnum.optional(),
    assignedToId: z.string().cuid().nullable().optional(),
    dueDate: z.coerce.date().nullable().optional(),
    labels: z.array(z.string().trim().min(1).max(40)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const listTicketsQuerySchema = z.object({
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  assignedToId: z.string().optional(),
  label: z.string().optional(),
  favoritesOnly: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
});

export const createCommentSchema = z.object({
  comment: z.string().trim().min(1).max(5000),
});

export const updateCommentSchema = z.object({
  comment: z.string().trim().min(1).max(5000),
});
