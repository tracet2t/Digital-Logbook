---
description: "Digital Logbook project conventions. Use when working on any feature: BullMQ queues, oRPC routers, Next.js API routes, Prisma repositories, Zod schemas, TanStack Query hooks, shadcn/ui components, Redis, middleware, or any server-side or client-side code in the Digital Logbook codebase."
applyTo: "server/src/**/*.ts, server/src/**/*.tsx"
---

# Digital Logbook – Project Conventions

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript strict mode
- **API layer (onboarding only)**: oRPC (`@orpc/server`, `@orpc/client`)
- **API layer (all other domains)**: Next.js folder-based API routes (`src/app/api/<domain>/route.ts`)
- **Client data fetching**: TanStack Query (`@tanstack/react-query`)
- **UI components**: shadcn/ui (style: `radix-nova`, icons: `lucide-react`)
- **Notifications**: Sonner (`toast` from `sonner`)
- **Database**: PostgreSQL via Prisma ORM
- **Job queue**: BullMQ backed by Redis (ioredis)
- **Validation**: Zod (all inputs and outputs)
- **Auth**: Session-based via `getSession()` server action

---

## Project Structure

```
src/
  app/api/              # Next.js API routes — one folder per domain (all domains except onboarding)
  app/providers/        # React context providers (QueryClientProvider, etc.)
  _hooks/               # TanStack Query hooks — grouped by domain subfolder
  components/ui/        # shadcn/ui primitive components (never edit directly)
  components/           # Feature/domain components
  lib/                  # Singletons and shared utilities (Redis, Prisma, queues, orpc client)
  routers/              # oRPC procedure definitions (onboarding domain only)
  routers/middleware/   # base context, auth/role middlewares, rate-limit, commonErrors
  repositories/         # Prisma data access, one file per domain
  schemas/              # Zod schemas, one file per domain
  services/             # Business logic services
  worker/               # Long-running BullMQ workers (separate process entry)
```

---

## BullMQ – Queues and Workers

### Queue definition (in `src/lib/`)

- Import Redis via `getRedis()` — **never** instantiate `new Redis()` directly.
- Always set `attempts` and exponential `backoff` in `defaultJobOptions`.
- Export both the `Queue` and `Worker` from the same file.
- Type job data with a discriminated union using a `type` field.

```ts
import { Queue, Worker } from "bullmq";
import { getRedis } from "./redis";

const redis = getRedis();

export const exampleQueue = new Queue("exampleQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  },
});

export type ExampleJobData =
  | { type: "jobTypeA"; payload: string }
  | { type: "jobTypeB"; id: string };

export const exampleWorker = new Worker<ExampleJobData>(
  "exampleQueue",
  async (job) => {
    if (job.data.type === "jobTypeA") {
      /* ... */
    }
    if (job.data.type === "jobTypeB") {
      /* ... */
    }
  },
  { connection: redis },
);
```

- Use `console.log(`[queueName] …`)` for worker log messages.
- Dispatch jobs with `await queue.add("jobTypeName", data)` — job dispatch should not block the response; fire-and-forget if appropriate.

---

## API Layer — Which to Use

| Domain            | API approach                                         |
| ----------------- | ---------------------------------------------------- |
| `onboarding`      | oRPC procedures (`src/routers/onboarding.ts`)        |
| All other domains | Next.js API routes (`src/app/api/<domain>/route.ts`) |

Do **not** add new domains to the oRPC router — use a Next.js API route instead.

---

## Next.js API Routes (`src/app/api/<domain>/route.ts`)

- Export named HTTP handlers: `GET`, `POST`, `PATCH`, `DELETE`.
- Always add `export const dynamic = "force-dynamic"` at the top.
- Authenticate with `getSession()` and return `401`/`403` immediately if invalid.
- Return `NextResponse.json(...)` with appropriate HTTP status codes.
- Catch errors in a `try/catch` and return `{ message: "..." }` with status `500`.

```ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    // ... query prisma ...
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

## oRPC – Routers and Procedures (onboarding domain only)

### Router files (`src/routers/<domain>.ts`)

- One file per domain (e.g., `onboarding.ts`, `user.ts`).
- Register all procedures in `src/routers/index.ts` under the `router` object.
- Instantiate the repository at module level: `const repo = new DomainRepository();`.
- Call `createProcedures()` to get typed procedure builders.

```ts
import { createProcedures } from "@/routers/middleware";
const {
  publicProcedure,
  authedProcedure,
  superAdminProcedure,
  mentorProcedure,
} = createProcedures();
```

### Procedure anatomy

```ts
export const myProcedure = authedProcedure
  .route({
    method: "POST",
    path: "/domain/action",
    summary: "...",
    tags: ["Domain"],
  })
  .errors({ CONFLICT: domainErrors.SOME_ERROR })
  .input(myInputSchema)
  .output(myOutputSchema)
  .handler(async ({ input, context, errors }) => {
    // implementation
  });
```

- Always provide `.route()` with `method`, `path`, `summary`, and `tags`.
- Use `.errors()` to declare domain-specific overrides on top of `commonErrors`.
- `publicProcedure` — unauthenticated, no rate limit.
- `rateLimitedPublicProcedure` — unauthenticated, rate-limited (use for public write endpoints).
- `authedProcedure` — requires valid session.
- `superAdminProcedure` — requires `superAdmin` role.
- `mentorProcedure` — requires `mentor` role.

### Error definitions

- Define domain errors as `const domainErrors = { ... } as const` at the top of the router file.
- `commonErrors` (NOT_FOUND, CONFLICT, UNAUTHORIZED, FORBIDDEN, INVALID_INPUT, INTERNAL_ERROR, RATE_LIMITED) are available on every procedure via `base`.

---

## Zod Schemas (`src/schemas/<domain>.schema.ts`)

- One schema file per domain, named `<domain>.schema.ts`.
- Add `.describe("…")` to every field and to the top-level schema object.
- Export individual schemas; do not export a single object containing all schemas.

```ts
export const createThingSchema = z
  .object({
    name: z.string().min(1, "Name is required").describe("Human-readable name"),
    email: z.string().email().describe("Contact email"),
  })
  .describe("Create a new thing");
```

---

## Repositories (`src/repositories/<domain>_repository_impl.ts`)

- Filename convention: `<domain>_repository_impl.ts` (snake_case).
- Every repository extends `BaseRepository<T>`:

```ts
import BaseRepository from "./baseRepository";
export class DomainRepository extends BaseRepository<DomainModel> {
  constructor() {
    super(prisma.domainModel);
  }
}
```

- `BaseRepository` provides `getAll`, `getById`, `create`, `update`, `delete`.
- Add domain-specific methods for complex queries.
- Use `type` aliases (not interfaces) for local model types; prefer `any` only until proper types are defined.
- Always `orderBy: { createdAt: "desc" }` for list queries unless the domain requires otherwise.

---

## Redis (`src/lib/redis.ts`)

- Access via the singleton: `import { getRedis } from "@/lib/redis"`.
- Always set `maxRetriesPerRequest: null` when creating a Redis connection (required by BullMQ).
- Configure host/port from env vars: `REDIS_HOST`, `REDIS_PORT`.

---

## Prisma (`src/lib/prisma.ts`)

- Import the singleton: `import prisma from "@/lib/prisma"`.
- Never instantiate `new PrismaClient()` outside of `prisma.ts`.

---

## Naming Conventions

| Layer                 | Convention                          | Example                            |
| --------------------- | ----------------------------------- | ---------------------------------- |
| Queue/Worker file     | camelCase                           | `onboardingQueue.ts`               |
| Repository file       | snake_case `_repository_impl`       | `onboarding_repository_impl.ts`    |
| Schema file           | camelCase `<domain>.schema.ts`      | `onboarding.schema.ts`             |
| oRPC router file      | camelCase                           | `onboarding.ts`                    |
| oRPC router index key | camelCase domain                    | `onboarding: { ... }`              |
| Next.js API route     | folder per domain                   | `src/app/api/invitations/route.ts` |
| TanStack hook file    | camelCase `use<Feature>.ts`         | `useProject.ts`                    |
| TanStack hook name    | camelCase `use<Verb><Resource>`     | `useGetProjectTechnologies`        |
| Component file        | PascalCase                          | `MenteeProfileView.tsx`            |
| oRPC client call      | `orpcClient.<domain>.<procedure>()` |                                    |

---

## Client-Side oRPC Usage (onboarding only)

- Client-side: import `orpcClient` from `@/lib/orpc`.
- Server-side (RSC): use `globalThis.$client` set up in `@/lib/orpc.server.ts`.
- Never import `orpc.server.ts` from client components.

---

## TanStack Query

### Provider

`TaskstacktProvider` (in `src/app/providers/queryClientProvider.tsx`) wraps the root layout. It is already set up — do not add another `QueryClientProvider`.

### Custom hooks (`src/_hooks/<domain>/use<Domain>.ts`)

- All data-fetching and mutation logic lives in custom hooks under `src/_hooks/`.
- Group by domain in subfolders: `src/_hooks/admin/`, `src/_hooks/projects/`, `src/_hooks/mentee/`, etc.
- One file per domain, exporting multiple named hooks: `useInvitation.ts` exports `useInvitation`, `useRecentInvitations`, `useDeleteInvitation`, etc.
- Always add `"use client"` at the top of hook files.
- Define request/response interfaces at the top of the file, before the hooks.
- Use `const` arrow functions, not `function` declarations.

#### File structure

```ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ThingRequest { name: string; }
interface ThingResponse { id: string; name: string; }

