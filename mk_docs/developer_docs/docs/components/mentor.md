# Mentor Components

Reusable UI components for the mentor dashboard and mentor-related features.

---

## Overview

These components are used across all mentor pages — they display student/mentee information in a consistent way.

**Import from:** `@/components/mentor`

---

## Component Reference

### `MenteeAvatar`

Displays a mentee's avatar with optional warning indicators.

```tsx
import { MenteeAvatar } from "@/components/mentor";

<MenteeAvatar
  userId={mentee.id}
  firstName={mentee.firstName}
  lastName={mentee.lastName}
  showWarning={mentee.hasWarning}
/>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `userId` | string | The mentee's user ID |
| `firstName` | string | First name (used for initials/alt text) |
| `lastName` | string | Last name |
| `showWarning` | boolean | If `true`, renders a warning ring around the avatar |

!!! tip "Warning Ring"
    The warning ring indicates a mentee who has missed activity logs or needs attention. It's shown consistently across all mentor views.

---

### `MenteeProfileView`

A full-page profile view for a mentee, showing their details, activity history, and feedback.

```tsx
import { MenteeProfileView } from "@/components/mentor";

<MenteeProfileView menteeId={selectedMenteeId} />
```

---

### `MenteeProfileSections`

Renders individual sections of a mentee's profile (e.g., recent activities, feedback history, project info). Used inside `MenteeProfileView`.

```tsx
import { MenteeProfileSections } from "@/components/mentor";

<MenteeProfileSections
  activities={activities}
  feedback={feedback}
  projects={projects}
/>
```

---

### `MenteeWarningCard`

A highlighted card that summarizes warning conditions for a mentee — e.g., overdue activities or low engagement.

```tsx
import { MenteeWarningCard } from "@/components/mentor";

<MenteeWarningCard
  menteeId={mentee.id}
  warningMessage="No activity logged in the past 2 weeks"
/>
```

---

### `combobox`

A searchable dropdown used for selecting mentors or mentees from a list. Useful in assignment forms.

```tsx
import { Combobox } from "@/components/mentor";

<Combobox
  options={mentorList}
  placeholder="Select a mentor..."
  onSelect={handleMentorSelect}
/>
```

---

## Component Summary

| Component | Purpose |
|---|---|
| `MenteeAvatar` | Avatar with optional warning ring indicator |
| `MenteeProfileView` | Full mentee profile page |
| `MenteeProfileSections` | Individual profile sections |
| `MenteeWarningCard` | Warning summary card for at-risk mentees |
| `Combobox` | Searchable dropdown for user selection |

---

## Related Pages

- [Mentee Components](mentee.md) — Mentee-specific display components
- [Activities & Feedback](../features/activities-feedback.md) — The workflow these components support
- [Shared Admin Components](shared-admin.md) — Admin-side shared components
