# Authentication API

The authentication endpoints handle user login and registration. These are the **only endpoints that don't require a JWT** — they're how users get their JWT in the first place.

---

## POST `/api/(auth)/login`

Authenticates a user with their email and password. On success, sets a JWT token in an HTTP-only cookie.

### Request

- **Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | ✅ | User's registered email address |
| `password` | string | ✅ | User's password |

### Response

```json
{
  "message": "Login successful",
  "redirectUrl": "/admin"
}
```

The response also sets a **JWT cookie** (`token`) used for all subsequent authenticated requests.

| Field | Description |
|---|---|
| `message` | Status message |
| `redirectUrl` | Where to redirect the user based on their role |

### Error Responses

| Status | Message | Cause |
|---|---|---|
| `400` | `"Email and password are required"` | Missing fields |
| `401` | `"Invalid email or password"` | Wrong credentials |
| `403` | `"Account is inactive"` | User's account has been deactivated |

### Example (Fetch API)

```javascript
const formData = new FormData();
formData.append('email', 'admin@example.com');
formData.append('password', 'mypassword');

const response = await fetch('/api/(auth)/login', {
  method: 'POST',
  body: formData,
  credentials: 'include',  // ← Important: needed to receive the cookie
});
```

---

## POST `/api/(auth)/register`

Registers a new user using a valid invitation token. This is how new students and mentors join the platform.

### Request

- **Content-Type:** `application/json`

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | ✅ | The invitation token from the email link |
| `firstName` | string | ✅ | User's first name |
| `lastName` | string | ✅ | User's last name |
| `password` | string | ✅ | User's chosen password |

```json
{
  "token": "abc123...",
  "firstName": "Jane",
  "lastName": "Doe",
  "password": "SecurePass123"
}
```

### Response

```json
{
  "message": "Registration successful",
  "redirectUrl": "/student/dashboard",
  "user": {
    "id": "uuid",
    "email": "jane@example.com",
    "role": "student",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

Also sets a **JWT cookie** like the login endpoint.

### Error Responses

| Status | Message | Cause |
|---|---|---|
| `400` | `"Invalid or expired token"` | Token is missing, used, or expired |
| `400` | `"All fields are required"` | Missing form fields |
| `409` | `"User already registered"` | Email already has an account |

---

## How the JWT Works

After a successful login or registration:

1. A JWT is signed using `JWT_SECRET` from `.env`
2. The token is stored in an **HTTP-only cookie** (not accessible to JavaScript)
3. The token contains the user's `id`, `role`, `email`, and expiry
4. Every subsequent request automatically sends this cookie
5. The middleware validates the cookie on each protected route

!!! tip "Token Expiry"
    Tokens expire after the duration set in `JWT_EXPIRY` (default: `1d`). After expiry, the user is redirected to the login page.

---

## Related Pages

- [Special Logic & Middleware](../special-logic.md) — How auth middleware works
- [Invitations API](invitations.md) — How invitation tokens are created
- [Environment Setup](../getting-started/environment.md) — JWT_SECRET and JWT_EXPIRY config