// ── Hooks ──────────────────────────────────────────────────────────────────────

export const useGetThings = () => { ... };
export const useCreateThing = () => { ... };
export const useDeleteThing = () => { ... };
```

#### `useQuery` pattern

```ts
export const useGetThings = (id: string | null) => {
  return useQuery({
    queryKey: ["things", id],
    queryFn: async () => {
      const res = await fetch(`/api/things?id=${id}`);
      if (!res.ok) throw new Error("Failed to fetch things");
      return res.json();
    },
    enabled: !!id,
  });
};
```

- Use `enabled: !!param` to prevent queries from running when required params are absent.
- Set `staleTime` for data that rarely changes (e.g., session: `10 * 60 * 1000`).
- Use `gcTime` alongside `staleTime` for session/stable data.

#### `useMutation` pattern

```ts
export const useCreateThing = () => {
  const queryClient = useQueryClient();

  return useMutation<ThingResponse, Error, ThingRequest>({
    mutationFn: async (data) => {
      const res = await fetch("/api/things", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create thing");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["things"] });
      toast.success("Thing created");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};
```

- Always type `useMutation<TData, Error, TVariables>` explicitly.
- Parse the error response body (`await res.json()`) before throwing — use `errorData.message` as the error message.
- Always use `queryClient.invalidateQueries` in `onSuccess` to keep the cache fresh.
- Always handle `onError` with a `toast.error()`.
- Use `toast.success()` for user feedback on successful mutations.

#### Query key conventions

| Resource        | Key pattern                     |
| --------------- | ------------------------------- |
| All items       | `["domain"]`                    |
| Single item     | `["domain", id]`                |
| Nested resource | `["domain", parentId, "child"]` |
| Session         | `["session"]` (global, shared)  |

---

## shadcn/ui Components

- All shadcn primitives live in `src/components/ui/` — **never modify these files directly**. Run the shadcn CLI to add or update components.
- Import from `@/components/ui/<component>`.
- The configured style is `radix-nova` with `neutral` base color and CSS variables.
- Icon library is `lucide-react` — always use Lucide icons, not other icon libraries.

### Available components

`alert-dialog`, `alert`, `avatar`, `badge`, `button`, `card`, `checkbox`, `combobox`, `command`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `pagination`, `popover`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `table`, `tabs`, `textarea`, `toast`, `tooltip`

### Usage patterns

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // notifications via Sonner, not the legacy toast hook
```

- Use `<Skeleton />` for loading states, not spinners.
- Use `<Badge>` for status tags (e.g., pending/approved/rejected).
- Use `<Dialog>` for confirmations and detail views; `<Sheet>` for side panels.
- Toast notifications: use `toast.success(...)`, `toast.error(...)` from `sonner` — not `useToast()`.
