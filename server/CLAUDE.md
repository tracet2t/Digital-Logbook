# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Digital-Logbook** is a full-stack mentorship and learning management platform built with Next.js 14, TypeScript, Prisma, and PostgreSQL. It enables structured tracking of learning activities, mentor feedback, project management, and performance analytics.

### Key Features

- Activity logging with time tracking and technology tags
- Mentor feedback system with approval/rejection workflows
- Bulk reporting (PDF/Excel export)
- User invitations with email notifications
- Badge gamification system
- Background job processing with BullMQ
- File storage with MinIO
- Role-based access control (Student, Mentor, Super Admin)

## Commands

### Development

```bash
npm run dev                # Start dev server at http://localhost:3000
npm run build             # Build for production
npm run start             # Start production server
npm run lint              # Run ESLint
npm run worker:dev        # Run BullMQ worker in watch mode
npm run db:studio         # Open Prisma Studio (GUI database browser)
```

### Database

```bash
npm run migrate:maindb    # Run migrations on development database
npm run migrate:testdb    # Run migrations on test database
npm run db:reset          # Drop, migrate, and seed database
npm run seed              # Seed database with initial data (prisma/seed.mjs)
```

### Testing & CI

```bash
npm run test              # Run Jest tests in isolation mode (-i flag)
npm run ci                # Run linting, type check, and tests (CI pipeline)
```

### Code Generation

```bash
npm run generate          # Generate Prisma client types
```

### Running in Docker

```bash
docker-compose up         # Start all services (uses docker-compose.yml from parent directory)
docker-compose down       # Stop all services
```

## Project Structure

### Core Directories

**`src/routers/`** — oRPC procedure definitions

- `invitations.ts` — Send, validate, and manage user invitations
- `onboarding.ts` — Application creation and status management
- `index.ts` — Main router combining all procedures

**`src/app/api/`** — Next.js API routes (REST endpoints)

- `(auth)/` — Authentication (login, logout, register, password reset)
- `rpc/[...all]/` — oRPC catch-all handler that routes all RPC calls
- Individual route modules: `activity/`, `feedback/`, `mentor/`, `student/`, `admin/`, etc.

**`src/repositories/`** — Data access layer (Prisma abstractions)

- `activity_repository_impl.ts` — Activity CRUD operations
- `invitation_repository_impl.ts` — Invitation management
- `onboarding_repository_impl.ts` — Application processing
- Others follow the `{domain}_repository_impl.ts` naming convention

**`src/components/`** — React components

- Admin, mentor, and student dashboard components
- Shared UI components for forms, dialogs, and displays

**`src/lib/`** — Utilities and configurations

- `prisma.ts` — Prisma client singleton
- `redis.ts` — Redis connection
- `minio.ts` — MinIO file storage client
- `queues/` — BullMQ queue definitions (invitations, onboarding, reports)
- `reportGenerator.ts` — CSV/PDF report generation
- `emailNotifications.ts` — Email template and notification logic
- `bulkUploadValidation.ts` — Bulk invitation validation schema

**`src/worker/`** — Background job processing

- `index.ts` — BullMQ workers for:
  - Email sending (invitations, confirmations)
  - Report generation
  - Onboarding notifications

**`src/middlewares/`** — Authentication and authorization

- Middleware for session validation and role checking

**`prisma/`** — Database

- `schema.prisma` — Prisma data model (User, Activity, MentorFeedback, Report, Badge, etc.)
- `seed.mjs` — Seed script for initial data
- `migrations/` — Database migrations (auto-generated)

## Architecture & Key Patterns

### oRPC Framework

- **Location**: `src/routers/` and `src/app/api/rpc/[...all]/route.ts`
- **Pattern**: End-to-end type-safe RPC using oRPC (@orpc packages)
- Procedures are defined in `src/routers/*.ts` and composed in `src/routers/index.ts`
- The oRPC handler (RPCHandler) in `src/app/api/rpc/[...all]/route.ts` processes all RPC calls
- Three procedure types handled by middleware:
  - `publicProcedure` — No authentication required
  - `authedProcedure` — Requires valid JWT session
  - `superAdminProcedure` — Requires super admin role

### Authentication

- **Session Management**: JWT tokens stored in context via `getSession()` from `src/server_actions/getSession`
- **Middleware**: Role-based checks in `src/routers/middleware/`
- Login/register via `src/app/api/(auth)/` routes

### Background Jobs (BullMQ)

- Queues defined in `src/lib/queues/`
- Workers in `src/worker/index.ts`
- Separate Docker container runs the worker process
- Job types:
  - `invitationQueue` — Email invitations
  - `onboardingQueue` — Confirmation emails
  - `reportQueue` — Report generation

### File Storage

- **MinIO**: Configured in `src/lib/minio.ts`
- Used for storing articles, media, and generated reports
- Docker service runs MinIO with persistent volume

