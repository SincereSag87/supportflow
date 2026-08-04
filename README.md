# 🚀 SupportFlow

## 🌐 Live Demo

[View SupportFlow on Vercel](https://supportflow-woad.vercel.app/)

A modern IT Service Desk application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, backed by a standalone **Node/Express + PostgreSQL** API.

SupportFlow is a portfolio project that demonstrates enterprise-style ticket management, customer management, reporting dashboards, and application settings similar to commercial platforms such as Jira, Zendesk, Freshservice, and ServiceNow.

> **Note:** The live demo runs on the frontend's local, browser-persisted sample data. The backend API described below (`server/`) is a separate, standalone service — it is not yet wired up to the deployed UI.

---

## 📸 Application

### UI & UX
- Dark mode (system-aware, with a manual override in Settings)
- Responsive mobile navigation with a slide-out sidebar
- User profile menu
- Notification center with unread badges
- Command palette (`Ctrl`/`Cmd` + `K`) for jumping to pages or tickets

### Dashboard
- KPI cards (open, assigned to me, resolved, critical)
- Ticket status chart
- Recent tickets
- Status breakdown
- SLA compliance widget
- Team workload widget
- Monthly trend chart (created vs. resolved)
- Performance metrics (avg. resolution time, resolved this month, resolution rate)

### Ticket Management
- Create tickets
- Ticket details drawer with internal comments and activity timeline
- Labels/tags
- Watchers
- Due dates with overdue flagging
- Favorites
- File attachments (metadata)
- Kanban board with drag-and-drop, alongside the sortable/filterable table view
- Search, status/priority/assignee/label filters, favorites filter, pagination, row selection, sorting

### Customers
- Customer dashboard
- Customer search
- Customer statistics
- Customer details panel
- Customer ticket history

### Reports
- Dashboard metrics
- Ticket status pie chart
- Ticket priority bar chart
- Top customers
- Agent workload

### Settings
- Profile settings
- Notification preferences
- Appearance settings (theme, compact mode)
- Application preferences
- Local storage persistence, with a reset-to-sample-data control

### Backend API (standalone)
- Express + TypeScript REST API in `server/`
- PostgreSQL via Prisma ORM
- JWT authentication (register/login) with bcrypt-hashed passwords
- Role-based permissions (`ADMIN` / `AGENT`)
- Ticket CRUD, comments, watchers, and favorites, backed by real relational data
- See [`server/README.md`](server/README.md) for setup and the full API reference

---

# 🛠 Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- React Hot Toast
- Context API

**Backend**
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT (jsonwebtoken) + bcryptjs
- Zod (request validation)
- Docker Compose (local Postgres)

---

# 📂 Project Structure

```
src/                  # Frontend (Vite + React)
│
├── components/
├── context/
├── data/
├── hooks/
├── lib/
├── pages/
├── types/
│
├── App.tsx
├── main.tsx
└── index.css

server/               # Backend API (standalone, not yet wired to the frontend)
│
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── schemas/
│   └── lib/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose.yml
└── Dockerfile
```

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/SincereSag87/supportflow.git
```

Enter the project

```bash
cd supportflow
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

Open your browser

```
http://localhost:5173
```

## Backend API (optional)

The frontend above runs entirely on local sample data and doesn't require the backend. To run the standalone API and try it against a real database, see [`server/README.md`](server/README.md).

---

# 📦 Build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🚀 Deployment

SupportFlow's frontend is configured for deployment on **Vercel**.

The project includes:

- Vite
- SPA Routing
- `vercel.json`

Deployment is automatic through GitHub integration.

The backend (`server/`) is not deployed — it's a standalone service intended for local development and API-level testing, with a `Dockerfile` ready for a future hosting decision.

---

# ✨ Future Improvements

- Wire the frontend to the backend API (replace local storage with real requests, working login, protected routes)
- Email integration
- Knowledge base
- Audit logs
- File attachment storage (currently metadata only)
- CI/CD pipeline
- Production database and custom domain

---

# 📈 Version History

## v2.0.0

Major UI and backend expansion.

### Features
- Dark mode, mobile navigation, notification center, command palette, profile menu
- Ticket labels, watchers, due dates, favorites, attachments, Kanban board
- SLA, team workload, monthly trend, and performance dashboard widgets
- Standalone Express + PostgreSQL + Prisma API with JWT auth and role-based permissions

## v1.0.0

Initial public release.

### Features

- Dashboard
- Ticket Management
- Customer Management
- Reports
- Settings
- Analytics
- Comments
- Timeline
- Pagination
- Filtering
- Sorting

---

# 👨‍💻 Author

**Raymond Wannamaker**

GitHub

https://github.com/SincereSag87

---

# 📄 License

This project is licensed under the MIT License.
