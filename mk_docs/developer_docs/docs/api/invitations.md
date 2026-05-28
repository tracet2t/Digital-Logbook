# Invitations API

Manage user invitations. Invitations are the primary way new users join the platform.

!!! note "Auth Required"
    All endpoints (except token validation by invited users) require a valid JWT cookie.

---

## POST `/api/invitations`

Send an invitation email to a new user.

**Auth:** Super Admin only

### Request Body

```json
{
  "email": "jane.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "student",
  "projectId": "project-uuid"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | Email address to invite |
| `firstName` | string | ✅ | Invitee's first name |
| `lastName` | string | ✅ | Invitee's last name |
| `role` | string | ✅ | Role to assign: `student`, `mentor`, or `superAdmin` |
| `projectId` | string | ❌ | Pre-assign the user to a project |

### Response

```json
{
  "id": "invitation-uuid",
  "email": "jane.doe@example.com",
  "role": "student",
  "status": "Pending",
  "expiresAt": "2026-02-15T10:00:00Z",
  "createdAt": "2026-01-15T10:00:00Z"
}
```

!!! tip "What happens after sending?"
    The system generates a secure token, stores the invitation, and sends an email to the invitee with a registration link.

---

## GET `/api/invitations`

List all invitations **or** validate an invitation token.

### List All Invitations

```
GET /api/invitations
```

**Auth:** Super Admin only

**Response:** Array of invitation objects:

```json
[
  {
    "id": "uuid",
    "email": "jane@example.com",
    "role": "student",
    "status": "Pending",
    "accepted": false,
    "expiresAt": "2026-02-15T10:00:00Z",
    "createdAt": "2026-01-15T10:00:00Z"
  }
]
```

### Validate an Invitation Token

```
GET /api/invitations?token=<token>
```

Used during registration — validates whether the token is still valid.

**Auth:** Not required (public endpoint for invitees)

**Response:**
```json
{
  "valid": true,
  "email": "jane@example.com",
  "role": "student",
  "expiresAt": "2026-02-15T10:00:00Z"
}
```

---

## PATCH `/api/invitations`

Update the status of an invitation manually.

**Auth:** Super Admin only

### Request Body

```json
{
  "id": "invitation-uuid",
  "status": "Expired"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | The invitation ID |
| `status` | string | ✅ | New status: `Accepted`, `Pending`, or `Expired` |

### Response

```json
{
  "message": "Invitation status updated"
}
```

---

## DELETE `/api/invitations?id=<id>`

Delete an invitation and cascade-delete associated user data.

**Auth:** Super Admin only

```
DELETE /api/invitations?id=<invitationId>
```

### Response

```json
{
  "message": "Invitation deleted"
}
```

!!! warning "Cascade Delete"
    Deleting an invitation will also remove the associated user account and all related data (activities, feedback, etc.). This action is irreversible.

---

## Error Responses

| Status | Message | Cause |
|---|---|---|
| `400` | `"Email is required"` | Missing required field |
| `400` | `"Invalid or expired token"` | Token validation failed |
| `403` | `"Access denied"` | Not a super admin |
| `404` | `"Invitation not found"` | Invalid ID |
| `409` | `"Invitation already sent to this email"` | Duplicate invitation |

---

## Related Pages

- [Invitations Feature](../features/invitations.md) — How invitations work end-to-end
- [Bulk Upload Feature](../features/bulk-upload.md) — Inviting multiple users at once
- [Authentication API](auth.md) — How users register using an invitation token
