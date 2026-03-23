# Shared Admin Components — Developer Guide

> **Who is this for?**
> This guide is written for beginners who are working on the Digital Logbook super-admin
> pages. It explains what each shared component does, all the options (props) it accepts,
> and shows exactly where and how to drop it into the three files you will be editing most:
>
> - `server/src/app/admin/projects/page.tsx`
> - `server/src/app/admin/reports/page.tsx`
> - `server/src/app/admin/users/page.tsx`
> - `server/src/components/admin-dashboard/SuperAdminDashboard.tsx`

---

## Table of Contents

- [Shared Admin Components — Developer Guide](#shared-admin-components--developer-guide)
  - [Table of Contents](#table-of-contents)
  - [1. Where do the components live?](#1-where-do-the-components-live)
  - [2. How to import them](#2-how-to-import-them)
  - [3. Component Reference](#3-component-reference)
    - [3.1 `AdminPageLayout`](#31-adminpagelayout)
    - [3.2 `PageHeader`](#32-pageheader)
    - [3.3 `FilterBar`](#33-filterbar)
      - [`FilterBar` (root)](#filterbar-root)
      - [`FilterBar.Field`](#filterbarfield)
      - [`FilterBar.Search`](#filterbarsearch)
    - [3.4 `TableStateRows`](#34-tablestaterows)
    - [3.5 `TableActionMenu`](#35-tableactionmenu)
    - [3.6 `AdminPagination`](#36-adminpagination)
    - [3.7 `AdminStatusBadge`](#37-adminstatusbadge)
    - [3.8 `RoleBadge`](#38-rolebadge)
    - [3.9 `ConfirmDeleteDialog`](#39-confirmdeletedialog)
  - [4. Page-by-Page Integration Guide](#4-page-by-page-integration-guide)
    - [4.1 `projects/page.tsx`](#41-projectspagetsx)
    - [4.2 `reports/page.tsx`](#42-reportspagetsx)
    - [4.3 `SuperAdminDashboard.tsx`](#43-superadmindashboardtsx)
    - [4.4 `users/page.tsx`](#44-userspagetsx)
  - [5. Quick Cheat Sheet](#5-quick-cheat-sheet)

---

## 1. Where do the components live?

All shared components are stored in one folder:

```
server/
  src/
    components/
      admin/                        ← shared folder
        AdminPageLayout.tsx
        AdminPagination.tsx
        AdminStatusBadge.tsx
        ConfirmDeleteDialog.tsx
        FilterBar.tsx
        PageHeader.tsx
        RoleBadge.tsx
        TableActionMenu.tsx
        TableStateRows.tsx
        index.ts                    ← barrel file (single import entry point)
```

> **What is the barrel file (`index.ts`)?**
> It re-exports every component so you can import all of them from one short path
> instead of writing a separate import line for every file.

---

## 2. How to import them

Add this one line at the top of any admin page file, then pick the components you need:

```tsx
import {
  AdminPageLayout,
  PageHeader,
  FilterBar,
  TableStateRows,
  TableActionMenu,
  AdminPagination,
  AdminStatusBadge,
  RoleBadge,
  ConfirmDeleteDialog,
} from "@/components/admin";
```

You do **not** need to import all of them — only the ones you use on that page.

---

## 3. Component Reference

---

### 3.1 `AdminPageLayout`

**File:** `components/admin/AdminPageLayout.tsx`

**What it does:**
Wraps every admin page with the sidebar (`AsideSidebar`) on the left and a flex
content area on the right. Instead of repeating the same `<div className="flex min-h-screen">
<AsideSidebar />` in every file, you just wrap your page content with this component.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | — | Your page content |
| `className` | `string` | No | `"bg-[#f5f7fb]"` | Tailwind background color class |

**Example:**

```tsx
// BEFORE (what projects/page.tsx currently does):
return (
  <div className="flex min-h-screen bg-[#f1f1f9]">
    <AsideSidebar />
    <div className="flex-1 p-8 space-y-6 min-w-0">
      {/* page content */}
    </div>
  </div>
);

// AFTER (using the shared component):
return (
  <AdminPageLayout className="bg-[#f1f1f9]">
    <div className="flex-1 p-8 space-y-6 min-w-0">
      {/* page content */}
    </div>
  </AdminPageLayout>
);
```

> **Tip:** Use `className="bg-[#f1f1f9]"` for projects and reports pages (slightly
> grey-purple). Use the default (no className) for the users page (light blue-grey).

---

### 3.2 `PageHeader`

**File:** `components/admin/PageHeader.tsx`

**What it does:**
Renders a page title on the left and an optional action button (like "Create New
Project") on the right. Comes in two visual styles called `variant`.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ Yes | — | The big heading text |
| `subtitle` | `string` | No | — | Smaller grey text below the title |
| `action` | `ReactNode` | No | — | Button or element on the right side |
| `variant` | `"inline"` \| `"banner"` | No | `"inline"` | Visual style (see below) |

**`variant` explained:**

- `"inline"` — plain title + action inside a Card. Used by Projects and Reports pages.
- `"banner"` — full-width white bar with a bottom border. Used by the Invitations page.

**Example — Projects page (inline):**

```tsx
// BEFORE:
<div className="flex items-center justify-between">
  <h1 className="text-page-title text-[#0A0A0A]">Projects</h1>
  <Button onClick={() => setShowCreate(true)}>
    + Create New Project
  </Button>
</div>

// AFTER:
<PageHeader
  title="Projects"
  action={
    <Button
      className="bg-[#0A0A0A] text-white hover:bg-[#333]"
      onClick={() => { setCreateForm(EMPTY_FORM); setShowCreate(true); }}
    >
      + Create New Project
    </Button>
  }
/>
```

**Example — Reports page (inline with disabled button):**

```tsx
<PageHeader
  title="Reports"
  action={
    <Button
      className="bg-[#0A0A0A] text-white hover:bg-[#333]"
      disabled={isExporting || isLoading}
      onClick={generatePDF}
    >
      {isExporting ? "Generating..." : "Generate Report"}
    </Button>
  }
/>
```

---

### 3.3 `FilterBar`

**File:** `components/admin/FilterBar.tsx`

**What it does:**
Renders a styled horizontal bar containing filter dropdowns and/or a search box.
It is a **compound component**, meaning it has two built-in sub-components you use
as child tags: `FilterBar.Field` and `FilterBar.Search`.

#### `FilterBar` (root)
Just a styled wrapper. Put `FilterBar.Field` and `FilterBar.Search` inside it.

#### `FilterBar.Field`

Wraps one filter control (a `<Select>`, a date input, etc.) with a small uppercase
label above it.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | ✅ Yes | Short label shown above the control (e.g. `"Role"`) |
| `children` | `ReactNode` | ✅ Yes | The actual filter control |
| `className` | `string` | No | Extra Tailwind classes |

#### `FilterBar.Search`

A pre-styled search input with a magnifier icon. Automatically floats to the right.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `string` | ✅ Yes | — | Current search text (from your state) |
| `onChange` | `(value: string) => void` | ✅ Yes | — | Called every time the user types |
| `placeholder` | `string` | No | `"Search..."` | Input placeholder text |

**Example — Projects page (domain filter only, no search):**

```tsx
// BEFORE:
<div className="flex flex-wrap gap-3 items-center">
  <Select value={domainFilter} onValueChange={(v) => { setDomainFilter(v); setPage(1); }}>
    <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
      <SelectValue placeholder="Domain" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Domains</SelectItem>
      <SelectItem value="software">Software</SelectItem>
      {/* ... */}
    </SelectContent>
  </Select>
</div>

// AFTER:
<FilterBar>
  <FilterBar.Field label="Domain">
    <Select
      value={domainFilter}
      onValueChange={(v) => { setDomainFilter(v); setPage(1); }}
    >
      <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
        <SelectValue placeholder="Domain" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Domains</SelectItem>
        <SelectItem value="software">Software</SelectItem>
        <SelectItem value="film">Film</SelectItem>
        <SelectItem value="training">Training</SelectItem>
        <SelectItem value="research">Research</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </FilterBar.Field>
</FilterBar>
```

**Example — Reports page (project + mentor + date filters):**

```tsx
<FilterBar>
  <FilterBar.Field label="Project">
    <Select value={projectFilter} onValueChange={(v) => { setProjectFilter(v); setPage(1); }}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Projects" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>
        {projectOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Field label="Mentor">
    <Select value={mentorFilter} onValueChange={(v) => { setMentorFilter(v); setPage(1); }}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Mentors" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Mentors</SelectItem>
        {mentorOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Field label="From">
    <input
      type="date"
      value={dateFrom}
      max={dateTo || undefined}
      onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
      className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm bg-white"
    />
  </FilterBar.Field>

  <FilterBar.Field label="To">
    <input
      type="date"
      value={dateTo}
      min={dateFrom || undefined}
      onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
      className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm bg-white"
    />
  </FilterBar.Field>
</FilterBar>
```

---

### 3.4 `TableStateRows`

**File:** `components/admin/TableStateRows.tsx`

**What it does:**
Renders a single full-width row inside `<TableBody>` to show one of three states:
**loading**, **error**, or **empty**. Without this component, every page manually
writes three separate `if` blocks inside the table body. Now you write it once.

> ⚠️ **Important:** Place this component as the **first child** inside `<TableBody>`.
> The regular data rows come after it.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `colSpan` | `number` | ✅ Yes | — | How many columns the table has (to span the full width) |
| `loading` | `boolean` | ✅ Yes | — | `true` while data is being fetched |
| `error` | `string \| boolean \| null` | No | — | Pass your error message or `true`; pass `null`/`false` when there is no error |
| `empty` | `boolean` | No | — | `true` when the data array has zero items |
| `loadingMessage` | `string` | No | `"Loading..."` | Text shown while loading |
| `emptyMessage` | `string` | No | `"No records found."` | Text shown when empty |

**Example — Projects page (7 columns):**

```tsx
// BEFORE:
<TableBody>
  {loading && (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12 text-[#737373]">
        Loading projects…
      </TableCell>
    </TableRow>
  )}
  {!loading && displayedProjects.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-12 text-[#737373]">
        No projects found.
      </TableCell>
    </TableRow>
  )}
  {displayedProjects.map((project) => (
    <TableRow key={project.id}>...</TableRow>
  ))}
</TableBody>

// AFTER:
<TableBody>
  <TableStateRows
    colSpan={7}
    loading={loading}
    empty={!loading && displayedProjects.length === 0}
    loadingMessage="Loading projects…"
    emptyMessage="No projects found."
  />
  {!loading && displayedProjects.map((project) => (
    <TableRow key={project.id}>...</TableRow>
  ))}
</TableBody>
```

**Example — Reports page (4 columns, includes error state):**

```tsx
<TableBody>
  <TableStateRows
    colSpan={4}
    loading={isLoading}
    error={fetchError}
    empty={!isLoading && visibleReports.length === 0}
    loadingMessage="Loading reports..."
    emptyMessage="No reports found for the selected filters."
  />
  {!isLoading && !fetchError && visibleReports.map((report) => (
    <TableRow key={report.id}>...</TableRow>
  ))}
</TableBody>
```

---

### 3.5 `TableActionMenu`

**File:** `components/admin/TableActionMenu.tsx`

**What it does:**
Renders the three-dot (**⋮**) button at the end of each table row that opens a
dropdown menu with actions like "View Details", "Edit", or "Delete".

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `items` | `ActionItem[]` | ✅ Yes | — | Array of menu items (see below) |
| `ariaLabel` | `string` | No | `"Row actions"` | Screen reader label for the button |

**`ActionItem` object shape:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `label` | `string` | ✅ Yes | — | Text shown in the menu |
| `onSelect` | `() => void` | ✅ Yes | — | Function called when user clicks this item |
| `variant` | `"default"` \| `"danger"` | No | `"default"` | `"danger"` makes the text red |
| `icon` | `ReactNode` | No | — | Icon shown before the label |
| `separator` | `boolean` | No | `false` | Draws a divider line **above** this item |

**Example — Projects page:**

```tsx
// BEFORE:
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#737373]">
      <MoreVertical size={16} />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-44">
    <DropdownMenuItem onSelect={() => setViewProject(project)}>View Details</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => openEdit(project)}>Edit Project</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600 focus:bg-red-50"
      onSelect={() => setDeleteId(project.id)}
    >
      <Trash2 size={14} className="mr-2" /> Delete Project
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

// AFTER:
<TableActionMenu
  ariaLabel={`Actions for ${project.name}`}
  items={[
    { label: "View Details",   onSelect: () => setViewProject(project) },
    { label: "Edit Project",   onSelect: () => openEdit(project) },
    {
      label: "Delete Project",
      onSelect: () => setDeleteId(project.id),
      variant: "danger",
      separator: true,
      icon: <Trash2 size={14} />,
    },
  ]}
/>
```

---

### 3.6 `AdminPagination`

**File:** `components/admin/AdminPagination.tsx`

**What it does:**
Renders the pagination footer at the bottom of a table. Shows "Showing X to Y of Z
results" on the left and page number buttons (Previous / 1 / 2 / 3 / Next) on the right.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `page` | `number` | ✅ Yes | — | Current active page number (starts at 1) |
| `totalPages` | `number` | ✅ Yes | — | Total number of pages |
| `total` | `number` | ✅ Yes | — | Total number of records (after filtering) |
| `itemsPerPage` | `number` | No | `10` | Used to calculate the "Showing X to Y" label |
| `onPageChange` | `(page: number) => void` | ✅ Yes | — | Called when user clicks a page button |

**Example — Projects page (`ITEMS_PER_PAGE = 10`):**

```tsx
// BEFORE (inline pagination block):
<div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
  <p className="text-sm text-[#737373]">
    Showing <span>{...}</span> to <span>{...}</span> of <span>{filtered.length}</span> results
  </p>
  <Pagination className="w-auto">
    {/* ... many lines of PaginationItem code ... */}
  </Pagination>
</div>

// AFTER:
<AdminPagination
  page={currentPage}
  totalPages={totalPages}
  total={filtered.length}
  itemsPerPage={ITEMS_PER_PAGE}
  onPageChange={setPage}
/>
```

**Example — Reports page (`ITEMS_PER_PAGE = 5`):**

```tsx
<AdminPagination
  page={safePage}
  totalPages={totalPages}
  total={filteredReports.length}
  itemsPerPage={ITEMS_PER_PAGE}
  onPageChange={setPage}
/>
```

> **Where to place it:** Put it directly after the closing `</Table>` tag, still inside
> the same `<Card>`.

---

### 3.7 `AdminStatusBadge`

**File:** `components/admin/AdminStatusBadge.tsx`

**What it does:**
Shows a small coloured pill with a status label. Replaces the two separate
`StatusBadge` files that existed before. Works for all three status types:

| Usage Context | Pass this value | Shows |
|---------------|----------------|-------|
| Invitation | `"Pending"` | 🟡 Pending |
| Invitation | `"Accepted"` | 🟢 Active |
| Invitation | `"Expired"` | 🔴 Expired |
| User | `"Active"` | 🔵 Active |
| User | `"Inactive"` | ⚪ Inactive |
| Project | `"active"` | 🟢 Active |
| Project | `"pending"` | 🟡 Pending |
| Project | `"delayed"` | 🔴 Delayed |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `string` | ✅ Yes | One of the status values listed above |

**Example — inside a table row:**

```tsx
// Project status in RecentProjectsTable:
<TableCell>
  <AdminStatusBadge status={project.status} />
</TableCell>

// Invitation status:
<TableCell>
  <AdminStatusBadge status={inv.status} />
</TableCell>
```

---

### 3.8 `RoleBadge`

**File:** `components/admin/RoleBadge.tsx`

**What it does:**
Shows a small coloured pill for user roles. Accepts both the API format
(`"student"`, `"superAdmin"`) and the display format (`"Student"`, `"SuperAdmin"`).

| Role value | Colour |
|------------|--------|
| `"student"` / `"Student"` | Grey |
| `"mentor"` / `"Mentor"` | Green |
| `"superAdmin"` / `"SuperAdmin"` | Indigo/Purple |

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `role` | `string` | ✅ Yes | Role value (see table above) |

**Example:**

```tsx
// Inside a table row:
<TableCell>
  <RoleBadge role={user.role} />
</TableCell>

// Hardcoded value:
<RoleBadge role="superAdmin" />
```

---

### 3.9 `ConfirmDeleteDialog`

**File:** `components/admin/ConfirmDeleteDialog.tsx`

**What it does:**
Shows a confirmation popup (modal) when the user wants to delete something. Has a
red "Delete" button and a "Cancel" button. Disables both buttons and shows "Deleting…"
while the delete operation is in progress.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `open` | `boolean` | ✅ Yes | — | `true` = dialog is visible |
| `onOpenChange` | `(open: boolean) => void` | ✅ Yes | — | Called when user closes the dialog |
| `onConfirm` | `() => void` | ✅ Yes | — | Called when user clicks the Delete button |
| `isPending` | `boolean` | ✅ Yes | — | `true` while the delete is in progress |
| `title` | `string` | No | `"Confirm Delete"` | Heading text inside the dialog |
| `description` | `string` | No | `"This action cannot be undone."` | Warning text |
| `confirmLabel` | `string` | No | `"Delete"` | Text on the red button |

**Example — Projects page:**

```tsx
// You need these two state variables somewhere above your return():
const [deleteId, setDeleteId] = useState<string | null>(null);
const [deleting, setDeleting] = useState(false);

// The dialog tag goes OUTSIDE the main return div, at the bottom of the component:
<ConfirmDeleteDialog
  open={!!deleteId}
  onOpenChange={(open) => !open && setDeleteId(null)}
  onConfirm={handleDelete}
  isPending={deleting}
  title="Delete Project"
  description="This will permanently delete the project and all associated data. This action cannot be undone."
/>
```

**Example — Reports page (reports don't have delete but if added):**

```tsx
<ConfirmDeleteDialog
  open={!!deleteId}
  onOpenChange={(open) => !open && setDeleteId(null)}
  onConfirm={handleDelete}
  isPending={isDeleting}
  title="Delete Report"
  description="This will permanently remove this report entry."
  confirmLabel="Yes, Delete"
/>
```

> **How to trigger it:** When the user clicks "Delete" in the `TableActionMenu`,
> set the delete ID: `onSelect: () => setDeleteId(project.id)`.
> The dialog becomes visible because `open={!!deleteId}` becomes `true`.

---

## 4. Page-by-Page Integration Guide

---

### 4.1 `projects/page.tsx`

**File:** `server/src/app/admin/projects/page.tsx`

**Components to use and where:**

```
projects/page.tsx
│
├── 1. AdminPageLayout          ← wraps the entire return()
├── 2. PageHeader               ← replaces the title + "Create New Project" button div
├── 3. FilterBar                ← replaces the domain filter div
│      └── FilterBar.Field      ← wraps the Select dropdown
├── 4. TableStateRows           ← first child inside <TableBody>
├── 5. TableActionMenu          ← inside each <TableRow>, last <TableCell>
├── 6. AdminPagination          ← replaces the pagination div below </Table>
└── 7. ConfirmDeleteDialog      ← replaces the AlertDialog for project deletion
```

**Step-by-step:**

**Step 1** — Add the import at the top of the file:
```tsx
import {
  AdminPageLayout,
  PageHeader,
  FilterBar,
  TableStateRows,
  TableActionMenu,
  AdminPagination,
  ConfirmDeleteDialog,
} from "@/components/admin";
```

**Step 2** — Wrap the return with `AdminPageLayout`:
```tsx
// Find this at the start of return():
<div className="flex min-h-screen bg-[#f1f1f9]">
  <AsideSidebar />
  <div className="flex-1 p-8 space-y-6 min-w-0">

// Replace with:
<AdminPageLayout className="bg-[#f1f1f9]">
  <div className="flex-1 p-8 space-y-6 min-w-0">
```
Also remove `import AsideSidebar from "@/components/AsideSidebar"` (no longer needed directly).

**Step 3** — Replace the page title block:
```tsx
// Find:
<div className="flex items-center justify-between">
  <h1 className="text-page-title text-[#0A0A0A]">Projects</h1>
  <Button className="bg-[#0A0A0A] ..." onClick={() => { ... }}>
    + Create New Project
  </Button>
</div>

// Replace with:
<PageHeader
  title="Projects"
  action={
    <Button
      className="bg-[#0A0A0A] text-white hover:bg-[#333] flex items-center gap-2"
      onClick={() => { setCreateForm(EMPTY_FORM); setShowCreate(true); }}
    >
      + Create New Project
    </Button>
  }
/>
```

**Step 4** — Replace the filter div:
```tsx
// Find:
<div className="flex flex-wrap gap-3 items-center">
  <Select value={domainFilter} ...>
    ...
  </Select>
  {domainFilter !== "all" && <Button ...>Reset</Button>}
</div>

// Replace with:
<FilterBar>
  <FilterBar.Field label="Domain">
    <Select
      value={domainFilter}
      onValueChange={(v) => { setDomainFilter(v); setPage(1); }}
    >
      <SelectTrigger className="w-[140px] bg-white border-[#E5E5E5]">
        <SelectValue placeholder="Domain" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Domains</SelectItem>
        <SelectItem value="software">Software</SelectItem>
        <SelectItem value="film">Film</SelectItem>
        <SelectItem value="training">Training</SelectItem>
        <SelectItem value="research">Research</SelectItem>
        <SelectItem value="other">Other</SelectItem>
      </SelectContent>
    </Select>
  </FilterBar.Field>
  {domainFilter !== "all" && (
    <Button variant="ghost" className="text-[#737373]" onClick={() => { setDomainFilter("all"); setPage(1); }}>
      Reset
    </Button>
  )}
</FilterBar>
```

**Step 5** — Replace loading/empty rows inside `<TableBody>`:
```tsx
// Find these two if-blocks inside <TableBody>:
{loading && ( <TableRow>...</TableRow> )}
{!loading && displayedProjects.length === 0 && ( <TableRow>...</TableRow> )}

// Replace with ONE line:
<TableStateRows
  colSpan={7}
  loading={loading}
  empty={!loading && displayedProjects.length === 0}
  loadingMessage="Loading projects…"
  emptyMessage="No projects found."
/>
```

**Step 6** — Replace the action dropdown in each row:
```tsx
// Find the <DropdownMenu>...</DropdownMenu> inside the last <TableCell>:

// Replace with:
<TableActionMenu
  ariaLabel={`Actions for ${project.name}`}
  items={[
    { label: "View Details",  onSelect: () => setViewProject(project) },
    { label: "Edit Project",  onSelect: () => openEdit(project) },
    {
      label: "Delete Project",
      onSelect: () => setDeleteId(project.id),
      variant: "danger",
      separator: true,
      icon: <Trash2 size={14} />,
    },
  ]}
/>
```

**Step 7** — Replace the pagination div:
```tsx
// Find the div with "Showing ... to ... of ... results" and the <Pagination> block

// Replace the entire div with:
<AdminPagination
  page={currentPage}
  totalPages={totalPages}
  total={filtered.length}
  itemsPerPage={ITEMS_PER_PAGE}
  onPageChange={setPage}
/>
```

**Step 8** — Replace the delete AlertDialog:
```tsx
// Find:
<AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
  <AlertDialogContent>
    ...
  </AlertDialogContent>
</AlertDialog>

// Replace with:
<ConfirmDeleteDialog
  open={!!deleteId}
  onOpenChange={(open) => !open && setDeleteId(null)}
  onConfirm={handleDelete}
  isPending={deleting}
  title="Delete Project"
  description="This will permanently delete the project and all associated data. This action cannot be undone."
/>
```

**Imports you can now REMOVE** from the file after this refactor:
- `import AsideSidebar from "@/components/AsideSidebar"`
- `AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle` from `@/components/ui/alert-dialog`
- `MoreVertical` from `lucide-react`
- `Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious` from `@/components/ui/pagination`
- `DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger` from `@/components/dropdown-menu`

---

### 4.2 `reports/page.tsx`

**File:** `server/src/app/admin/reports/page.tsx`

**Components to use and where:**

```
reports/page.tsx
│
├── 1. AdminPageLayout          ← wraps the entire return()
├── 2. PageHeader               ← replaces the title + "Generate Report" button div
├── 3. FilterBar                ← replaces the filter div above the table
│      ├── FilterBar.Field      ← wraps each Select and date input
├── 4. TableStateRows           ← first child inside <TableBody>
└── 5. AdminPagination          ← replaces the pagination div below </Table>
```

> Reports page has **no delete** and **no action dropdown**, so `ConfirmDeleteDialog`,
> `TableActionMenu`, `RoleBadge` and `AdminStatusBadge` are not needed here.

**Step 1** — Add the import:
```tsx
import {
  AdminPageLayout,
  PageHeader,
  FilterBar,
  TableStateRows,
  AdminPagination,
} from "@/components/admin";
```

**Step 2** — Wrap with `AdminPageLayout`:
```tsx
// Find:
<div className="flex min-h-screen bg-[#f1f1f9]">
  <AsideSidebar />
  <div className="flex-1 p-8 space-y-6">

// Replace with:
<AdminPageLayout className="bg-[#f1f1f9]">
  <div className="flex-1 p-8 space-y-6">
```

**Step 3** — Replace the title block:
```tsx
// Find:
<div className="flex items-center justify-between">
  <h1 className="text-page-title text-[#0A0A0A]">Reports</h1>
  <Button className="bg-[#0A0A0A] ..." disabled={...} onClick={generatePDF}>
    {isExporting ? "Generating..." : "Generate Report"}
  </Button>
</div>

// Replace with:
<PageHeader
  title="Reports"
  action={
    <Button
      className="bg-[#0A0A0A] text-white hover:bg-[#333]"
      disabled={isExporting || isLoading}
      onClick={generatePDF}
    >
      {isExporting ? "Generating..." : "Generate Report"}
    </Button>
  }
/>
```

**Step 4** — Replace the filter section:
```tsx
// Find the div that contains the Project, Mentor, From, To selects and the Reset button

// Replace with:
<FilterBar>
  <FilterBar.Field label="Project">
    <Select value={projectFilter} onValueChange={(v) => { setProjectFilter(v); setPage(1); }}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Projects" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Projects</SelectItem>
        {projectOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Field label="Mentor">
    <Select value={mentorFilter} onValueChange={(v) => { setMentorFilter(v); setPage(1); }}>
      <SelectTrigger className="w-[160px]"><SelectValue placeholder="All Mentors" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Mentors</SelectItem>
        {mentorOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Field label="From">
    <input type="date" value={dateFrom} max={dateTo || undefined}
      onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
      className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm bg-white" />
  </FilterBar.Field>

  <FilterBar.Field label="To">
    <input type="date" value={dateTo} min={dateFrom || undefined}
      onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
      className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm bg-white" />
  </FilterBar.Field>

  <Button variant="ghost" className="text-[#737373] hover:text-[#0A0A0A]" onClick={resetFilters}>
    Reset
  </Button>
</FilterBar>
```

**Step 5** — Replace loading/error/empty rows inside `<TableBody>`:
```tsx
<TableStateRows
  colSpan={4}
  loading={isLoading}
  error={fetchError}
  empty={!isLoading && visibleReports.length === 0}
  loadingMessage="Loading reports..."
  emptyMessage="No reports found for the selected filters."
/>
```

**Step 6** — Replace the pagination block:
```tsx
<AdminPagination
  page={safePage}
  totalPages={totalPages}
  total={filteredReports.length}
  itemsPerPage={ITEMS_PER_PAGE}
  onPageChange={setPage}
/>
```

**Imports you can now REMOVE:**
- `import AsideSidebar from "@/components/AsideSidebar"`
- `Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious` from `@/components/ui/pagination`

---

### 4.3 `SuperAdminDashboard.tsx`

**File:** `server/src/components/admin-dashboard/SuperAdminDashboard.tsx`

**Components to use and where:**

```
SuperAdminDashboard.tsx
│
├── 1. AdminPageLayout          ← wraps the entire return()
└── 2. AdminStatusBadge         ← inside RecentProjectsTable for project status
```

> The dashboard already has its own `DashboardHeader`, `StatsGrid`, and
> `RecentProjectsTable` sub-components, so most of the heavy lifting is done.
> The main gain here is replacing `AsideSidebar` with `AdminPageLayout` and
> adopting `AdminStatusBadge` in `RecentProjectsTable.tsx`.

**Step 1** — Add the import in `SuperAdminDashboard.tsx`:
```tsx
import { AdminPageLayout } from "@/components/admin";
```

**Step 2** — Wrap the return:
```tsx
// Find:
return (
  <div className="flex min-h-screen">
    <AsideSidebar />
    <div className="flex-1 ...">

// Replace with:
return (
  <AdminPageLayout>
    <div className="flex-1 ...">
```

**Step 3** — In `RecentProjectsTable.tsx`, adopt `AdminStatusBadge`:
```tsx
// Add import at the top of RecentProjectsTable.tsx:
import { AdminStatusBadge } from "@/components/admin";

// Find the existing StatusBadge usage:
import StatusBadge, { ProjectStatus } from "./StatusBadge";
// ...
<StatusBadge status={project.status} />

// Replace with:
<AdminStatusBadge status={project.status} />
```

This means you no longer need `components/admin-dashboard/StatusBadge.tsx` for new
work — the unified `AdminStatusBadge` handles it.

---

### 4.4 `users/page.tsx`

**File:** `server/src/app/admin/users/page.tsx`

**What this page does:**
Lists every user registered in the system. Admins can filter by role and status,
search by name/email/ID, view a user's full details, change their active status,
and delete accounts.

**Components used from `@/components/admin`:**

| Shared Component | Replaces |
|-----------------|----------|
| `AdminPageLayout` | `<div className="flex min-h-screen"> <AsideSidebar />` |
| `PageHeader` | Inline title + subtitle `<div>` |
| `FilterBar` + `.Field` + `.Search` | Hand-rolled filter bar with custom label `<p>` tags |
| `TableStateRows` | Three separate loading / error / empty `<TableRow>` blocks |
| `TableActionMenu` | `<DropdownMenu>` in each row |
| `RoleBadge` | `roleClass()` helper + inline `<span>` |
| `AdminStatusBadge` | `statusClass()` helper + inline `<span>` |
| `AdminPagination` | Showing-count `<p>` + `<Pagination>` block |
| `ConfirmDeleteDialog` | The delete `<AlertDialog>` |

> **Note — Change Status dialog:** The users page has a **second** dialog
> (`statusUser` / `handleChangeStatus`) that toggles a user between Active and
> Inactive. There is no shared component for this yet, so keep that `<AlertDialog>`
> block as-is for now.

---

#### Step 1 — Add the import

At the top of `users/page.tsx`, add one import line and remove the imports that
are no longer needed:

```tsx
// ADD this line:
import {
  AdminPageLayout,
  PageHeader,
  FilterBar,
  TableStateRows,
  TableActionMenu,
  RoleBadge,
  AdminStatusBadge,
  AdminPagination,
  ConfirmDeleteDialog,
} from "@/components/admin";

// REMOVE these (they are now covered by the shared components above):
// import AsideSidebar from "@/components/AsideSidebar";
// import { EllipsisVertical, Search } from "lucide-react"; // ← Search only; keep EllipsisVertical if used elsewhere
// import { AlertDialog, AlertDialogAction, AlertDialogCancel,
//   AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
//   AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"; // Keep ONE block for the Change Status dialog
// import { Pagination, PaginationContent, PaginationEllipsis,
//   PaginationItem, PaginationLink } from "@/components/ui/pagination";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/dropdown-menu";
```

> **Tip:** Keep the `AlertDialog` import — you still need it for the **Change Status**
> dialog. Remove everything else that the shared components replace.

---

#### Step 2 — Wrap with `AdminPageLayout`

```tsx
// BEFORE:
return (
  <>
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <AsideSidebar />
      <div className="flex-1 p-5 md:p-8">
        {/* ... */}
      </div>
    </div>
    {/* dialogs below */}
  </>
);

// AFTER:
return (
  <>
    <AdminPageLayout>
      <div className="flex-1 p-5 md:p-8">
        {/* ... */}
      </div>
    </AdminPageLayout>
    {/* dialogs below */}
  </>
);
```

> `AdminPageLayout` uses `bg-[#f5f7fb]` as its default background — exactly what
> the users page already used, so no `className` override is needed.

---

#### Step 3 — Replace the title block with `PageHeader`

```tsx
// BEFORE:
<div>
  <h1 className="text-page-title text-slate-900">User Administration</h1>
  <p className="mt-1 text-sm text-slate-500">
    Manage system users, define their platform roles, and monitor account statuses.
  </p>
</div>

// AFTER:
<PageHeader
  title="User Administration"
  subtitle="Manage system users, define their platform roles, and monitor account statuses."
/>
```

---

#### Step 4 — Replace the filter bar with `FilterBar`

```tsx
// BEFORE:
<div className="flex flex-wrap items-end gap-3 rounded-lg border border-[#e4e7ed] bg-[#f8fafc] p-3">
  <div className="space-y-1">
    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Role</p>
    <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value as "all" | UserRole); setPage(1); }}>
      <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="Student">Student</SelectItem>
        <SelectItem value="Mentor">Mentor</SelectItem>
        <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-1">
    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Status</p>
    <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value as "all" | UserStatus); setPage(1); }}>
      <SelectTrigger className="h-8 w-[140px] bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="ml-auto w-full sm:w-auto space-y-1">
    <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Search</p>
    <div className="relative">
      <Search className="..." />
      <input ... />
    </div>
  </div>
</div>

// AFTER:
<FilterBar>
  <FilterBar.Field label="Role">
    <Select
      value={roleFilter}
      onValueChange={(value) => { setRoleFilter(value as "all" | UserRole); setPage(1); }}
    >
      <SelectTrigger className="h-8 w-[130px] bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="Student">Student</SelectItem>
        <SelectItem value="Mentor">Mentor</SelectItem>
        <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Field label="Status">
    <Select
      value={statusFilter}
      onValueChange={(value) => { setStatusFilter(value as "all" | UserStatus); setPage(1); }}
    >
      <SelectTrigger className="h-8 w-[140px] bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  </FilterBar.Field>

  <FilterBar.Search
    value={search}
    onChange={(value) => { setSearch(value); setPage(1); }}
    placeholder="Search by name, email, or ID..."
  />
</FilterBar>
```

---

#### Step 5 — Replace loading / error / empty rows with `TableStateRows`

The table has **5 columns** (`colSpan={5}`).

```tsx
// BEFORE:
<TableBody>
  {isLoading ? (
    <TableRow>
      <TableCell colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
        Loading users...
      </TableCell>
    </TableRow>
  ) : fetchError ? (
    <TableRow>
      <TableCell colSpan={5} className="px-4 py-8 text-center text-sm text-red-500">
        {fetchError}
      </TableCell>
    </TableRow>
  ) : visibleUsers.length === 0 ? (
    <TableRow>
      <TableCell colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
        No users found for the selected filters.
      </TableCell>
    </TableRow>
  ) : (
    visibleUsers.map((user) => ( /* rows */ ))
  )}
</TableBody>

// AFTER:
<TableBody>
  <TableStateRows
    colSpan={5}
    loading={isLoading}
    error={fetchError}
    empty={!isLoading && !fetchError && visibleUsers.length === 0}
    loadingMessage="Loading users..."
    emptyMessage="No users found for the selected filters."
  />
  {!isLoading && !fetchError && visibleUsers.map((user) => (
    <TableRow key={user.id} className="bg-white hover:bg-[#fbfcff]">
      {/* ...cells unchanged... */}
    </TableRow>
  ))}
</TableBody>
```

---

#### Step 6 — Replace role badge with `RoleBadge`

```tsx
// BEFORE:
<TableCell className="px-4 py-3">
  <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${roleClass(user.role)}`}>
    {user.role}
  </span>
</TableCell>

// AFTER:
<TableCell className="px-4 py-3">
  <RoleBadge role={user.role} />
</TableCell>
```

You can now also **delete** the `roleClass()` helper function — it is no longer needed.

---

#### Step 7 — Replace status badge with `AdminStatusBadge`

```tsx
// BEFORE:
<TableCell className="px-4 py-3">
  <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${statusClass(user.status)}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-blue-500" : "bg-red-500"}`} />
    {user.status}
  </span>
</TableCell>

// AFTER:
<TableCell className="px-4 py-3">
  <AdminStatusBadge status={user.status} />
</TableCell>
```

You can now also **delete** the `statusClass()` helper function.

---

#### Step 8 — Replace the Actions dropdown with `TableActionMenu`

```tsx
// BEFORE:
<TableCell className="px-4 py-3 text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button type="button" aria-label={`Actions for ${user.name}`}>
        <EllipsisVertical className="h-4 w-4" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44">
      <DropdownMenuItem onSelect={() => setViewUser(user)}>View Details</DropdownMenuItem>
      <DropdownMenuItem onSelect={() => { setStatusUser(user); setPendingStatus(user.status === "Active" ? "Inactive" : "Active"); }}>
        Change Status
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600 ..." onSelect={() => setDeleteUserId(user.id)}>
        Delete User
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>

// AFTER:
<TableCell className="px-4 py-3 text-right">
  <TableActionMenu
    ariaLabel={`Actions for ${user.name}`}
    items={[
      {
        label: "View Details",
        onSelect: () => setViewUser(user),
      },
      {
        label: "Change Status",
        onSelect: () => {
          setStatusUser(user);
          setPendingStatus(user.status === "Active" ? "Inactive" : "Active");
        },
      },
      { separator: true, label: "", onSelect: () => {} },
      {
        label: "Delete User",
        variant: "danger",
        onSelect: () => setDeleteUserId(user.id),
      },
    ]}
  />
</TableCell>
```

---

#### Step 9 — Replace pagination with `AdminPagination`

```tsx
// BEFORE:
<div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
  <p className="text-sm text-slate-500">
    Showing {startCount} to {endCount} of {filteredUsers.length} users
  </p>
  <Pagination className="mx-0 w-auto justify-end">
    <PaginationContent>
      {/* Previous / page-number / Next buttons */}
    </PaginationContent>
  </Pagination>
</div>

// AFTER:
<AdminPagination
  page={safePage}
  totalPages={totalPages}
  total={filteredUsers.length}
  itemsPerPage={ITEMS_PER_PAGE}
  onPageChange={goToPage}
/>
```

You can now delete the `startCount` / `endCount` variables and the `goToPage` helper
(or keep `goToPage` if `AdminPagination`'s `onPageChange` calls it directly — either
way is fine).

---

#### Step 10 — Replace the Delete `AlertDialog` with `ConfirmDeleteDialog`

```tsx
// BEFORE (somewhere after the return's main div):
<AlertDialog open={deleteUserId !== null} onOpenChange={(open) => { if (!open) setDeleteUserId(null); }}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete User</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. The user account and all associated data will
        be permanently removed.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700 text-white"
        disabled={isMutating}
        onClick={handleDeleteUser}
      >
        {isMutating ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// AFTER:
<ConfirmDeleteDialog
  open={deleteUserId !== null}
  onOpenChange={(open) => { if (!open) setDeleteUserId(null); }}
  onConfirm={handleDeleteUser}
  isPending={isMutating}
  title="Delete User"
  description="This action cannot be undone. The user account and all associated data will be permanently removed."
/>
```

> **Keep the Change Status `<AlertDialog>` as-is** — there is no shared component
> for it yet. The `statusUser` / `handleChangeStatus` dialog stays unchanged.

---

## 5. Quick Cheat Sheet

| Component | File | Replaces |
|-----------|------|---------|
| `<AdminPageLayout>` | `admin/AdminPageLayout.tsx` | `<div className="flex min-h-screen"> <AsideSidebar />` |
| `<PageHeader>` | `admin/PageHeader.tsx` | Title + action button divs |
| `<FilterBar>` + `<FilterBar.Field>` + `<FilterBar.Search>` | `admin/FilterBar.tsx` | Filter row divs with labels |
| `<TableStateRows>` | `admin/TableStateRows.tsx` | Loading / error / empty `<TableRow>` blocks |
| `<TableActionMenu>` | `admin/TableActionMenu.tsx` | `<DropdownMenu>` in table rows |
| `<AdminPagination>` | `admin/AdminPagination.tsx` | Pagination div with count + page buttons |
| `<AdminStatusBadge>` | `admin/AdminStatusBadge.tsx` | Both old `StatusBadge` files |
| `<RoleBadge>` | `admin/RoleBadge.tsx` | Inline `roleClass()` spans |
| `<ConfirmDeleteDialog>` | `admin/ConfirmDeleteDialog.tsx` | Delete `<AlertDialog>` |

**Single import line covers all of the above:**
```tsx
import {
  AdminPageLayout, PageHeader, FilterBar,
  TableStateRows, TableActionMenu, AdminPagination,
  AdminStatusBadge, RoleBadge, ConfirmDeleteDialog,
} from "@/components/admin";
```

---

> **To convert this file to PDF:**
> - **VS Code:** Install the "Markdown PDF" extension → right-click this file → *Export (pdf)*
> - **Browser:** Open the preview panel → right-click → *Print* → *Save as PDF*
> - **Online:** Paste into [markdowntopdf.com](https://www.markdowntopdf.com)
