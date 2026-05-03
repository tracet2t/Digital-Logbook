# Projects

Projects are the core units of work in Digital Logbook. Each project has a domain, assigned students, and assigned mentors.

---

## Overview

Admins create and manage projects. Students and mentors are assigned to projects, giving everyone a shared context for activities, feedback, and reporting.

**Route:** `/admin/projects`  
**Access:** Super Admin (full access), Mentor/Student (read only)  
**Key Components:**
- `server/src/app/admin/projects/page.tsx`
- `server/src/components/admin/ProjectFormDialog.tsx`

---

## Project Fields

| Field | Description |
|---|---|
| **Name** | The project's display name |
| **Description** | Optional short summary of what the project is |
| **Domain** | Category: `software`, `film`, `training`, `research`, or `other` |
| **Students** | Users assigned as students on this project |
| **Mentors** | Users assigned as mentors on this project |
| **Created By** | The admin who created the project |

---

## What Admins Can Do

### ➕ Create a Project

1. Navigate to **Admin → Projects**
2. Click **"New Project"**
3. Fill in the name, description, and domain
4. Click **"Create"**

The project is immediately available for student and mentor assignment.

### ✏️ Assign Students and Mentors

1. Open a project from the list
2. Use the assignment panel to search for users
3. Click **"Assign"** next to a student or mentor

!!! note "Kanban Board"
    Project assignments can also be managed visually using the **Kanban Board** in the admin dashboard.
    See [Kanban Board Component](../components/kanban.md).

### 🗑️ Remove Assignments

Remove a student or mentor from a project at any time without deleting their account or other data.

### ❌ Delete a Project

Deleting a project removes it from the system. Assignments to the project are also removed.

---

## How It Works (Technical)

```
Admin fills project form
        │
        ▼
POST /api/project   ← Creates the project
        │
        ▼
ProjectRepository.create()   ← Prisma writes to Projects table
        │
        ▼
Response returned → UI refreshes
```

For assignment:
```
PATCH /api/project → ProjectRepository.assignStudent/Mentor()
DELETE /api/project → ProjectRepository.removeStudent/Mentor()
```

---

## Notes

!!! tip "Project Stats"
    The projects list shows `studentCount` and `mentorCount` for each project so admins can see capacity at a glance.

!!! warning "No Soft Delete"
    Deleting a project is permanent. Make sure assignments and related data have been handled before deletion.

---

## Related Pages

- [Projects API](../api/projects.md) — API endpoints for projects
- [Kanban Board](../components/kanban.md) — Visual assignment management
- [Database Schema](../database.md) — Projects and ProjectAssignments models
