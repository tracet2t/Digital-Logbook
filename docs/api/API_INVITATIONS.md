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
