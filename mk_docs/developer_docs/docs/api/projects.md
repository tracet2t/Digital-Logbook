# Projects API

Manage projects on the platform. Only **Super Admins** can create, update, or delete projects.

!!! note "Auth Required"
    All endpoints require a valid JWT cookie. See [Authentication](auth.md) for details.

---

## POST `/api/project`

Create a new project.

**Auth:** Super Admin only

### Request Body

```json
{
  "name": "Mobile App Development",
  "description": "A project focused on building cross-platform mobile apps.",
  "domain": "software"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Project name |
| `description` | string | ❌ | Short description of the project |
| `domain` | string | ✅ | One of: `software`, `film`, `training`, `research`, `other` |

### Response

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "uuid",
    "name": "Mobile App Development",
    "domain": "software",
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

---

## GET `/api/project`

Retrieve all projects, a single project by ID, or view a project's assigned members.

### Get All Projects

```
GET /api/project
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Mobile App Development",
    "description": "...",
    "domain": "software",
    "createdBy": "admin-uuid",
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-01-20T08:00:00Z",
    "studentCount": 5,
    "mentorCount": 2
  }
]
```

### Get a Single Project

```
GET /api/project?id=<projectId>
```

**Response:** Full project object including `students` and `mentors` arrays.

### Get Project Members

```
GET /api/project?id=<projectId>&view=students
GET /api/project?id=<projectId>&view=mentors
```

| Parameter | Value | Description |
|---|---|---|
| `id` | UUID | Project ID |
| `view` | `students` or `mentors` | Which members to retrieve |

**Response:** Array of user objects for the specified member type.

---

## PATCH `/api/project`

Assign a student or mentor to a project.

**Auth:** Super Admin only

### Request Body

```json
{
  "projectId": "project-uuid",
  "studentId": "student-uuid"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `projectId` | string | ✅ | The project to update |
| `studentId` | string | ❌ | Student to assign (provide one of these) |
| `mentorId` | string | ❌ | Mentor to assign (provide one of these) |

### Response

```json
{
  "success": true,
  "message": "Student assigned successfully"
}
```

---

## DELETE `/api/project`

Remove a student or mentor from a project.

**Auth:** Super Admin only

### Request Body

Same format as PATCH — provide `projectId` and either `studentId` or `mentorId`.

### Response

```json
{
  "success": true,
  "message": "Student removed successfully"
}
```

---

## Error Responses

| Status | Message | Cause |
|---|---|---|
| `400` | `"Project name is required"` | Missing required fields |
| `403` | `"Access denied"` | Not a super admin |
| `404` | `"Project not found"` | Invalid project ID |
| `409` | `"Student already assigned"` | Duplicate assignment |

---

## Related Pages

- [Projects Feature](../features/projects.md) — What the Projects feature does
- [Database Schema](../database.md) — Projects and ProjectAssignments models
