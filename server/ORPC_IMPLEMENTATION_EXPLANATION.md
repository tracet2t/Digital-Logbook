# oRPC Implementation for Next.js - Complete Guide

## 📋 Overview

I've implemented **oRPC** (a type-safe RPC framework) for your Next.js onboarding process. oRPC provides end-to-end type safety from your server procedures to client calls, eliminating the need for manual type definitions and ensuring compile-time safety.

## 🎯 What Was Implemented

### 1. **oRPC Router** (`server/src/lib/orpc-router.ts`)

- Defined all onboarding procedures with full type safety
- Includes authentication and authorization middleware
- Input/output validation using Zod schemas
- Procedures for:
  - Creating applications
  - Fetching applications (by ID, email, status, search, date range)
  - Getting application summaries
  - Updating application status (Super Admin only)

### 2. **RPC API Route Handler** (`server/src/app/api/rpc/[...all]/route.ts`)

- Catch-all route that handles all HTTP methods (GET, POST, PATCH, etc.)
- Routes requests to appropriate oRPC procedures
- Handles errors with custom interceptors

### 3. **Type-Safe Client** (`server/src/lib/orpc.ts`)

- Client-side oRPC client with full type inference
- Automatically knows about all procedures and their types
- Works in browser environment only (not on server-side)

### 4. **TanStack Query Hooks** (`server/src/_hooks/onboarding/useOnboarding.ts`)

- React hooks that combine oRPC with TanStack Query
- Provides:
  - Mutations for creating applications and updating status
  - Queries for fetching data with caching
  - Automatic error handling with toast notifications
  - Query invalidation after mutations

## ⚙️ How It Works

### The Flow:

```
Client Component
    ↓
TanStack Query Hook (useOnboarding)
    ↓
oRPC Client (orpcClient.onboarding.createApplication)
    ↓
HTTP Request to /api/rpc
    ↓
RPC Handler
    ↓
Router Procedure
    ↓
Repository Method
    ↓
Database
```

### Type Safety Chain:

```typescript
// 1. Define procedure on server
const createApplication = os
  .input(createApplicationSchema) // Zod validation
  .output(responseSchema) // Response shape
  .handler(async ({ input }) => {
    // TypeScript knows input type from schema!
    return await repository.create(input);
  });

// 2. Create router
export const appRouter = os.router({
  onboarding: os.router({
    createApplication,
    // ... more procedures
  }),
});

// 3. Use on client - FULLY TYPED!
const result = await orpcClient.onboarding.createApplication({
  fullName: "John Doe",
  email: "john@example.com",
  // TypeScript autocompletes all required fields!
});
// result.application is typed with exact shape!
```

## 🔧 Key Concepts

### 1. **Procedures**

Procedures are like functions but with added features:

- Input validation (using Zod)
- Output validation
- Middleware support (auth, logging, etc.)
- Type inference

```typescript
const myProcedure = os
  .input(z.object({ name: z.string() }))
  .output(z.object({ id: z.number() }))
  .handler(async ({ input }) => {
    return { id: 1 };
  });
```

### 2. **Middleware**

Reusable logic that runs before your handler:

```typescript
const authMiddleware = os.middleware(async ({ next }) => {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  return next({
    context: { userId: session.getId() },
  });
});

const authedProcedure = os.use(authMiddleware);
```

### 3. **Routers**

Group related procedures together:

```typescript
const userRouter = os.router({
  get: getProcedure,
  create: createProcedure,
  update: updateProcedure,
});

const appRouter = os.router({
  users: userRouter,
  posts: postRouter,
});
```

### 4. **Client**

Call procedures as if they were local functions:

```typescript
// No need to define request/response types!
// TypeScript infers everything from the server
const user = await client.users.get({ id: "123" });
//    ^? { id: string, name: string, ... } - Fully typed!
```

## 📝 Usage Examples

### Creating an Application (Public Endpoint)

```typescript
import { useOnboarding } from "@/_hooks/onboarding/useOnboarding";

function OnboardingForm() {
  const { mutate, isPending } = useOnboarding();

  const handleSubmit = (data) => {
    mutate({
      fullName: data.fullName,
      email: data.email,
      university: data.university,
      degreeProgram: data.degreeProgram,
      cvLink: data.cvLink,
    });
    // Success/error handled automatically with toasts!
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Fetching All Applications

```typescript
import { useGetAllApplications } from "@/_hooks/onboarding/useOnboarding";

