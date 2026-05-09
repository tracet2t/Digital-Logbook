# Special Logic & Middleware

This page documents the non-obvious, system-critical logic that holds everything together — authentication middleware, email sending, report queuing, and error handling.

---

## Authentication & Middleware

Digital Logbook uses a **chained middleware** system to protect routes and enforce role-based access.

### How It Works

```
Incoming Request
      │
      ▼
  middleware.ts          ← Entry point, composes multiple middlewares
      │
      ├── authMiddleware.ts   ← Validates JWT, checks session expiry
      │       → Redirects to /login if token is missing or invalid
      │       → Attaches user data to the request context
      │
      └── chain.ts           ← Utility to compose/chain multiple middlewares
```

### Key Files

| File | Location | Purpose |
|---|---|---|
| `middleware.ts` | `server/src/middleware.ts` | Main entry point, chains all middlewares |
| `authMiddleware.ts` | `server/src/middlewares/authMiddleware.ts` | JWT validation, redirects on failure |
| `chain.ts` | `server/src/middlewares/chain.ts` | Composes multiple middlewares together |

### What `authMiddleware.ts` Does

1. Reads the JWT from the HTTP-only cookie
2. Verifies the token signature using `JWT_SECRET`
3. Checks that the token hasn't expired
4. Extracts the user's role and attaches it to the request
5. Redirects to `/login` if any check fails

!!! note "Role-Based Routing"
    After authentication, the middleware also checks if the user is accessing the correct section of the app (e.g., students can't access `/admin/*` routes).

---

## Input Validation

All API endpoints validate incoming data before processing:

- **Required fields** are checked and return `400 Bad Request` if missing
- **Role checks** ensure only authorized roles can access each endpoint
- **Invitation tokens** are validated for existence, expiry, and whether they've already been used
- **Password hashing** is applied during registration using bcrypt

---

## Email System

Invitation emails are sent using **Nodemailer** with a Gmail SMTP backend.

| File | Location | Purpose |
|---|---|---|
| `email.ts` | `server/src/lib/email.ts` | Core email sending utility |

### What Gets Sent

When an admin invites a new user:

1. A secure, time-limited invitation token is generated
2. An email is composed with:
   - The user's temporary password (if applicable)
   - A registration link containing the token
3. The email is sent via Gmail SMTP

!!! tip "Configuring Gmail"
    Set `EMAIL_USER` and `EMAIL_PASS` in your `.env` file. Use a Gmail **App Password**, not your regular account password.
    See [Environment Setup](getting-started/environment.md) for details.

---

## Async Report Generation (BullMQ + Redis)

Generating reports is a potentially slow operation — it involves querying the database, processing data, and building a file. To avoid blocking the API, report generation is handled **asynchronously** using a job queue.

| File | Location | Purpose |
|---|---|---|
| `reportGenerator.ts` | `server/src/lib/reportGenerator.ts` | Builds mentor activity CSV reports |
| `queue.ts` | `server/src/lib/queue.ts` | BullMQ queue setup and job definitions |

### How It Works

```
1. Mentor clicks "Generate Report"
         │
         ▼
2. API route adds a job to the BullMQ queue
   (report status = "wip")
         │
         ▼
3. Background worker picks up the job from Redis
         │
         ▼
4. Report is generated and saved to the database
   (report status = "completed")
         │
         ▼
5. Mentor refreshes and downloads the report
```

!!! warning "Redis Required"
    BullMQ requires a running Redis instance. Make sure Redis is included in your `docker-compose.yml` or configured separately.

---

## Error Handling

All API routes follow a consistent error response format:

```json
{
  "success": false,
  "message": "A human-readable error description"
}
```

### HTTP Status Codes Used

| Status Code | Meaning | When Used |
|---|---|---|
| `200 OK` | Success | Successful GET/PATCH |
| `201 Created` | Created | Successful POST (new resource) |
| `400 Bad Request` | Invalid input | Missing or invalid request data |
| `401 Unauthorized` | Not authenticated | Missing or invalid JWT |
| `403 Forbidden` | Not authorized | Valid JWT but wrong role |
| `404 Not Found` | Not found | Resource doesn't exist |
| `500 Internal Server Error` | Server error | Unexpected exceptions |

### Transactional Deletes

When deleting a user or invitation, the system uses **database transactions** to ensure all related records are cleaned up atomically — so you never end up with orphaned data.

---

## Related Pages

- [API Reference](api/overview.md) — Full list of endpoints and their auth requirements
- [Environment Setup](getting-started/environment.md) — Setting up JWT secrets and email credentials
- [Testing](testing.md) — How middleware and edge cases are tested