### Database

- **ORM**: Prisma 5.19.1
- **Database**: PostgreSQL 16
- **Connection**: Singleton pattern via `src/lib/prisma.ts`
- Models: User, Activity, MentorFeedback, Report, Badge, Project, Invitation, etc.
- Relationships handle multi-role scenarios (students, mentors, admins)

### Email Notifications

- **Provider**: Nodemailer with Gmail App Passwords
- **Templates**: React components in `src/components/EmailTemplate/`
- **Queue**: Async via BullMQ to prevent blocking

## Testing

### Setup

- **Framework**: Jest (config in `jest.config.ts`)
- **Environment**: jsdom for DOM testing
- **Test database**: Separate test env with `.env.test`

### Running Tests

```bash
npm run test                    # Run all tests
npm run migrate:testdb          # Prepare test database before running
```

### Pattern

- Tests should use the test database (see `package.json` for `dotenv -e .env.test` pattern)
- Integration tests hitting real database over mocked database

## Environment Variables

### Required (see `.env.example`)

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `REDIS_HOST` / `REDIS_PORT` — Redis connection
- `EMAIL_USER` / `EMAIL_PASS` — Gmail credentials (App Password)
- `NIC_SSH_PUB_KEY_B64` / `NIC_SSH_PRIV_KEY_B64` — RSA keys (base64-encoded) for NIC encryption

### Optional (Docker/MinIO)

- `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` — MinIO credentials
- `MINIO_BUCKET` / `MINIO_PUBLIC_URL` — MinIO storage config

## Node & Package Manager

- **Node.js**: 22.7.0 (see `.nvmrc`)
- **npm**: 10.8.2
- **Compatibility**: Enforce via `engines` in `package.json`

## Development Workflow

### Adding a New API Procedure

1. Create procedure in `src/routers/{domain}.ts` (see `_example.router.ts`)
2. Import and compose in `src/routers/index.ts`
3. Use middleware (publicProcedure, authedProcedure, superAdminProcedure)
4. Define input schema with Zod for type safety
5. Return typed response

### Adding a Database Model

1. Update `prisma/schema.prisma`
2. Create migration: `npm run migrate:maindb`
3. Create repository in `src/repositories/{domain}_repository_impl.ts`
4. Use Prisma client from `src/lib/prisma`

### Adding Background Jobs

1. Define job data type in `src/lib/queues/{queue}.ts`
2. Add queue export from `src/lib/queue.ts`
3. Enqueue in API route/procedure
4. Add worker handler in `src/worker/index.ts`

## Deployment

### Docker Setup

- Services defined in `docker-compose.yml` (parent directory)
- Next.js app: Custom `Dockerfile` (single server)
- Worker: Separate `Dockerfile.worker` (background jobs)
- Postgres, Redis, MinIO all containerized

### Production Build

```bash
npm run build    # Creates optimized Next.js output
npm run start    # Runs production server
```

## Key Dependencies

### Framework & Runtime

- `next` 14.2.5 — React framework with built-in API routes
- `react` 18 — UI library
- `typescript` 5.5.4 — Type safety

### Data & API

- `@orpc/server` — oRPC server implementation
- `@orpc/react` — oRPC client hooks
- `@tanstack/react-query` — Data fetching and caching
- `@prisma/client` 5.19.1 — ORM
- `zod` 3.24.4 — Schema validation

### Infrastructure

- `redis` (via ioredis 5.4.1) — Session/cache store
- `bullmq` 5.12.14 — Job queue
- `minio` 8.0.7 — S3-compatible storage
- `postgresql` — Primary database

### UI & Styling

- `tailwindcss` 3.4.1 — Utility-first CSS
- `@radix-ui/*` — Headless UI components
- `lucide-react` — Icon library
- `react-hook-form` — Form state management
- `react-big-calendar` — Calendar component
- `sonner` / `react-hot-toast` — Toast notifications

### Email & Reports

- `nodemailer` 6.9.15 — Email sending
- `json2csv` — CSV export
- `jspdf` — PDF generation
- `xlsx` — Excel export

### Authentication

- `jose` 5.8.0 — JWT handling
- `bcrypt` — Password hashing

## Important Notes

- **Type Safety**: This project is fully TypeScript. Use proper types, don't use `any`.
- **oRPC Procedures**: All external API calls go through oRPC in `src/routers/`, not ad-hoc REST endpoints.
- **Session Context**: Authentication context is available in procedures via `context.session` and middleware.
- **Email Delays**: Email sending is async via BullMQ; don't expect immediate delivery.
- **Test Database**: Always migrate test database before running `npm run test`.
- **RPC Handler**: The single RPC endpoint at `/api/rpc` handles all procedure calls via `RPCHandler`.
