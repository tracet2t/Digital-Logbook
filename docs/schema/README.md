### Databse Schema

1. **Users**
- `id` (UUID, Primary Key): Unique identifier for each user.
- `email` (String, Unique, Not Null): Email address used for login.
- `password_hash` (String, Not Null): Hashed password for security.
- `first_name` (String, Not Null): User’s first name.
- `last_name` (String, Not Null): User’s last name.
- `role` (Enum: 'student', 'mentor', 'admin', Not Null): Role of the user in the system.
- `created_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the user was created.
- `updated_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the user was last updated.

4. **Activities**
- `id` (UUID, Primary Key): Unique identifier for each activity.
- `student_id` (UUID, Foreign Key -> Students.id, Not Null): References the student who logged the activity.
- `date` (Date, Not Null): The date of the activity.
- `time_spent` (Integer, Not Null): Time spent on the activity (in minutes).
- `notes` (Text, Nullable): Additional notes added by the student.
- `created_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the activity was logged.
- `updated_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the activity was last updated.

5. **MentorFeedback**
- `id` (UUID, Primary Key): Unique identifier for each feedback entry.
- `activity_id` (UUID, Foreign Key -> Activities.id, Not Null): References the activity being reviewed.
- `mentor_id` (UUID, Foreign Key -> USERS.id, Not Null): References the mentor providing the feedback.
- `status` (Enum: 'approved', 'rejected','Pending' Not Null): Status of the activity after mentor review.
- `feedback_notes` (Text, Nullable): Feedback notes provided by the mentor.
- `created_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the feedback was given.
- `updated_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the feedback was last updated.

6. **Reports**
- `id` (UUID, Primary Key): Unique identifier for each report.
- `mentor_id` (UUID, Foreign Key -> USERS.id, Not Null): References the mentor who generated the report.
- `student_id` (UUID, Foreign Key -> USERS.id, Nullable): References the student for whom the report was generated (nullable if report is for all students)
- `report_data` (JSONB, Not Null): The report data, stored as JSON.
- `generated_at` (Timestamp, Not Null, Default: Current Timestamp): The timestamp when the report was generated.

8. **Mentorship**
-`id` (UUID, Primary Key, Not Null): Unique identifier for the mentorship relationship.
- `mentor_id` (UUID, Foreign Key -> USERS.id, Not Null): References the mentor.
- `student_id` (UUID, Foreign Key -> USERS.id, Not Null): References the student.

**Mermaid ER diagram**
```mermaid
erDiagram
    USERS {
        UUID id
        String email
        String password_hash
        String first_name
        String last_name
        Enum role "student, mentor, admin"
        Timestamp created_at
        Timestamp updated_at
    }
    

    ACTIVITIES {
        UUID id
        UUID student_id
        Date date
        Integer time_spent
        Text notes
        Timestamp created_at
        Timestamp updated_at
    }

    MENTORFEEDBACK {
        UUID id
        UUID activity_id
        UUID mentor_id
        Enum status "approved, rejected, pending"
        Text feedback_notes
        Timestamp created_at
        Timestamp updated_at
    }
    
    MENTORSHIP {
        UUID id
        UUID mentor_id
        UUID student_id
    }

    REPORTS {
        UUID id
        UUID mentor_id
        UUID student_id
        JSONB report_data
        Timestamp generated_at
    }

    USERS ||--o{ REPORTS : "has"
    USERS ||--o{ MENTORSHIP : "connected"
    USERS ||--o{ ACTIVITIES : "logs"
    USERS ||--o{ MENTORFEEDBACK : "provides"
    ACTIVITIES ||--o{ MENTORFEEDBACK : "receives"

```
