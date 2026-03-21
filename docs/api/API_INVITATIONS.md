# Invitations API Documentation

## POST `/api/invitations`

Create and send an invitation to a new user.

**Request Body:**

```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "student | mentor | superAdmin",
  "projectId": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601"
  }
}
```

**Authentication Required:** ✓ (superAdmin only)

---

## GET `/api/invitations`

Two modes depending on query parameters.

### List all invitations (no query params)

Returns all invitations for the admin dashboard.

**Success Response (200):**

```json
[
  {
    "id": "string",
    "email": "string",
    "role": "string",
    "project": "string",
    "status": "Pending | Accepted | Expired",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601"
  }
]
```

### Validate an invitation token

**Query Parameters:**

- `token` (required) — invitation token from the registration link

**Success Response (200):**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

---

## PATCH `/api/invitations`

Update the status of an invitation. Mutates the underlying `accepted` and `expiresAt` fields on the `Invitation` record to reflect the requested status.

**Request Body:**

```json
{
  "id": "string",
  "status": "Accepted | Pending | Expired"
}
```

**Status behaviour:**

| `status`   | Effect                                                                                   |
|------------|------------------------------------------------------------------------------------------|
| `Accepted` | Sets `accepted: true`                                                                    |
| `Pending`  | Sets `accepted: false`, resets `expiresAt` to 7 days from now                           |
| `Expired`  | Sets `accepted: false`, sets `expiresAt: new Date(0)` — permanently invalidates the link |

**Success Response (200):**

```json
{
  "message": "Invitation status updated"
}
```

**Error Responses:**

| Status | Reason                        |
|--------|-------------------------------|
| 400    | Missing `id` in request body  |
| 401    | Unauthenticated               |
| 403    | Not a superAdmin              |
| 500    | Internal server error         |

---

## DELETE `/api/invitations?id=<id>`

Cascade-delete an invitation and permanently remove the associated user account along with all their data.

**Query Parameters:**

- `id` (required) — the invitation ID

**Deletion order (transactional):**

1. `MentorFeedback` records for the user's activities
2. `Activity` records for the user
3. `MentorFeedback` records given by the user as a mentor
4. `MentorActivity` records for the user
5. `Report` records
6. `UserBadge` records
7. `ProjectAllocation` records
8. `ProjectMentor` records
9. Null-out `invitedBy` on any invitations this user sent
10. The `Invitation` record itself
11. The `User` record

If no associated user exists (invitation was never accepted), only the `Invitation` record is deleted.

**Success Response (200):**

```json
{
  "message": "Invitation deleted"
}
```

**Error Responses:**

| Status | Reason                    |
|--------|---------------------------|
| 400    | Missing `id` query param  |
| 404    | Invitation not found      |
| 500    | Internal server error     |

---

## Frontend Hook: `useInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Sends a `POST /api/invitations` request to create a new invitation and trigger the onboarding email.

**Parameters:**

| Name        | Type     | Description                                        |
|-------------|----------|----------------------------------------------------|
| `email`     | `string` | Recipient email address                            |
| `firstName` | `string` | Recipient first name                               |
| `lastName`  | `string` | Recipient last name                                |
| `role`      | `string` | `"student"`, `"mentor"`, or `"superAdmin"`         |
| `projectId` | `string` | *(optional)* Project to assign the user to         |

**Usage:**

```typescript
const { mutate: sendInvitation, isPending } = useInvitation();

sendInvitation({
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "student",
});
```

On success, invalidates the `["invitations"]` query key and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useRecentInvitations`

**Location:** `hooks/admin/useInvitation.ts`

Fetches the full list of invitations from `GET /api/invitations` (no token param). Each item includes `id`, `email`, `role`, `project`, `status`, `createdAt`, and `expiresAt`.

**Returns:** `UseQueryResult` — array of invitation objects.

**Usage:**

```typescript
const { data, isLoading, isError } = useRecentInvitations();

if (isLoading) return <Spinner />;
if (isError) return <p>Failed to load invitations.</p>;

