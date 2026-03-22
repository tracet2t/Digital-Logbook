# API Guide

Welcome to the Digital Logbook API documentation. This guide provides an overview of available endpoints and how to use them.

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Projects](#projects)
  - [Invitations](#invitations)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Authentication

All API endpoints require authentication via JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Projects

For detailed project endpoint documentation, see [API_PROJECTS.md](./API_PROJECTS.md)

**Available Operations:**

- Get all projects
- Get project by ID
- Create new project
- Update project
- Delete project
- Manage project allocations

### Invitations

For detailed invitation endpoint documentation, see [API_INVITATIONS.md](./API_INVITATIONS.md)

**Available Operations:**

- Send invitations
- Validate invitation tokens
- Accept invitations
- Resend invitations

## Error Handling

All endpoints return standard HTTP status codes:

| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 404    | Not Found             |
| 500    | Internal Server Error |

### Error Response Format

```json
{
  "error": "Error description"
}
```

## Best Practices

### 1. Request Validation

- Always validate input data before sending requests
- Check that required fields are present
- Ensure data types match expected values

### 2. Error Handling

- Implement proper try-catch blocks
- Handle specific error messages from the API
- Log errors for debugging

### 3. Performance

- Use pagination for large datasets
- Cache responses when appropriate
- Implement request debouncing on the frontend

### 4. Security

- Never expose JWT tokens in logs
- Always use HTTPS in production
- Validate tokens on the backend
- Implement rate limiting on sensitive endpoints

### 5. Testing

- Test all endpoints with valid and invalid data
- Verify error handling
- Test edge cases and boundary conditions

## Frontend Integration

When using these APIs in the frontend, consider using:

- **TanStack Query (React Query)** for caching and state management
- **Custom Hooks** for reusable API logic
- **Error Boundaries** for graceful error handling
- **Toast Notifications** for user feedback

### Example Hook Pattern

```typescript
import { useMutation } from "@tanstack/react-query";

export const useYourMutation = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("/api/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });
};
```

## Additional Resources

- [Database Schema](../schema/README.md)
- [Project Endpoints](./API_PROJECTS.md)
- [Invitation Endpoints](./API_INVITATIONS.md)

---

For questions or issues, please refer to the main [README.md](../../README.md)
