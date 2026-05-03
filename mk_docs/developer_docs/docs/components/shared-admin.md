# Shared Admin Components

A collection of reusable UI components used across all admin pages. These components provide consistent layout, styling, and behavior — so every admin page looks and feels the same.

---

## Overview

Instead of rebuilding common UI patterns (page headers, tables, filters, etc.) on every page, Digital Logbook provides a shared component library for admin pages.

**Import from:** `@/components/admin`

---

## Component Reference

### `AdminPageLayout`

The top-level wrapper for any admin page. Provides consistent padding, background, and spacing.

```tsx
import { AdminPageLayout } from "@/components/admin";

<AdminPageLayout>
  {/* Your page content */}
</AdminPageLayout>
```

---

### `PageHeader`

Renders a page title and optional subtitle at the top of an admin page.

```tsx
import { PageHeader } from "@/components/admin";

<PageHeader
  title="Users"
  subtitle="Manage all platform users"
/>
```

---

### `FilterBar`

A row of filter controls (dropdowns, search inputs) for filtering table data.

```tsx
import { FilterBar } from "@/components/admin";

<FilterBar
  filters={[...]}
  onFilterChange={handleFilterChange}
/>
```

---

### `TableStateRows`

Renders table rows for loading, empty, and error states — so you don't have to handle these cases in every page.

```tsx
import { TableStateRows } from "@/components/admin";

<TableStateRows
  isLoading={isLoading}
  isEmpty={data.length === 0}
  error={error}
  colSpan={5}
/>
```

---

### `TableActionMenu`

A dropdown action menu (⋮) for table row actions like Edit, Delete, Deactivate.

```tsx
import { TableActionMenu } from "@/components/admin";

<TableActionMenu
  actions={[
    { label: "Edit", onClick: handleEdit },
    { label: "Delete", onClick: handleDelete },
  ]}
/>
```

---

### `AdminPagination`

Pagination controls for navigating large data sets.

```tsx
import { AdminPagination } from "@/components/admin";

<AdminPagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

---

### `AdminStatusBadge`

A colored badge showing a status value (e.g., Active, Inactive, Pending).

```tsx
import { AdminStatusBadge } from "@/components/admin";

<AdminStatusBadge status="active" />
```

---

### `RoleBadge`

A colored badge displaying a user's role.

```tsx
import { RoleBadge } from "@/components/admin";

<RoleBadge role="super_admin" />
```

---

### `ConfirmDeleteDialog`

A confirmation modal that appears before destructive actions like deletions.

```tsx
import { ConfirmDeleteDialog } from "@/components/admin";

<ConfirmDeleteDialog
  open={showDialog}
  onConfirm={handleDelete}
  onCancel={() => setShowDialog(false)}
  message="Are you sure you want to delete this user? This cannot be undone."
/>
```

---

## Component Summary Table

| Component | Purpose |
|---|---|
| `AdminPageLayout` | Page wrapper with consistent layout |
| `PageHeader` | Page title and subtitle |
| `FilterBar` | Search and filter controls |
| `TableStateRows` | Loading/empty/error table states |
| `TableActionMenu` | Row action dropdown (⋮) |
| `AdminPagination` | Page navigation for tables |
| `AdminStatusBadge` | Status indicator badge |
| `RoleBadge` | User role indicator badge |
| `ConfirmDeleteDialog` | Deletion confirmation modal |

---

## Related Pages

- [Admin Dashboard](../features/admin-dashboard.md) — Where these components are used
- [Kanban Board](kanban.md) — Specialized admin component
- [Sidebar](sidebar.md) — Navigation component