return data.map((inv) => <InvitationRow key={inv.id} {...inv} />);
```

**Notes:**

- Auth is handled server-side via session cookies; no auth params are passed from the hook.
- Throws `"Failed to fetch invitations"` on a non-OK response, surfaced via `error`.
- Uses query key `["invitations"]`, which is invalidated by `useInvitation`, `useChangeInvitationStatus`, and `useDeleteInvitation` on success.

---

## Frontend Hook: `useExpireInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Convenience wrapper around `useChangeInvitationStatus` that calls `PATCH /api/invitations` with `status: "Expired"`, permanently invalidating the invitation link without deleting the record.

**Parameters:**

| Name | Type     | Description                  |
|------|----------|------------------------------|
| `id` | `string` | The invitation ID to expire  |

**Usage:**

```typescript
const { mutate: expireInvitation, isPending: isExpiring } = useExpireInvitation();

expireInvitation({ id: "abc123" });
```

On success, invalidates `["invitations"]` and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useChangeInvitationStatus`

**Location:** `hooks/admin/useInvitation.ts`

Calls `PATCH /api/invitations` to update the status of an invitation to `Accepted`, `Pending`, or `Expired`.

**Parameters:**

| Name     | Type     | Description                                          |
|----------|----------|------------------------------------------------------|
| `id`     | `string` | The invitation ID                                    |
| `status` | `string` | Target status: `"Accepted"`, `"Pending"`, or `"Expired"` |

**Usage:**

```typescript
const { mutate: changeStatus, isPending: isChangingStatus } = useChangeInvitationStatus();

changeStatus({ id: "abc123", status: "Pending" });
```

On success, invalidates `["invitations"]` and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useDeleteInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Calls `DELETE /api/invitations?id=<id>` to cascade-delete the invitation and all associated user data.

**Parameters:**

| Name | Type     | Description                 |
|------|----------|-----------------------------|
| `id` | `string` | The invitation ID to delete |

**Usage:**

```typescript
const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation();

deleteInvitation({ id: "abc123" });
```

On success, invalidates `["invitations"]` and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useValidateInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Validates a single invitation token by calling `GET /api/invitations?token=<token>`. The query only executes when `token` is a non-empty string (`enabled: !!token`), making it safe to call unconditionally before the token is available.

**Parameters:**

| Name    | Type     | Description                       |
|---------|----------|-----------------------------------|
| `token` | `string` | The invitation token to validate  |

**Returns:** `UseQueryResult` — the response from `GET /api/invitations?token=<token>`.

**Success response shape:**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

**Usage:**

```typescript
// token typically comes from URL search params on the registration page
const token = searchParams.get("token") ?? "";
const { data, isLoading, isError } = useValidateInvitation(token);

if (isLoading) return <Spinner />;
if (isError || !data?.valid) return <p>Invalid or expired invitation.</p>;