function ApplicationsList() {
  const { data, isLoading, error } = useGetAllApplications();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data.map(app => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
```

### Updating Status (Super Admin Only)

```typescript
import { useUpdateApplicationStatus } from "@/_hooks/onboarding/useOnboarding";

function ApplicationActions({ applicationId }) {
  const { mutate } = useUpdateApplicationStatus();

  const approveApplication = () => {
    mutate({
      id: applicationId,
      status: "approved",  // TypeScript ensures only valid statuses!
    });
  };

  return <Button onClick={approveApplication}>Approve</Button>;
}
```

### Searching Applications

```typescript
import { useSearchApplications } from "@/_hooks/onboarding/useOnboarding";

function SearchBar() {
  const [search, setSearch] = useState("");
  const { data } = useSearchApplications(search);

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {data && <Results applications={data} />}
    </>
  );
}
```

## 🔒 Authentication & Authorization

The implementation includes middleware for:

1. **Authentication Middleware** (`authMiddleware`)
   - Checks if user is logged in
   - Adds `session`, `userId`, and `userRole` to context
   - Throws error if not authenticated

2. **Super Admin Middleware** (`superAdminMiddleware`)
   - Requires authentication first
   - Checks if user has Super Admin role
   - Throws error if forbidden

Usage:

```typescript
// Public procedure (no auth)
const publicProcedure = os;

// Authenticated procedure
const authedProcedure = os.use(authMiddleware);

// Super Admin only procedure
const superAdminProcedure = authedProcedure.use(superAdminMiddleware);
```

## 🎨 Benefits Over Traditional REST

### Before (Traditional Fetch):

```typescript
// ❌ Manual type definitions
interface OnboardingRequest {
  fullName: string;
  email: string;
  // ... more fields
}

interface OnboardingResponse {
  message: string;
  application: {
    id: string;
    // ... more fields
  };
}

// ❌ Manual fetch calls
const response = await fetch("/api/onboarding", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

// ❌ Manual error handling
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

// ❌ Manual type casting
const result: OnboardingResponse = await response.json();
```

### After (oRPC):

```typescript
// ✅ No manual type definitions needed!
// ✅ One line call
// ✅ Automatic error handling
// ✅ Full type inference
const result = await orpcClient.onboarding.createApplication(data);
//    ^? Fully typed based on server procedure!
```

## 🚀 Advantages

1. **End-to-End Type Safety**: Types flow from server to client automatically
2. **No Code Generation**: Unlike tRPC or gRPC, no build step needed
3. **Zod Validation**: Input/output validation built-in
4. **Middleware Support**: Reusable auth, logging, etc.
5. **TanStack Query Integration**: Automatic caching, refetching, etc.
6. **Better DX**: Autocomplete, inline errors, refactoring support
7. **Less Boilerplate**: No need to define types twice
8. **Runtime Safety**: Zod validates at runtime too

## 📚 Available Procedures

### Public Procedures:

- `createApplication` - Submit a new onboarding application
- `getApplicationById` - Get application by ID
- `getApplicationByEmail` - Get application by email
- `getApplicationsByStatus` - Filter by status (pending/approved/rejected)
- `searchApplications` - Search by name or email
- `getApplicationsByDateRange` - Get applications in date range
- `getApplicationSummary` - Get counts by status
- `getAllApplications` - Get all applications (includes direct students)

### Protected Procedures (Super Admin Only):

- `updateApplicationStatus` - Approve/reject applications

## 🛠️ Adding More Procedures

To add a new procedure:

```typescript
// 1. Define in orpc-router.ts
const myNewProcedure = publicProcedure  // or authedProcedure
  .input(z.object({ ... }))
  .output(z.object({ ... }))
  .handler(async ({ input }) => {
    // Your logic here
    return result;
  });

// 2. Add to router
export const onboardingRouter = os.router({
  // ... existing procedures
  myNewProcedure,
});

// 3. Create hook in useOnboarding.ts
export const useMyNewProcedure = () => {
  return useQuery({
    queryKey: ["my-new-procedure"],
    queryFn: async () => {
      return await orpcClient.onboarding.myNewProcedure();
    },
  });
};

// 4. Use in component
const { data } = useMyNewProcedure();
```

## 🐛 Error Handling

Errors are automatically handled by:

1. **oRPC**: Validates input/output, catches handler errors
2. **TanStack Query**: Provides error state in hooks
3. **Toast Notifications**: Shows user-friendly messages

You can also add custom error handling:

```typescript
const { mutate } = useOnboarding();

mutate(data, {
  onError: (error) => {
    console.error("Custom error handling:", error);
    // Show custom UI, log to service, etc.
  },
});
```

## 📖 Further Reading

- [oRPC Documentation](https://orpc.dev/docs/getting-started)
- [oRPC Next.js Adapter](https://orpc.dev/docs/adapters/next)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)

## 💡 Tips

1. **Always define output schemas** for better type inference
2. **Reuse middleware** for common patterns (auth, logging)
3. **Use TanStack Query features** like caching, optimistic updates
4. **Organize routers** by domain (users, posts, etc.)
5. **Export types** from server for client usage if needed

---

This implementation provides a robust, type-safe foundation for your onboarding process. The same patterns can be extended to other parts of your application (users, projects, reports, etc.).
