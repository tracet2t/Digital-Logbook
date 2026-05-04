# Users API

Manage platform users. Only **Super Admins** can access most of these endpoints.

!!! note "Auth Required"
    All endpoints require a valid JWT cookie with admin privileges.

---

## GET `/api/users`

Retrieve a list of all users on the platform.

**Auth:** Super Admin only

### Response

```json
[
  {
    "id": "user-uuid",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "student",
    "status": "active",
    "isActive": true,
    "createdAt": "2026-01-15T10:00:00Z"
  }
]
```

| Field | Type | Description |
|---|---|---|
| `id` | UUID | Unique user identifier |
| `email` | string | Login email |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `role` | string | `student`, `mentor`, or `superAdmin` |
| `status` | string | `active` or `inactive` |
| `isActive` | boolean | Whether the account is active |
| `createdAt` | ISO 8601 | Account creation timestamp |

### Filtering (Query Parameters)

You can filter users by adding query parameters:

| Parameter | Example | Description |
|---|---|---|
| `role` | `?role=student` | Filter by role |
| `status` | `?status=active` | Filter by active/inactive |

---

## PATCH `/api/users`

Update a user's status or details.

**Auth:** Super Admin only

### Request Body

```json
{
  "id": "user-uuid",
  "isActive": false
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | The user's ID |
| `isActive` | boolean | ❌ | Set to `false` to deactivate the user |
| `role` | string | ❌ | Update the user's role |

### Response

```json
{
  "success": true,
  "message": "User updated successfully"
}
```

!!! warning "Deactivating a User"
    Deactivating a user (`isActive: false`) prevents them from logging in, but does **not** delete their data. They can be reactivated later.

---

## Error Responses

| Status | Message | Cause |
|---|---|---|
| `403` | `"Access denied"` | Not a super admin |
| `404` | `"User not found"` | Invalid user ID |
| `400` | `"Invalid role"` | Role value not recognized |

---

## Related Pages

- [Users Feature](../features/users.md) — User management in the admin dashboard
- [Database Schema](../database.md) — Users model definition
- [Authentication API](auth.md) — How users log in
