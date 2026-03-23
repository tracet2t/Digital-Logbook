# Projects API Documentation

## POST `/api/project`

Create a new project.

**Request Body:**

```json
{
  "name": "string",
  "description": "string (optional)",
  "domain": "string"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "description": "string",
    "domain": "string",
    "createdBy": "string",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

**Authentication Required:** ✓

---

## PATCH `/api/project`

Assign a student or mentor to a project.

**Request Body:**

```json
{
  "projectId": "string",
  "studentId": "string (optional)",
  "mentorId": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student/Mentor assigned successfully"
}
```

**Authentication Required:** ✓

---

## DELETE `/api/project`

Remove a student or mentor from a project.

**Request Body:**

```json
{
  "projectId": "string",
  "studentId": "string (optional)",
  "mentorId": "string (optional)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Student/Mentor removed successfully"
}
```

**Authentication Required:** ✓

---

## GET `/api/project`

Get all projects.

**Success Response (200):**

```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "domain": "string",
    "createdBy": "string",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601",
    "studentCount": "number",
    "mentorCount": "number"
  }
]
```

---

## GET `/api/project?id=<projectId>`

Get project details.

**Query Parameters:**

- `id` (required) - Project ID

**Success Response (200):**

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "domain": "string",
  "createdBy": "string",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601",
  "students": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  ],
  "mentors": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  ]
}
```

---

## GET `/api/project?id=<projectId>&view=students`

Get students assigned to a project.

**Query Parameters:**

- `id` (required) - Project ID
- `view` (required) - "students"

**Success Response (200):**

```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
]
```

---

## GET `/api/project?id=<projectId>&view=mentors`

Get mentors assigned to a project.

**Query Parameters:**

- `id` (required) - Project ID
- `view` (required) - "mentors"

**Success Response (200):**

```json
[
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
]
```

---

## Frontend Hooks: `useProject`

**Location:** `hooks/projects/useProject.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateProjectRequest {
  name: string;
  description?: string;
  domain: string;
}

interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description?: string;
    domain: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface AssignToProjectRequest {
  projectId: string;
  studentId?: string;
  mentorId?: string;
}

interface AssignToProjectResponse {
  success: boolean;
  message: string;
}

interface RemoveFromProjectRequest {
  projectId: string;
  studentId?: string;
  mentorId?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  domain: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  studentCount?: number;
  mentorCount?: number;
}
```

### `useCreateProject()`

Create a new project.

**Usage:**

```typescript
const createProject = useCreateProject();

await createProject.mutateAsync({
  name: "Web Development 101",
  description: "Learn web development",
  domain: "web",
});
```

---

### `useAssignToProject()`

Assign a student or mentor to a project.

**Usage:**

```typescript
const assignToProject = useAssignToProject();

// Assign student
await assignToProject.mutateAsync({
  projectId: "proj_123",
  studentId: "user_456",
});

// Assign mentor
await assignToProject.mutateAsync({
  projectId: "proj_123",
  mentorId: "user_789",
});
```

---

### `useRemoveFromProject()`

Remove a student or mentor from a project.

**Usage:**

```typescript
const removeFromProject = useRemoveFromProject();

// Remove student
await removeFromProject.mutateAsync({
  projectId: "proj_123",
  studentId: "user_456",
});

// Remove mentor
await removeFromProject.mutateAsync({
  projectId: "proj_123",
  mentorId: "user_789",
});
```

---

### `useGetProjects()`

Fetch all projects.

**Usage:**

```typescript
const { data: projects, isLoading, error } = useGetProjects();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return (
  <div>
    {projects?.map((project) => (
      <div key={project.id}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
    ))}
  </div>
);
```

---

### `useGetProject(projectId)`

Fetch a single project with students and mentors.

**Usage:**

```typescript
const { data: project, isLoading, error } = useGetProject(projectId);

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return (
  <div>
    <h2>{project?.name}</h2>
    <p>{project?.description}</p>
    <h3>Students: {project?.students?.length}</h3>
    <h3>Mentors: {project?.mentors?.length}</h3>
  </div>
);
```

---

### `useGetProjectStudents(projectId)`

Fetch students assigned to a project.

**Usage:**

```typescript
const { data: students, isLoading } = useGetProjectStudents(projectId);

return (
  <ul>
    {students?.map((student) => (
      <li key={student.id}>{student.firstName} {student.lastName}</li>
    ))}
  </ul>
);
```

---

### `useGetProjectMentors(projectId)`

Fetch mentors assigned to a project.

**Usage:**

```typescript
const { data: mentors, isLoading } = useGetProjectMentors(projectId);

return (
  <ul>
    {mentors?.map((mentor) => (
      <li key={mentor.id}>{mentor.firstName} {mentor.lastName}</li>
    ))}
  </ul>
);
```
