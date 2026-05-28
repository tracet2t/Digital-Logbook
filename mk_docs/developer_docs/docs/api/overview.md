# API Overview

This page gives you a high-level view of all available API endpoints in Digital Logbook.

---

## Authentication

All API endpoints (except `/api/(auth)/login` and `/api/(auth)/register`) require a valid **JWT token**.

The token is automatically stored in an **HTTP-only cookie** after login — you don't need to manually attach it to requests from the browser.

!!! warning "JWT Required"
    Direct API calls (e.g., from Postman or scripts) must include the JWT as a cookie or `Authorization: Bearer <token>` header.

---

## Base URL

```
http://localhost:3000
```

In production, replace with your deployed domain.

---

## Endpoint Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/(auth)/login` | Log in and receive a JWT cookie | ❌ No |
| `POST` | `/api/(auth)/register` | Register via invitation token | ❌ No |
| `GET` | `/api/project` | List all projects | ✅ Yes |
| `POST` | `/api/project` | Create a new project | ✅ Admin only |
| `PATCH` | `/api/project` | Assign student/mentor to project | ✅ Admin only |
| `DELETE` | `/api/project` | Remove student/mentor from project | ✅ Admin only |
| `GET` | `/api/invitations` | List invitations or validate token | ✅ Yes |
| `POST` | `/api/invitations` | Send a new invitation | ✅ Admin only |
| `PATCH` | `/api/invitations` | Update invitation status | ✅ Admin only |
| `DELETE` | `/api/invitations` | Delete an invitation (cascade) | ✅ Admin only |
| `GET` | `/api/users` | List all users | ✅ Admin only |
| `PATCH` | `/api/users` | Update user status/details | ✅ Admin only |
| `GET` | `/api/reports` | List reports | ✅ Admin/Mentor |
| `POST` | `/api/reports` | Generate a new report | ✅ Mentor only |

---

## Response Format

All API responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "A human-readable error message"
}
```

---

## Roles & Permissions

| Role | Access Level |
|---|---|
| **super_admin** | Full access — manage users, projects, invitations, reports |
| **mentor** | Read-only access to their mentees; can generate reports |
| **student** | Access to their own activities and assigned projects only |

---

## Detailed Endpoint Docs

- [Authentication API](auth.md)
- [Projects API](projects.md)
- [Invitations API](invitations.md)
- [Users API](users.md)
- [Reports API](reports.md)
