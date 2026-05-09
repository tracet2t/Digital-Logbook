# Sidebar Component

The Sidebar provides role-aware navigation for all users in Digital Logbook. It automatically adjusts the menu items based on the logged-in user's role.

---

## Overview

Every dashboard (Admin, Mentor, Student) uses the same Sidebar component, but renders different navigation links depending on who is logged in.

**Component:** `server/src/components/AsideSidebar.tsx`  
**Config files:** `server/src/utils/config/*SidebarConfig.tsx`

---

## Role-Based Navigation

| Role | Sidebar Links |
|---|---|
| **Super Admin** | Dashboard, Users, Projects, Invitations, Reports |
| **Mentor** | Dashboard, My Students, Activities, Reports |
| **Student** | Dashboard, My Activities, My Projects |

Each role sees only what's relevant to them — no extra clutter.

---

## Features

### 🔗 Navigation Links
- Links are defined in role-specific config files
- Active page is highlighted automatically
- Icons from `lucide-react` for visual clarity

### 👤 User Info Display
- Shows the logged-in user's name and role at the bottom
- Provides a **Logout** button

### 🔐 Session Handling
- The Sidebar manages session state
- Clicking Logout clears the JWT cookie and redirects to `/login`

---

## How Role Config Works

Each role has its own sidebar config file that defines the nav items:

```typescript
// Example: AdminSidebarConfig.tsx
export const adminSidebarItems = [
  { label: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
  { label: "Users",     href: "/admin/users", icon: <Users /> },
  { label: "Projects",  href: "/admin/projects", icon: <FolderOpen /> },
  { label: "Invitations", href: "/admin/invitations", icon: <Mail /> },
  { label: "Reports",   href: "/admin/reports", icon: <BarChart2 /> },
];
```

The `AsideSidebar.tsx` component receives the appropriate config based on the user's role from the JWT.

---

## Usage

The Sidebar is included automatically in the layout for each role's pages — you don't need to add it manually to individual pages.

```tsx
// Already included in admin/layout.tsx, mentor/layout.tsx, student/layout.tsx
import { AsideSidebar } from "@/components/AsideSidebar";

<AsideSidebar role={user.role} userName={user.firstName} />
```

---

## Testing

The Sidebar has dedicated test coverage. See `QA-Testcases/SIDEBAR.md` for:
- Role rendering tests
- Logout behavior tests
- Active link highlighting tests

---

## Related Pages

- [Testing](../testing.md) — How the sidebar is tested
- [Shared Admin Components](shared-admin.md) — Other reusable admin UI
- [Special Logic & Middleware](../special-logic.md) — How session/JWT works
