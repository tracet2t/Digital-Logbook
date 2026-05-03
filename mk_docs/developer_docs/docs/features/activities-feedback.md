# Activities & Mentor Feedback

This feature is the heart of the mentorship workflow — students log what they've been working on, and mentors review and respond.

---

## Overview

Activities and feedback create a continuous loop of accountability and guidance:

1. **Students** log their daily or weekly work as **Activities**
2. **Mentors** review each activity and leave **Feedback**
3. **Admins** can monitor all activity and feedback for reporting

**Student route:** `/student/activities`  
**Mentor route:** `/mentor/activities`  
**Key files:**
- `server/src/app/student/` — Student activity pages
- `server/src/components/mentor/mentorFeedback.tsx` — Mentor feedback UI

---

## Student: Logging Activities

Students can log their work at any time. Each activity captures:

| Field | Description |
|---|---|
| **Date** | When the work was done |
| **Time Spent** | Duration in minutes |
| **Notes** | What the student worked on |

### How to Log an Activity

1. Go to your **Student Dashboard → Activities**
2. Click **"Log Activity"**
3. Fill in the date, time spent, and a description of what you worked on
4. Click **"Submit"**

Your mentor will be notified and can review your log.

---

## Mentor: Reviewing Activities

Mentors see all pending activity logs from their assigned students.

### Feedback Status

| Status | Meaning |
|---|---|
| **Pending** | Activity submitted, awaiting mentor review |
| **Approved** | Mentor reviewed and accepted the activity |
| **Rejected** | Mentor flagged the activity (with notes explaining why) |

### How to Give Feedback

1. Go to your **Mentor Dashboard → Student Activities**
2. Find a student's pending activity log
3. Review the details
4. Choose **"Approve"** or **"Reject"**
5. Add written feedback notes (optional but recommended for rejections)
6. Click **"Submit Feedback"**

!!! tip "Feedback Notes"
    Even when approving, leaving a short note of encouragement or guidance helps students improve.

---

## Admin: Monitoring Activity

Super Admins can view all activities and feedback across all users. This data feeds into the [Reports](reports.md) feature.

---

## How It Works Technically

```
Student submits activity
        │
        ▼
POST /api/activity → stored in Activities table
        │
        ▼
Mentor opens activity list → GET /api/activity?mentorId=...
        │
        ▼
Mentor submits feedback → POST /api/mentorFeedback
        │
        ▼
MentorFeedback record created (status: approved/rejected)
        │
        ▼
Used in report generation
```

---

## Related Pages

- [Reports Feature](reports.md) — How activities feed into reports
- [Database Schema](../database.md) — Activities and MentorFeedback models
- [Mentor Components](../components/mentor.md) — Feedback UI components
