# Testing

This page explains how Digital Logbook is tested, what's covered, and how to run the tests yourself.

---

## Testing Framework

Digital Logbook uses **Jest** for all automated tests.

| Tool | Purpose |
|---|---|
| **Jest** | Test runner and assertion library |
| **ts-jest** | TypeScript support for Jest |

Test files live in `server/test/`.

---

## Running Tests

From inside the `server/` directory:

```bash
npm run test
```

This will run all test suites and output a summary of passed/failed tests.

---

## What's Tested

The test suite covers the following areas:

### API Endpoints

| Area | What's Verified |
|---|---|
| **Projects API** | CRUD operations, filtering, pagination, validation |
| **Users API** | Auth checks, deduplication, error handling |
| **Invitations API** | Token lifecycle, expiry, security, edge cases |

### UI Components

| Component | What's Verified |
|---|---|
| **Sidebar** | Renders correct items by role, handles logout |
| **Toolbar** | Buttons, interactions |
| **Dropdown** | Selection behavior |
| **Email Template** | Correct content and formatting |

### Database Layer

- **Prisma model operations** — Create, read, update, delete for core models
- **Repository methods** — Ensures database queries return expected results

### Data Validation

- Missing required fields return correct error responses
- Invalid data is rejected cleanly
- Edge cases (e.g., duplicate invitations, expired tokens) are handled

---

## Test Results

| Suite | Tests | Pass Rate |
|---|---|---|
| Projects Page | 63 / 63 | ✅ 100% |
| Users API | All | ✅ ~99–100% |
| Invitations | All | ✅ ~99–100% |
| Components | All | ✅ ~99–100% |

!!! tip "Detailed Test Reports"
    For full test case documentation (including manual QA scenarios), see the `QA-Testcases/` folder in the repository.

---

## Troubleshooting Test Failures

### ❌ Prisma-Related Errors

```
Error: @prisma/client did not initialize yet
```

**Fix:** Regenerate the Prisma client and apply migrations:

```bash
npm run generate
npm run migrate:maindb
```

---

### ❌ Database Connection Errors

**Fix:** Make sure Docker is running and PostgreSQL is up:

```bash
docker compose up -d
docker ps  # Verify the postgres container is active
```

---

### ❌ Missing Environment Variables

**Fix:** Check that your `.env` file in `server/` has all required variables. See [Environment Setup](getting-started/environment.md).

---

### ❌ Outdated Test Data

If tests were passing before and now fail after schema changes:

1. Run `npm run migrate:maindb` to apply the latest migrations
2. Reseed test data if a seed script exists
3. Check if any test fixtures reference outdated field names

---

## Writing New Tests

When adding new features, follow this pattern:

```typescript
// Example: Testing a repository method
import { ProjectRepository } from '../src/repositories/ProjectRepository';

describe('ProjectRepository', () => {
  it('should return all projects', async () => {
    const projects = await ProjectRepository.getAll();
    expect(Array.isArray(projects)).toBe(true);
  });
});
```

!!! note "Test Isolation"
    Use a test database or mock Prisma calls to avoid affecting real data when running tests.
