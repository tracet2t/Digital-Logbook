# Users & Roles

This page explains how users are managed in Digital Logbook — who can do what, how they're organized, and how admins manage them.

---

## Overview

Every person on the platform is a **User**. Users are categorized by **role**, which determines what they can see and do.

**Route:** `/admin/users`  
**Access:** Super Admin only  
**Key Components:**
- `server/src/app/admin/users/page.tsx`
- `server/src/components/admin/users/UsersTable.tsx`

---

## User Roles

| Role | Description | Dashboard |
|---|---|---|
| **super_admin** | Full access to all features. Manages users, projects, invitations, and reports. | `/admin` |
| **mentor** | Reviews student activities, provides feedback, generates reports. | `/mentor` |
| **student** | Logs daily activities, views assigned projects, tracks feedback. | `/student` |

!!! note "No Self-Registration"
    Users cannot create their own accounts. They must be invited by a Super Admin.

---

## User Status

| Status | Meaning |
|---|---|
| **Active** | User can log in and use the platform normally |
| **Inactive** | User is blocked from logging in; data is preserved |

Admins can toggle user status at any time without deleting the account.

---

## Managing Users

### Viewing Users

1. Go to **Admin → Users**
2. You'll see a table of all users with their name, email, role, status, and join date

### Filtering Users

Use the filter bar to narrow the list:

- Filter by **Role** (student / mentor / admin)
- Filter by **Status** (active / inactive)
- Search by **Name** or **Email**

### Changing User Status

1. Find the user in the table
2. Click the action menu (⋮) next to their name
3. Select **"Deactivate"** or **"Activate"**

!!! warning "Deactivation vs Deletion"
    Deactivating a user does **not** delete their data. They're simply prevented from logging in.
    To permanently remove a user, delete their invitation from the Invitations page.

---

## User Fields Reference

| Field | Description |
|---|---|
| `id` | Unique UUID — never changes |
| `email` | Login email address (must be unique) |
| `firstName` / `lastName` | Display name |
| `role` | `student`, `mentor`, or `super_admin` |
| `isActive` | Whether the account is enabled |
| `emailConfirmed` | Whether the email was verified via registration |
| `isFirstTimeLogin` | Used to prompt password change on first login |
| `invitedBy` | ID of the admin who sent the invitation |
| `createdAt` | When the account was created |

---

## Related Pages

- [Users API](../api/users.md) — API endpoints for user management
- [Invitations](invitations.md) — How users are added to the platform
- [Database Schema](../database.md) — Users model definition
