# Bulk Upload UI Component

The Bulk Upload UI is a multi-step interface that lets admins upload an Excel file and send invitations to many users at once.

---

## Overview

This component handles the entire bulk upload workflow — from file selection to sending invitations — in a tabbed interface.

**Used in:** Admin → Invitations page  
**Component:** `server/src/components/admin/Invitations/BulkUploadTabs.tsx`

---

## UI Tabs

The component is organized into tabs that guide the admin through the process:

| Tab | Step | Description |
|---|---|---|
| **Upload** | 1 | Select or drag-and-drop an Excel file |
| **Map** | 2 | Match Excel columns to required fields |
| **Preview** | 3 | Review the data before sending |
| **Results** | 4 | See which invitations were sent/skipped/failed |

---

## Step 1: Upload

The upload tab accepts:
- `.xlsx` files (Excel format)
- Drag-and-drop or click-to-browse

!!! note "File Format"
    Your Excel file must have the correct columns. See [Bulk Invitation Upload](../features/bulk-upload.md) for the required format.

---

## Step 2: Field Mapping

If the column names in your Excel file don't exactly match the expected names, the mapping step lets you manually match them:

```
Your Column        →   System Field
─────────────────────────────────────
"Email Address"    →   email
"First"           →   firstName
"Surname"         →   lastName
"User Type"       →   role
```

---

## Step 3: Preview

Before anything is sent, you see a preview table of all rows that will be processed. This lets you catch mistakes early.

- ✅ Valid rows are shown normally
- ⚠️ Rows with warnings (e.g., missing optional fields) are highlighted
- ❌ Invalid rows (missing required fields, bad email format) are flagged in red

---

## Step 4: Results

After sending, a summary shows:

| Result | Description |
|---|---|
| ✅ Sent | Invitation was sent successfully |
| ⚠️ Skipped | Email already exists or was a duplicate |
| ❌ Failed | API error or invalid data |

---

## Example Usage

```tsx
import { BulkUploadTabs } from "@/components/admin/Invitations/BulkUploadTabs";

<BulkUploadTabs onComplete={handleUploadComplete} />
```

---

## Related Pages

- [Bulk Upload Feature](../features/bulk-upload.md) — End-to-end feature explanation
- [Invitations Feature](../features/invitations.md) — Single invitation workflow
- [Shared Admin Components](shared-admin.md) — Other admin UI components
