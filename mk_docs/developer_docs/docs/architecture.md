# System Architecture

This page explains how Digital Logbook is structured — from the folder layout to how data moves through the system.

---

## Folder Structure

The main application lives in the `server/` directory:

```
Digital-Logbook v2/
└── server/
    ├── src/
    │   ├── app/              ← Next.js pages and API routes
    │   │   ├── (auth)/       ← Login and register pages/routes
    │   │   ├── admin/        ← Admin dashboard pages
    │   │   ├── mentor/       ← Mentor dashboard pages
    │   │   └── student/      ← Student dashboard pages
    │   │
    │   ├── components/       ← React UI components
    │   │   ├── admin/        ← Admin-specific components
    │   │   ├── mentor/       ← Mentor-specific components
    │   │   └── ui/           ← Shared UI primitives (shadcn/ui)
    │   │
    │   ├── hooks/            ← Custom React hooks (API calls, state)
    │   ├── lib/              ← Utilities (email, report generation, queue)
    │   ├── middlewares/      ← Auth middleware and middleware chaining
    │   ├── repositories/     ← Database access layer (Prisma queries)
    │   ├── services/         ← Business logic (e.g. registration flow)
    │   ├── utils/            ← Helpers and sidebar config files
    │   └── public/           ← Static assets
    │
    ├── prisma/
    │   ├── schema.prisma     ← Database models and relationships
    │   └── migrations/       ← Migration history
    │
    ├── test/                 ← Jest test files
    ├── Dockerfile
    └── docker-compose.yml
```

---

## How the Layers Work Together

| Layer | Folder | Responsibility |
|---|---|---|
| **UI (Pages)** | `src/app/` | Renders pages, handles routing, calls hooks |
| **Components** | `src/components/` | Reusable UI elements (forms, tables, dialogs) |
| **Hooks** | `src/hooks/` | Fetches data from API, manages local state |
| **API Routes** | `src/app/api/` | Handles HTTP requests, validates input, calls services |
| **Services** | `src/services/` | Implements business rules (e.g. invitation registration) |
| **Repositories** | `src/repositories/` | Runs Prisma queries against the database |
| **Middleware** | `src/middlewares/` | Validates JWT, checks roles, redirects if unauthorized |

---

## Key Modules

### 🛠️ Admin Dashboard
- Analytics overview (user counts, project stats)
- Project management with Kanban board
- User management, invitations, reports

### 📁 Projects
- Create, update, and delete projects
- Assign students and mentors
- View project statistics

### 📨 Invitations
- Send invitation emails with secure tokens
- Bulk upload via Excel file
- Track invitation status (Pending, Accepted, Expired)

### 📊 Reports
- Mentor-generated activity summaries
- Async generation via BullMQ + Redis queue
- Export as CSV

### 👥 Users
- Role-based access (student, mentor, super_admin)
- Status management (active/inactive)
- Filtering and search

### 📋 Activities & Feedback
- Students log their work
- Mentors approve or reject logs with notes
- Used in reporting

### 🔐 Authentication
- JWT stored in HTTP-only cookies
- Role-based redirects after login
- Session expiry handling

---

## Data Flow

Here's how a typical request flows through the system:

```
1. User opens the browser and visits a page (e.g. /admin/projects)
        │
        ▼
2. Next.js middleware checks for a valid JWT cookie
   → If missing/invalid: redirect to /login
   → If valid: continue
        │
        ▼
3. Page component loads and calls a custom React hook
   (e.g. useProjects())
        │
        ▼
4. The hook sends a request to an API route
   (e.g. GET /api/project)
        │
        ▼
5. The API route validates the request and calls a repository
   (e.g. ProjectRepository.getAll())
        │
        ▼
6. The repository runs a Prisma query against PostgreSQL
        │
        ▼
7. Data is returned up the chain → rendered in the browser
```

---

## Related Pages

- [Database Schema](database.md) — Detailed model definitions
- [API Reference](api/overview.md) — All API endpoints
- [Special Logic & Middleware](special-logic.md) — Auth, email, and queue details
