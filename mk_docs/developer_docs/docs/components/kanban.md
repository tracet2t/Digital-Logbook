# Kanban Board Component

The Kanban Board provides a visual, drag-and-drop interface for managing project and student assignments in the admin dashboard.

---

## Overview

Instead of managing assignments through tables, the Kanban Board lets admins move students between projects (or between "assigned" and "bench" states) by simply dragging cards.

**Used in:** Admin Dashboard  
**Component:** `server/src/components/admin/kanban/KanbanBoard.tsx`  
**Hook:** `server/src/hooks/useKanbanBoard.ts`

---

## What the Kanban Board Shows

The board is divided into **columns**, where each column represents a project (or the "Bench" — unassigned students):

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Bench 🪑       │  │  Project Alpha  │  │  Project Beta   │
│─────────────────│  │─────────────────│  │─────────────────│
│  [Jane Doe]     │  │  [Bob Smith]    │  │  [Alice Lee]    │
│  [Mark Chen]    │  │  [Sara Kim]     │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

- **Bench** — Students not currently assigned to a project
- **Project columns** — Students currently assigned to that project

---

## How to Use the Kanban Board

### Assigning a Student to a Project

1. Find the student's card (in the Bench or another project)
2. Drag it to the target project column
3. A confirmation dialog appears — confirm the assignment
4. The student is assigned to the project

### Unassigning a Student (Back to Bench)

1. Drag the student's card from a project column to the **Bench** column
2. Confirm the action in the dialog
3. The student is marked as inactive/unassigned

!!! warning "Moving to Bench = Inactive"
    Moving a student to the Bench column marks them as **inactive** on that project. This is intentional — the Bench represents students between assignments.

### Cancelling an Action

If you drag a card by mistake, click **"Cancel"** in the confirmation dialog. The card will snap back to its original position.

---

## Drag-and-Drop Details

The Kanban Board uses `@dnd-kit` for drag-and-drop:

- **Within a column:** Cards can be reordered (sortable)
- **Between columns:** Cards move from one project to another (assignment change)
- **To Bench:** Triggers deactivation confirmation

---

## Technical Details

| File | Purpose |
|---|---|
| `KanbanBoard.tsx` | Main board component — renders columns and cards |
| `useKanbanBoard.ts` | Hook managing drag state, API calls, and confirmation logic |

### Assignment Flow

```
User drags a card
        │
        ▼
useKanbanBoard.handleDragEnd() triggered
        │
        ▼
Confirmation dialog shown
        │
        ├── User confirms → PATCH /api/project (assign)
        │                    or PATCH /api/project (unassign)
        │
        └── User cancels → UI reverts to previous state
```

---

## Libraries Used

- `@dnd-kit/core` — Core drag-and-drop engine
- `@dnd-kit/sortable` — Sortable list within columns
- `shadcn/ui` — Dialog, button components
- `lucide-react` — Icons

---

## Related Pages

- [Projects Feature](../features/projects.md) — What projects are
- [Projects API](../api/projects.md) — Assignment API endpoints
- [Shared Admin Components](shared-admin.md) — Other admin UI components
