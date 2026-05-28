# Bulk Invitation Upload

Instead of inviting users one by one, admins can upload an **Excel file** to send multiple invitations at once.

---

## Overview

The Bulk Upload feature parses an Excel (`.xlsx`) file, maps columns to the required fields, previews the data, and sends invitations to all valid rows.

**Route:** `/admin/invitations` → Bulk Upload tab  
**Access:** Super Admin only  
**Component:** `server/src/components/admin/Invitations/BulkUploadTabs.tsx`

---

## Required Excel Format

Your Excel file must contain these columns (column names are case-insensitive):

| Column | Required | Description |
|---|---|---|
| `email` | ✅ | Email address to invite |
| `firstName` | ✅ | First name of the user |
| `lastName` | ✅ | Last name of the user |
| `role` | ✅ | `student`, `mentor`, or `superAdmin` |
| `projectId` | ❌ | Optional project to pre-assign |

### Example Excel Structure

| email | firstName | lastName | role | projectId |
|---|---|---|---|---|
| alice@example.com | Alice | Smith | student | proj-abc123 |
| bob@example.com | Bob | Jones | mentor | |
| carol@example.com | Carol | Lee | student | proj-abc123 |

---

## How to Use Bulk Upload

1. **Go to** Admin → Invitations → Bulk Upload tab
2. **Upload your file** — drag and drop or click "Browse"
3. **Map columns** — the system may ask you to match your column names to the required fields
4. **Preview** — review the rows that will be invited
5. **Send** — click "Send Invitations" to process all rows

The system sends one invitation per valid row. Rows with invalid data are flagged and skipped.

---

## Validation Rules

Before sending, the system checks each row:

- Email must be a valid format
- Role must be one of the allowed values
- Duplicate emails (already invited or registered) are skipped
- Rows with missing required fields are flagged with an error

!!! warning "Duplicate Emails"
    If an email already exists in the system, that row will be skipped silently. Check the summary after upload to see which rows were skipped.

---

## After Upload

You'll see a summary showing:
- ✅ **Sent** — How many invitations were sent successfully
- ⚠️ **Skipped** — Rows that were skipped (duplicates or errors)
- ❌ **Failed** — Rows that failed due to invalid data

Each sent invitation appears in the Invitations list with a **Pending** status.

---

## Related Pages

- [Invitations Feature](invitations.md) — Single invitation flow
- [Bulk Upload UI Component](../components/bulk-upload-ui.md) — Component details
- [Invitations API](../api/invitations.md) — API used behind the scenes
