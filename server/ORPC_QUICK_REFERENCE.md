# 🚀 oRPC Quick Reference - Your Implementation

## ✅ What You Have Now

Your Digital Logbook now has a **fully type-safe RPC system** that replaces traditional REST APIs!

### 📁 File Structure

```
server/src/
├── routers/
│   ├── index.ts              ← Main router (combines all domains)
│   └── onboarding.ts         ← Onboarding procedures
│
├── schemas/
│   └── onboarding.schema.ts  ← Zod validation schemas
│
├── lib/
│   └── orpc.ts               ← Browser client
│
├── _hooks/onboarding/
│   └── useOnboarding.ts      ← React hooks (TanStack Query + oRPC)
│
└── app/api/rpc/[...all]/
    └── route.ts              ← HTTP handler
```

---

## 🎯 How to Use It

### In a React Component:

```typescript
"use client";

import { useOnboarding, useGetAllApplications } from "@/_hooks/onboarding/useOnboarding";

export default function OnboardingPage() {
  const createApp = useOnboarding();
  const { data: apps } = useGetAllApplications();

  const handleSubmit = async () => {
    await createApp.mutateAsync({
      fullName: "John Doe",
      email: "john@example.com",
      university: "MIT",
      degreeProgram: "Computer Science",
      cvLink: "https://example.com/cv.pdf"
    });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
      <ul>
        {apps?.map(app => (
          <li key={app.id}>{app.fullName} - {app.status}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Benefits:**

- ✅ Full type safety - autocomplete works everywhere
- ✅ Automatic validation - Zod validates inputs/outputs
- ✅ Error handling - toast notifications built-in
- ✅ Caching - TanStack Query handles data fetching
- ✅ No manual API calls - just call functions!

---

## 🔑 Key Concepts Explained Simply

### 1. What is a "Procedure"?

A procedure = server function you can call from the browser.

```typescript
// Server: Define what the function does
export const createApplication = os
  .input(createApplicationSchema)  // What data it needs
  .handler(async ({ input }) => {  // What it does
    return await repository.create(input);
  });

// Client: Call it like a normal function!
const result = await orpcClient.onboarding.createApplication({...});
```

### 2. How Does Type Safety Work?

```
Server defines procedure → TypeScript extracts types → Client gets same types

You change server schema → TypeScript ERROR on client → Fix before deploy ✅
```

### 3. How is This Different from REST?

| REST API               | oRPC                                        |
| ---------------------- | ------------------------------------------- |
| `/api/onboarding` POST | `orpcClient.onboarding.createApplication()` |
| Manual `fetch()` calls | Function calls                              |
| No type safety         | Full TypeScript types                       |
| Manual validation      | Automatic with Zod                          |
| Multiple files needed  | One procedure definition                    |

---

## 🎨 Available Hooks

```typescript
// Create new application
const create = useOnboarding();
await create.mutateAsync({...});

// Get all applications
const { data } = useGetAllApplications();

// Get by status
const { data } = useApplicationsByStatus("pending");

// Search applications
const { data } = useSearchApplications("john@example");

// Update status (Super Admin only)
const update = useUpdateApplicationStatus();
await update.mutateAsync({ id: "123", status: "approved" });

// Get summary counts
const { data } = useApplicationSummary();
// Returns: { counts: { pending: 5, approved: 10, rejected: 2 } }
```

---

## 🔒 Authentication

Procedures have different permission levels:

```typescript
// PUBLIC - Anyone can call
export const createApplication = os
  .input(...)
  .handler(...);

// AUTHENTICATED - Must be logged in
export const getProfile = os
  .use(authMiddleware)  // ← Requires auth
  .handler(({ context }) => {
    // context.userId is available
  });

// SUPER ADMIN ONLY - Highest permission
export const deleteUser = os
  .use(authMiddleware)
  .use(superAdminMiddleware)  // ← Requires Super Admin
  .handler(...);
```

---

## ➕ Adding New Features

### Want to add a "delete" procedure?

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
    // ... other procedures
  },
});
```

**Step 3:** Use in component:

```typescript
const result = await orpcClient.onboarding.deleteApplication({ id: "123" });
```

**That's it!** No API route creation needed!

---

## 🧪 Testing Your API

### Method 1: Browser Console

```javascript
const result = await orpcClient.onboarding.getAllApplications();
console.log(result);
```

### Method 2: Postman / Thunder Client

```
POST http://localhost:3000/api/rpc/onboarding.createApplication
Content-Type: application/json

{
  "fullName": "Test User",
  "email": "test@example.com",
  "university": "MIT",
  "degreeProgram": "Computer Science",
  "cvLink": "https://example.com/cv.pdf"
}
```

### Method 3: Test Page

Create `app/test-api/page.tsx` - see full example in [ORPC_BEGINNER_GUIDE.md](ORPC_BEGINNER_GUIDE.md)

---

## 📖 Complete Documentation

For detailed explanations, examples, and advanced features, read:

- **[ORPC_BEGINNER_GUIDE.md](ORPC_BEGINNER_GUIDE.md)** - Complete beginner's guide with examples

### Official Resources:

- oRPC Website: https://orpc.dev
- Zod Docs: https://zod.dev
- TanStack Query: https://tanstack.com/query

---

## 🎯 Next Steps

1. ✅ Your implementation is complete and working!
2. 📝 Read [ORPC_BEGINNER_GUIDE.md](ORPC_BEGINNER_GUIDE.md) for detailed explanations
3. 🧪 Test the hooks in your components
4. ➕ Add more routers for users, projects, reports
5. 🔒 Customize middleware for your authentication needs

---

## ❓ Common Questions

**Q: Can I still use REST APIs alongside oRPC?**  
A: Yes! oRPC procedures can coexist with traditional REST endpoints.

**Q: Does this work with Server Components?**  
A: The hooks are for Client Components. For Server Components, call repository methods directly.

**Q: What about file uploads?**  
A: oRPC supports File/Blob types natively! See oRPC docs for examples.

**Q: Can I use this in production?**  
A: Yes! oRPC is production-ready and used by many companies.

**Q: How do I add more domains (users, projects)?**  
A: Create new files in `routers/` (e.g., `users.ts`) and add to `routers/index.ts`.

---

**Congratulations! You now have a modern, type-safe API system! 🎉**