return <RegistrationForm invitation={data.invitation} />;
```

**Notes:**

- Throws `"Invalid token"` on a non-OK response; surfaced via `error` from React Query.
- Uses a scoped query key `["invitation", token]` so each token is cached independently.


## POST `/api/invitations`

Create and send an invitation to a new user.

**Request Body:**

```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "student | mentor | superAdmin",
  "projectId": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601"
  }
}
```

**Authentication Required:** ✓ (superAdmin or mentor only)

---

## GET `/api/invitations`

Two modes depending on query parameters.

### List all invitations (no query params)

Returns all invitations for the admin dashboard.

**Success Response (200):**

```json
[
  {
    "id": "string",
    "email": "string",
    "role": "string",
    "project": "string",
    "status": "Pending | Accepted | Expired",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601"
  }
]
```

### Validate an invitation token

**Query Parameters:**

- `token` (required) — invitation token from the registration link

**Success Response (200):**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

---

## PATCH `/api/invitations`

Mark an invitation as permanently expired. Sets `expiresAt` to `new Date(0)`, which immediately invalidates the registration link because the token validation gate checks `expiresAt >= now`.

**Request Body:**

```json
{
  "id": "string"
}
```

**Success Response (200):**

```json
{
  "message": "Invitation expired"
}
```

**Error Responses:**

| Status | Reason                        |
|--------|-------------------------------|
| 400    | Missing `id` in request body  |
| 404    | Invitation not found          |
| 500    | Internal server error         |

---

## DELETE `/api/invitations?id=<id>`

Cascade-delete an invitation and permanently remove the associated user account along with all their data.

**Query Parameters:**

- `id` (required) — the invitation ID

**Deletion order (transactional):**

1. `MentorFeedback` records for the user's activities
2. `Activity` records for the user
3. `MentorFeedback` records given by the user as a mentor
4. `MentorActivity` records for the user
5. `Report` records
6. `UserBadge` records
7. `ProjectAllocation` records
8. `ProjectMentor` records
9. Null-out `invitedBy` on any invitations this user sent
10. The `Invitation` record itself
11. The `User` record

If no associated user exists (invitation was never accepted), only the `Invitation` record is deleted.

**Success Response (200):**

```json
{
  "message": "Invitation deleted"
}
```

**Error Responses:**

| Status | Reason                    |
|--------|---------------------------|
| 400    | Missing `id` query param  |
| 404    | Invitation not found      |
| 500    | Internal server error     |

---

## Frontend Hook: `useInvitation`

**Location:** `hooks/admin/useInvitation.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface InvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "mentor" | "superAdmin";
  projectId?: string;
}

interface InvitationResponse {
  message: string;
  invitation: {
    id: string;
    email: string;
    role: string;
    token: string;
    createdAt: string;
    expiresAt: string;
  };
}

export const useInvitation = () => { ... };
```

**Usage:**

```typescript
const { mutate: sendInvitation, isPending } = useInvitation();

sendInvitation({
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "student",
});
```

On success, invalidates the `["invitations"]` query key and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useRecentInvitations`

**Location:** `hooks/admin/useInvitation.ts`

Fetches the full list of invitations from `GET /api/invitations` (no token param). Each item now includes `id`, `createdAt`, and `expiresAt` in addition to `email`, `role`, `project`, and `status`.

**Returns:** `UseQueryResult` — array of invitation objects.

**Usage:**

```typescript
const { data, isLoading, isError } = useRecentInvitations();

if (isLoading) return <Spinner />;
if (isError) return <p>Failed to load invitations.</p>;

return data.map((inv) => <InvitationRow key={inv.id} {...inv} />);
```

**Notes:**

- No authentication parameters are passed from the hook; auth is handled server-side via session cookies.
- Throws `"Failed to fetch invitations"` on a non-OK response, surfaced via `error`.
- Uses query key `["invitations"]`, which is invalidated by `useInvitation`, `useExpireInvitation`, and `useDeleteInvitation` on success.

---

## Frontend Hook: `useExpireInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Calls `PATCH /api/invitations` to immediately invalidate an invitation link without deleting it.

**Parameters:**

| Name | Type     | Description                |
|------|----------|----------------------------|
| `id` | `string` | The invitation ID to expire |

**Usage:**

```typescript
const { mutate: expireInvitation, isPending: isExpiring } = useExpireInvitation();

expireInvitation({ id: "abc123" });
```

On success, invalidates `["invitations"]` and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useDeleteInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Calls `DELETE /api/invitations?id=<id>` to cascade-delete the invitation and all associated user data.

**Parameters:**

| Name | Type     | Description                 |
|------|----------|-----------------------------|
| `id` | `string` | The invitation ID to delete |

**Usage:**

```typescript
const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation();

deleteInvitation({ id: "abc123" });
```

On success, invalidates `["invitations"]` and shows a success toast. On error, shows an error toast.

---

## Frontend Hook: `useValidateInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Validates a single invitation token by calling `GET /api/invitations?token=<token>`. The query only executes when `token` is a non-empty string (`enabled: !!token`), making it safe to call unconditionally before the token is available.

**Parameters:**

| Name    | Type     | Description                       |
|---------|----------|-----------------------------------|
| `token` | `string` | The invitation token to validate  |

