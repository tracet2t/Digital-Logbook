# 🚀 oRPC Beginner's Guide - Complete Explanation

## 📖 Table of Contents

1. [What is oRPC?](#what-is-orpc)
2. [Why Use oRPC?](#why-use-orpc)
3. [Your Implementation Explained](#your-implementation-explained)
4. [How to Use It](#how-to-use-it)
5. [OpenAPI Documentation](#openapi-documentation)
6. [Common Patterns](#common-patterns)

---

## What is oRPC?

**oRPC** = **o**bject **RPC** (Remote Procedure Call)

Think of it as **calling server functions directly from your client code**, but with:

- ✅ **Full TypeScript type safety**
- ✅ **Automatic validation**
- ✅ **No manual API endpoint creation**
- ✅ **Runtime safety with Zod schemas**

### Traditional REST API vs oRPC

#### ❌ Old Way (REST API):

```typescript
// SERVER: Create API endpoint manually
// File: app/api/onboarding/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // Manual validation
  if (!body.email)
    return Response.json({ error: "Email required" }, { status: 400 });

  const result = await createApplication(body);
  return Response.json(result);
}

// CLIENT: Call with fetch
const response = await fetch("/api/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    fullName: "John Doe",
  }),
});
const data = await response.json();
// ❌ No type safety - you don't know what's in 'data'
```

#### ✅ New Way (oRPC):

```typescript
// SERVER: Define procedure once
export const createApplication = os
  .input(
    z.object({
      email: z.string().email(),
      fullName: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    // input is fully typed!
    return await createApplication(input);
  });

// CLIENT: Call like a function!
const result = await orpcClient.onboarding.createApplication({
  email: "test@example.com",
  fullName: "John Doe",
});
// ✅ Full type safety - TypeScript knows exact structure
// ✅ Autocomplete works
// ✅ Validation happens automatically
```

---

## Why Use oRPC?

### 1. **Type Safety Across Network Boundary**

```typescript
// If you change this on server...
export const getUser = os
  .output(z.object({
    name: z.string(),
    age: z.number() // Changed from string to number
  }))
  .handler(...)

// TypeScript will ERROR on client immediately!
const user = await orpcClient.getUser();
console.log(user.age.toUpperCase()); // ❌ ERROR: number has no toUpperCase
```

### 2. **No Manual API Routes**

- One RPC handler (`/api/rpc/[...all]/route.ts`) handles ALL procedures
- No need to create separate files for each endpoint

### 3. **Automatic Validation**

- Input validated with Zod before handler runs
- Output validated before sending to client
- Type-safe errors

---

## Your Implementation Explained

### 📁 File Structure

```
server/src/
├── routers/                      ← Business logic (procedures)
│   ├── index.ts                  ← Combines all routers
│   └── onboarding.ts             ← Onboarding procedures
│
├── schemas/                      ← Zod validation schemas
│   └── onboarding.schema.ts
│
├── lib/
│   └── orpc.ts                   ← Client for browser
│
├── _hooks/
│   └── onboarding/
│       └── useOnboarding.ts      ← React hooks with TanStack Query
│
└── app/api/rpc/[...all]/
    └── route.ts                  ← HTTP handler (receives requests)
```

---

## 🔍 Step-by-Step: How It Works

### Step 1: Define Schemas (`schemas/onboarding.schema.ts`)

```typescript
import { z } from "zod";

// Define what data looks like
export const createApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  university: z.string().min(1),
  degreeProgram: z.string().min(1),
  cvLink: z.string().url("Invalid CV link"),
});

// Output schema
export const applicationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  // ... more fields
});
```

**What is Zod?**

- Runtime validation library
- `z.string()` = must be a string
- `z.email()` = must be valid email format
- Automatically generates TypeScript types

---

### Step 2: Create Procedures (`routers/onboarding.ts`)

```typescript
import { os } from "@orpc/server";

// Public procedure (anyone can call)
export const createApplication = os
  .input(createApplicationSchema) // ← Validate input
  .output(
    z.object({
      // ← Validate output
      message: z.string(),
      application: applicationSchema,
    }),
  )
  .handler(async ({ input }) => {
    // ← Business logic
    // input is typed automatically from schema!

    const application = await onboardingRepository.createApplication({
      fullName: input.fullName, // ✅ Autocomplete works!
      email: input.email.toLowerCase(),
      university: input.university,
      degreeProgram: input.degreeProgram,
      cvLink: input.cvLink,
    });

    return {
      message: "Application submitted successfully",
      application: {
        ...application,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
      },
    };
  });
```

**Procedure Breakdown:**

1. **`.input(schema)`** - Defines what data you send
2. **`.output(schema)`** - Defines what you get back
3. **`.handler()`** - Your actual code logic

---

### Step 3: Add Middleware for Authentication

```typescript
// Define auth middleware
const authMiddleware = os.middleware(async ({ next }) => {
  const session = await getSession();

  if (!session || !session.isAuthenticated()) {
    throw new Error("Unauthorized");
  }

  // Add user data to context
  return next({
    context: {
      userId: session.getId(),
      userRole: session.getRole(),
    },
  });
});

// Create protected procedure
const authedProcedure = os.use(authMiddleware);

// Use it
export const updateApplicationStatus = authedProcedure
  .input(updateApplicationStatusSchema)
  .handler(async ({ input, context }) => {
    // context.userId is available here!
    console.log("User ID:", context.userId);

    return await updateStatus(input.id, input.status);
  });
```

**Middleware Flow:**

```
Request → Middleware (check auth) → Procedure Handler → Response
```

---

### Step 4: Combine into Router (`routers/index.ts`)

```typescript
import { os } from "@orpc/server";

import * as onboarding from "./onboarding";

export const router = os.router({
  onboarding: {
    createApplication: onboarding.createApplication,
    getAllApplications: onboarding.getAllApplications,
    updateApplicationStatus: onboarding.updateApplicationStatus,
  },
  // Future routers:
  // users: { ... },
  // projects: { ... },
});

export type AppRouter = typeof router;
```

**Router Structure:**

```typescript
router.onboarding.createApplication;
router.onboarding.getAllApplications;
router.onboarding.updateApplicationStatus;
```

---

### Step 5: Create HTTP Handler (`app/api/rpc/[...all]/route.ts`)

```typescript
import { router } from "@/routers";
import { RPCHandler } from "@orpc/server/fetch";

const handler = new RPCHandler(router);

async function handleRequest(request: Request) {
  const { response } = await handler.handle(request, {
    prefix: "/api/rpc",
    context: {},
  });

  return response ?? new Response("Not found", { status: 404 });
}

export const POST = handleRequest;
export const GET = handleRequest;
// ... all HTTP methods
```

**What happens:**

1. Client calls `orpcClient.onboarding.createApplication(...)`
2. Sends HTTP POST to `/api/rpc/onboarding.createApplication`
3. Handler routes to correct procedure
4. Procedure runs, validates, returns response

---

### Step 6: Create Client (`lib/orpc.ts`)

```typescript
import type { AppRouter } from "@/routers";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

const link = new RPCLink({
  url: () => `${window.location.origin}/api/rpc`,
});

export const orpcClient = createORPCClient<AppRouter>(link);
```

**Key Point:** `createORPCClient<AppRouter>` gives you full type safety!

---

### Step 7: Use in React Components (`_hooks/onboarding/useOnboarding.ts`)

```typescript
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { orpcClient } from "@/lib/orpc";

export const useOnboarding = () => {
  return useMutation({
    mutationFn: async (data) => {
      // Call the procedure - fully typed!
      return await orpcClient.onboarding.createApplication(data);
    },
    onSuccess: () => {
      toast.success("Application submitted!");
    },
  });
};

export const useGetAllApplications = () => {
  return useQuery({
    queryKey: ["onboarding-applications"],
    queryFn: async () => {
      return await orpcClient.onboarding.getAllApplications();
    },
  });
};
```

---

## 🎨 How to Use It

### In a React Component:

```typescript
"use client";

import { useOnboarding, useGetAllApplications } from "@/_hooks/onboarding/useOnboarding";

export default function OnboardingPage() {
  // Get mutation hook
  const createApp = useOnboarding();

  // Get query hook
  const { data: applications, isLoading } = useGetAllApplications();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the mutation
    await createApp.mutateAsync({
      fullName: "John Doe",
      email: "john@example.com",
      university: "MIT",
      degreeProgram: "Computer Science",
      cvLink: "https://example.com/cv.pdf"
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Applications</h1>
      <form onSubmit={handleSubmit}>
        {/* form fields */}
        <button type="submit">Submit</button>
      </form>

      <ul>
        {applications?.map(app => (
          <li key={app.id}>
            {app.fullName} - {app.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**What you get:**

- ✅ `createApp.mutateAsync()` is fully typed
- ✅ `applications` array type is inferred automatically
- ✅ Autocomplete works for all fields
- ✅ Errors caught at compile time

---

## 📚 OpenAPI Documentation

oRPC supports OpenAPI specification for documentation!

### Setup OpenAPI:

```bash
npm install @orpc/openapi
```

Create `server/src/app/api/openapi/route.ts`:

```typescript
import { router } from "@/routers";
import { createDocument } from "@orpc/openapi";

export async function GET() {
  const document = createDocument(router, {
    info: {
      title: "Digital Logbook API",
      version: "1.0.0",
      description: "Type-safe API for Digital Logbook application",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
    ],
  });

  return Response.json(document);
}
```

### View OpenAPI Docs:

1. **Install Swagger UI:**

```bash
npm install swagger-ui-react
```

2. **Create docs page** `app/api-docs/page.tsx`:

```typescript
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <div>
      <SwaggerUI url="/api/openapi" />
    </div>
  );
}
```

3. **Access docs at:** `http://localhost:3000/api-docs`

### Alternative: Use Scalar

Scalar is a modern OpenAPI viewer:

```bash
npm install @scalar/api-reference-react
```

```typescript
"use client";

import { ApiReferenceReact } from "@scalar/api-reference-react";

export default function ApiDocsPage() {
  return (
    <ApiReferenceReact
      configuration={{
        spec: {
          url: "/api/openapi",
        },
      }}
    />
  );
}
```

---

## 🎯 Common Patterns

### 1. **Public vs Protected Procedures**

```typescript
// Anyone can call
export const createApplication = os
  .input(...)
  .handler(...);

// Only authenticated users
export const getProfile = os
  .use(authMiddleware)
  .handler(({ context }) => {
    // context.userId available
  });

// Only super admins
export const deleteUser = os
  .use(authMiddleware)
  .use(superAdminMiddleware)
  .handler(...);
```

### 2. **Error Handling**

```typescript
export const createApplication = os
  .input(createApplicationSchema)
  .handler(async ({ input }) => {
    // Check business logic
    const existing = await findByEmail(input.email);

    if (existing) {
      throw new Error("Email already exists");
    }

    // Client will receive this error
    return await create(input);
  });
```

Client side:

```typescript
try {
  await orpcClient.onboarding.createApplication(data);
} catch (error) {
  console.error(error.message); // "Email already exists"
}
```

### 3. **Adding New Procedures**

**Step 1:** Create procedure in `routers/onboarding.ts`:

```typescript
export const deleteApplication = superAdminProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ input }) => {
    await repository.delete(input.id);
    return { success: true };
  });
```

**Step 2:** Add to router in `routers/index.ts`:

```typescript
export const router = os.router({
  onboarding: {
    createApplication,
    deleteApplication, // ← Add here
  },
});
```

**Step 3:** Use in client:

```typescript
await orpcClient.onboarding.deleteApplication({ id: "123" });
```

That's it! No API route creation needed!

---

## 🎓 Summary

1. **oRPC = Type-safe RPC** - Call server functions from client with full TypeScript support
2. **Procedures = Server functions** - Define once, use everywhere
3. **Schemas = Validation** - Zod validates input/output automatically
4. **Router = Combines procedures** - Organized by domain (onboarding, users, projects)
5. **Client = Browser caller** - Fully typed, autocomplete works
6. **Hooks = React integration** - TanStack Query + oRPC

**Key Benefits:**

- ✅ No manual API endpoint creation
- ✅ Full type safety across network
- ✅ Automatic validation
- ✅ Easy to test and maintain
- ✅ OpenAPI documentation support

**Next Steps:**

1. Test the implementation in your components
2. Add more routers (users, projects, reports)
3. Set up OpenAPI documentation
4. Add more middleware (logging, rate limiting)

---

## 📖 Resources

- oRPC Docs: https://orpc.dev
- Zod Docs: https://zod.dev
- TanStack Query: https://tanstack.com/query
