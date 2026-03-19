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