**Returns:** `UseQueryResult` — the response from `GET /api/invitations?token=<token>`.

**Success response shape:**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

**Usage:**

```typescript
// token typically comes from URL search params on the registration page
const token = searchParams.get("token") ?? "";
const { data, isLoading, isError } = useValidateInvitation(token);

if (isLoading) return <Spinner />;
if (isError || !data?.valid) return <p>Invalid or expired invitation.</p>;

return <RegistrationForm invitation={data.invitation} />;
```

**Notes:**

- Throws `"Invalid token"` on a non-OK response; surfaced via `error` from React Query.
- Uses a scoped query key `["invitation", token]` so each token is cached independently.


## POST `/api/invitations`

Create and send an invitation to a new user.

**Request Body:**

```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "student | mentor | superAdmin",
  "projectId": "string (optional)"
}
```

**Success Response (201):**

```json
{
  "message": "Invitation sent successfully",
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601"
  }
}
```

**Authentication Required:** ✓ (superAdmin or mentor only)

---

## GET `/api/invitations?token=<token>`

Validate an invitation token.

**Query Parameters:**

- `token` (required) - Invitation token

**Success Response (200):**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

---

## Frontend Hook: `useInvitation`

**Location:** `hooks/admin/useInvitation.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface InvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "mentor" | "superAdmin";
  projectId?: string;
}

interface InvitationResponse {
  message: string;
  invitation: {
    id: string;
    email: string;
    role: string;
    token: string;
    createdAt: string;
    expiresAt: string;
  };
}

export const useInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<InvitationResponse, Error, InvitationRequest>({
    mutationFn: async (data) => {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send invitation");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });

  return mutation;
};
```

**Usage:**

```typescript
const invitation = useInvitation();

await invitation.mutateAsync({
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "student",
});
```

---

## Frontend Hook: `useRecentInvitations`

**Location:** `hooks/admin/useInvitation.ts`

Fetches the list of all recent invitations. Automatically caches and deduplicates requests using `["invitations"]` as the query key — the same key invalidated by `useInvitation` on success, so the list refreshes after every new invitation is sent.

**Returns:** `UseQueryResult` — the raw response from `GET /api/invitations`.

**Usage:**

```typescript
const { data, isLoading, isError } = useRecentInvitations();

if (isLoading) return <Spinner />;
if (isError) return <p>Failed to load invitations.</p>;

return data.invitations.map((inv) => <InvitationRow key={inv.id} {...inv} />);
```

**Notes:**

- No authentication parameters are passed from the hook; auth is handled server-side via session cookies.
- Throws `"Failed to fetch invitations"` on a non-OK response, which React Query surfaces via `error`.

---

## Frontend Hook: `useValidateInvitation`

**Location:** `hooks/admin/useInvitation.ts`

Validates a single invitation token by calling `GET /api/invitations?token=<token>`. The query is only executed when `token` is a non-empty string (`enabled: !!token`), making it safe to call unconditionally even before the token is available.

**Parameters:**

| Name    | Type     | Description                        |
|---------|----------|------------------------------------|
| `token` | `string` | The invitation token to validate.  |

**Returns:** `UseQueryResult` — the response from `GET /api/invitations?token=<token>`.

**Success response shape:**

```json
{
  "valid": true,
  "invitation": {
    "id": "string",
    "email": "string",
    "role": "string",
    "token": "string",
    "createdAt": "ISO 8601",
    "expiresAt": "ISO 8601",
    "accepted": false
  }
}
```

**Usage:**

```typescript
// token typically comes from URL search params on the registration page
const token = searchParams.get("token") ?? "";
const { data, isLoading, isError } = useValidateInvitation(token);

if (isLoading) return <Spinner />;
if (isError || !data?.valid) return <p>Invalid or expired invitation.</p>;

return <RegistrationForm invitation={data.invitation} />;
```

**Notes:**

- Throws `"Invalid token"` on a non-OK response; this is surfaced via `error` from React Query.
- Uses a scoped query key `["invitation", token]` so each token is cached independently.
