# Admin Dashboard

The Admin Dashboard is the control center for **Super Admins**. From here, admins can view platform-wide statistics and navigate to all management areas.

---

## Overview

The dashboard gives a bird's-eye view of the entire platform at a glance. It's the first page admins see after logging in.

**Route:** `/admin`  
**Access:** Super Admin only  
**Component:** `server/src/components/admin-dashboard/SuperAdminDashboard.tsx`

---

## What's on the Dashboard

| Section | Description |
|---|---|
| **Stats Overview** | Total counts: users, active projects, pending invitations, reports |
| **Quick Navigation** | Links to Users, Projects, Invitations, Reports pages |
| **System Status** | Loading and error state indicators |

---

## Key Features

### 📊 Platform Statistics

The dashboard shows real-time counts pulled from the database:

- **Total Users** — Broken down by role (students, mentors, admins)
- **Active Projects** — Projects currently in progress
- **Pending Invitations** — Invitations not yet accepted
- **Recent Reports** — Latest mentor-generated reports

### 🔗 Module Navigation

Quick-access links to all admin modules:

- 👥 [Users](users.md) — View and manage all users
- 📁 [Projects](projects.md) — Manage projects and assignments
- 📨 [Invitations](invitations.md) — Send and track invitations
- 📈 [Reports](reports.md) — View and generate reports

### ⚙️ Error & Loading States

The dashboard gracefully handles:
- **Loading states** — Shows a spinner while data loads
- **Error states** — Displays a friendly error message with retry options
- **Empty states** — Informs admin when there's no data yet

---

## How Data Gets to the Dashboard

```
SuperAdminDashboard.tsx
        │
        ├── calls useAdminStats() hook
        │         │
        │         └── GET /api/stats or individual API endpoints
        │
        └── renders widgets with the returned data
```

All data is fetched via authenticated API routes. If the JWT is expired, the user is redirected to login.

---

## Notes

!!! note "Role Gate"
    This page is only accessible to users with the `super_admin` role. Attempting to access `/admin` with any other role will result in a redirect.

!!! tip "Shared Components"
    The dashboard uses shared admin components (`AdminPageLayout`, `PageHeader`, etc.) for consistent styling.
    See [Shared Admin Components](../components/shared-admin.md) for details.

---

## Related Pages

- [Projects Feature](projects.md)
- [Users Feature](users.md)
- [Invitations Feature](invitations.md)
- [Reports Feature](reports.md)
- [Shared Admin Components](../components/shared-admin.md)
