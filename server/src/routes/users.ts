import { Router } from "express";
import { prisma } from "../lib/prisma";
import { toPublicUser } from "../lib/serialize";
import { asyncHandler, HttpError } from "../middleware/errorHandler";
import { requireAuth, requireRole } from "../middleware/auth";
import { updateRoleSchema } from "../schemas/users";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
    res.json({ users: users.map(toPublicUser) });
  }),
);

usersRouter.patch(
  "/:id/role",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { role } = updateRoleSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      throw new HttpError(404, "User not found.");
    }

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });

    res.json({ user: toPublicUser(updated) });
  }),
);
