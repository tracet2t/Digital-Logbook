# Mentee Components

UI components for displaying and interacting with mentee (student) information.

---

## Overview

Mentee components are used inside the mentor dashboard to show student profiles, activities, and status. Most of these components are shared with the mentor component library.

**Import from:** `@/components/mentor` (shared with mentor components)

---

## Component Reference

### `MenteeAvatar`

Displays a mentee's avatar image or initials, with an optional colored warning ring.

```tsx
import { MenteeAvatar } from "@/components/mentor";

<MenteeAvatar
  userId={student.id}
  firstName={student.firstName}
  lastName={student.lastName}
  showWarning={student.hasOverdueActivities}
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `userId` | string | The student's user ID |
| `firstName` | string | Used for initials fallback |
| `lastName` | string | Used for initials fallback |
| `showWarning` | boolean | Shows an orange/red ring if `true` |

The avatar background is always **dark blue** for consistency.

---

### `MenteeProfileView`

Renders a mentee's complete profile — useful for mentor dashboards and admin views.

```tsx
import { MenteeProfileView } from "@/components/mentor";

<MenteeProfileView menteeId="student-uuid" />
```

Includes:
- Student's basic info (name, email, role)
- Assigned projects
- Recent activities
- Mentor feedback history

---

### `MenteeProfileSections`

Renders individual profile sections separately. Use when you need to display only certain parts of a profile.

```tsx
import { MenteeProfileSections } from "@/components/mentor";

<MenteeProfileSections
  section="activities"
  menteeId={mentee.id}
/>
```

---

### `MenteeWarningCard`

A callout-style card shown when a mentee needs attention (e.g., no recent activity logged).

```tsx
import { MenteeWarningCard } from "@/components/mentor";

<MenteeWarningCard
  menteeId={mentee.id}
  message="No activity logged in the past 14 days"
/>
```

---

## When to Use Each Component

| Scenario | Component |
|---|---|
| Show a student's avatar in a list or Kanban card | `MenteeAvatar` |
| Show a student's full profile on a detail page | `MenteeProfileView` |
| Show only activities or feedback for a student | `MenteeProfileSections` |
| Alert a mentor about an at-risk student | `MenteeWarningCard` |

---

## Notes

!!! note "Shared with Mentor"
    These components are defined in the `@/components/mentor` folder because they're primarily used by the mentor dashboard, but they apply to mentee data. This is a naming convention in the codebase — not a mistake.

---

## Related Pages

- [Mentor Components](mentor.md) — Mentor-side components (same library)
- [Activities & Feedback](../features/activities-feedback.md) — How mentees log activities
- [Users & Roles](../features/users.md) — How student accounts work
