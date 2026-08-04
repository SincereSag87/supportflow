# SupportFlow API (Phase 2 backend)

Standalone Express + PostgreSQL (Prisma) + JWT API. Not yet wired to the frontend — verify it with `curl` or any REST client.

## Setup

```bash
docker compose up -d        # starts local Postgres on :5432
cp .env.example .env        # then set a real JWT_SECRET
npm install
npx prisma migrate dev      # creates the schema
npm run db:seed             # seeds users + sample tickets
npm run dev                 # starts the API on :4000
```

## Seeded accounts

| Role  | Email                 | Password       |
| ----- | --------------------- | -------------- |
| Admin | admin@supportflow.dev | AdminPass123!  |
| Agent | maya@supportflow.dev  | AgentPass123!  |
| Agent | chris@supportflow.dev | AgentPass123!  |

## API

All routes except `/health`, `/api/auth/register`, and `/api/auth/login` require `Authorization: Bearer <token>` (returned by register/login).

- `POST /api/auth/register` `{ name, email, password }` → creates an `AGENT` account
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me`
- `GET /api/tickets` — query params: `status`, `priority`, `assignedToId`, `label`, `favoritesOnly=true`, `search`
- `POST /api/tickets` `{ subject, customer, description?, priority?, assignedToId?, dueDate?, labels? }`
- `GET /api/tickets/:id`
- `PATCH /api/tickets/:id` — any subset of the create fields, plus `status`
- `DELETE /api/tickets/:id` — **ADMIN only**
- `POST /api/tickets/:id/comments` `{ comment }`
- `PATCH` / `DELETE /api/tickets/:id/comments/:commentId` — comment author or **ADMIN** only
- `PUT /api/tickets/:id/favorite` — toggles the caller's own favorite
- `PUT /api/tickets/:id/watchers/:userId` — toggles that user as a watcher
- `GET /api/users`
- `PATCH /api/users/:id/role` `{ role: "ADMIN" | "AGENT" }` — **ADMIN only**

## Notes

- Ticket attachments are metadata only (name/size/type) — no file bytes are stored in this phase.
- `Dockerfile` builds a production image but does not auto-run migrations on boot; run `npx prisma migrate deploy` as an explicit deploy step.
