# Invitations

Invitations are how new users join Digital Logbook. No one can self-register — everyone must be invited by a Super Admin.

---

## Overview

When an admin invites someone, the system:
1. Creates an invitation record in the database
2. Sends an email with a unique, time-limited registration link
3. Tracks the invitation status (Pending, Accepted, Expired)

**Route:** `/admin/invitations`  
**Access:** Super Admin only  
**Key Components:**
- `server/src/app/admin/invitations/page.tsx`
- `server/src/components/admin/Invitations/BulkUploadTabs.tsx`

---

## Invitation Flow

```
Admin sends invitation
        │
        ▼
System creates invitation record (status: Pending)
        │
        ▼
Email sent to user with registration link
        │
        ▼
User clicks link → goes to /register?token=...
        │
        ▼
User fills in their name and password
        │
        ▼
System validates token → creates user account
        │
        ▼
Invitation marked as Accepted
        │
        ▼
User is redirected to their dashboard
```

---

## Invitation Statuses

| Status | Meaning |
|---|---|
| **Pending** | Email sent, user hasn't registered yet |
| **Accepted** | User has completed registration |
| **Expired** | Token has passed its expiry date |

!!! note "Token Expiry"
    Invitation tokens have a time limit (typically 7 days). After expiry, the link no longer works and the admin must resend the invitation.

---

## How to Send an Invitation

1. Go to **Admin → Invitations**
2. Click **"Invite User"**
3. Fill in:
   - **Email** — The user's email address
   - **First Name / Last Name** — Prepopulated in the email
   - **Role** — `student`, `mentor`, or `superAdmin`
   - **Project** *(optional)* — Pre-assign to a project
4. Click **"Send Invitation"**

The user will receive an email with a link to complete registration.

---

## Managing Invitations

Admins can:
- **View all invitations** with their status, role, and expiry date
- **Delete an invitation** — also removes the associated user account if already registered
- **Update status manually** — Mark as Expired or reset to Pending

!!! warning "Deleting Invitations"
    Deleting an invitation will cascade-delete the user and all their associated data. This cannot be undone.

---

## Bulk Invitations

Need to invite many users at once? Use the **Bulk Upload** feature to upload an Excel file.

👉 See [Bulk Invitation Upload](bulk-upload.md)

---

## Related Pages

- [Invitations API](../api/invitations.md) — API endpoints
- [Bulk Upload](bulk-upload.md) — Upload Excel for bulk invitations
- [Authentication](../api/auth.md) — Registration flow
