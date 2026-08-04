import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticketFavorite.deleteMany();
  await prisma.ticketWatcher.deleteMany();
  await prisma.ticketAttachment.deleteMany();
  await prisma.ticketTimelineEvent.deleteMany();
  await prisma.ticketComment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Raymond Wannamaker",
      email: "admin@supportflow.dev",
      passwordHash: await hashPassword("AdminPass123!"),
      role: "ADMIN",
    },
  });

  const maya = await prisma.user.create({
    data: {
      name: "Maya Patel",
      email: "maya@supportflow.dev",
      passwordHash: await hashPassword("AgentPass123!"),
      role: "AGENT",
    },
  });

  const chris = await prisma.user.create({
    data: {
      name: "Chris Walker",
      email: "chris@supportflow.dev",
      passwordHash: await hashPassword("AgentPass123!"),
      role: "AGENT",
    },
  });

  const vpnTicket = await prisma.ticket.create({
    data: {
      subject: "Unable to access VPN",
      description: "Customer cannot connect to the corporate VPN client.",
      customer: "Avery Johnson",
      status: "OPEN",
      priority: "HIGH",
      labels: ["vpn", "network"],
      assignedToId: maya.id,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      watchers: { create: [{ userId: admin.id }] },
      favoritedBy: { create: [{ userId: maya.id }] },
      comments: {
        create: [
          {
            comment: "Investigating VPN certificate expiry.",
            authorId: maya.id,
          },
        ],
      },
      timeline: {
        create: [
          {
            title: "Ticket created",
            description: "Customer submitted a support request.",
          },
        ],
      },
    },
  });

  const billingTicket = await prisma.ticket.create({
    data: {
      subject: "Billing statement shows incorrect amount",
      description: "Invoice total does not match the agreed plan pricing.",
      customer: "Drew Coleman",
      status: "IN_PROGRESS",
      priority: "CRITICAL",
      labels: ["billing", "urgent"],
      assignedToId: chris.id,
      watchers: { create: [{ userId: admin.id }, { userId: maya.id }] },
      timeline: {
        create: [
          {
            title: "Ticket created",
            description: "Customer submitted a support request.",
          },
          {
            title: "Ticket escalated",
            description: "Priority changed to Critical.",
          },
        ],
      },
    },
  });

  const onboardingTicket = await prisma.ticket.create({
    data: {
      subject: "New employee laptop setup",
      description: "Provision a laptop and accounts for a new hire.",
      customer: "Morgan Smith",
      status: "RESOLVED",
      priority: "MEDIUM",
      labels: ["onboarding", "hardware"],
      assignedToId: maya.id,
      comments: {
        create: [
          {
            comment: "Laptop imaged and shipped to the new hire.",
            authorId: maya.id,
          },
        ],
      },
    },
  });

  console.log("Seeded users:", { admin: admin.email, maya: maya.email, chris: chris.email });
  console.log(
    "Seeded tickets:",
    [vpnTicket, billingTicket, onboardingTicket].map((t) => t.subject),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
