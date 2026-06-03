---
description: "Prisma and database seeding conventions. Use when working with: Prisma schema, migrations, seed.mjs, data encryption, test databases, repository data access, or database initialization workflows."
applyTo: "server/prisma/**/*.ts, server/prisma/**/*.mjs, server/src/repositories/**/*.ts, server/src/lib/prisma.ts, server/test/db/**/*.ts"
---

# Prisma & Database Seeding – Project Conventions

## Tech Stack

- **ORM**: Prisma 5.x with PostgreSQL
- **Data encryption**: RSA-OAEP (Node.js `crypto` module) for sensitive fields
- **Seeding**: Node.js script (`seed.mjs`) with `dotenv` environment loading
- **Migrations**: Prisma Migrate with shadow database tracking
- **Testing**: Isolated test database with separate migrations

---

## Prisma Configuration (`src/lib/prisma.ts`)

### Singleton Instance

Always access Prisma through the singleton at `src/lib/prisma.ts`:

```ts
import prisma from "@/lib/prisma";
```

**Never** instantiate `new PrismaClient()` elsewhere. The singleton ensures:

- Single client instance across the app
- Connection pooling
- Proper cleanup on process exit

### Example implementation

```ts
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"], // log errors only in production
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

---

## Schema Design (`prisma/schema.prisma`)

### Field Naming

- Use camelCase for Prisma field names.
- Use snake_case for database column names via `@map()`.
- Always add `createdAt` and `updatedAt` timestamps to entities.

### Encrypted Fields

Any sensitive field (NIC, SSN, financial data, passwords) must use RSA-OAEP encryption:

```prisma
model User {
  id        String @id @default(uuid())
  email     String @unique
  nic       String // Encrypted via encryptNIC() before storage
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model MenteeApplication {
  id   String @id @default(uuid())
  nic  String // Must be encrypted with RSA-OAEP
  // ...
}
```

### Enums

Use Prisma enums for fixed domain values:

```prisma
enum Role {
  student
  mentor
  superAdmin
}

enum WarningCategory {
  low
  medium
  high
}
```

### Relations

- Use descriptive `@relation(name: "...")` for complex relationships.
- Always include `onDelete` policy:
  - `Cascade` for child records that should be deleted with parent.
  - `SetNull` for optional foreign keys.
  - Avoid `Restrict` unless explicitly intended.

```prisma
model User {
  id      String @id @default(uuid())
  posts   Post[] @relation("UserPosts")
}

model Post {
  id     String @id @default(uuid())
  userId String
  user   User   @relation("UserPosts", fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## Seeding (`prisma/seed.mjs`)

### Structure

The seed file should:

1. Load environment variables via `dotenv`.
2. Set up Prisma client.
3. Clear existing data in **reverse dependency order**.
4. Create test data with realistic values.
5. Handle encryption for sensitive fields.
6. Log results with ✅/❌ indicators.

### Example seed.mjs structure

```mjs
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { constants, publicEncrypt } from "crypto";

// Load .env first
config({ path: new URL("../.env", import.meta.url).pathname });

// ── Encryption helper ──────────────────────────────────────────────────────────
function encryptNIC(plaintext) {
  const pubKeyB64 = process.env.NIC_SSH_PUB_KEY_B64;
  if (!pubKeyB64) {
    throw new Error("NIC_SSH_PUB_KEY_B64 not set in .env");
  }
  const publicKey = Buffer.from(pubKeyB64, "base64").toString("utf8");
  const buffer = Buffer.from(plaintext, "utf8");
  const encrypted = publicEncrypt(
    { key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING },
    buffer,
  );
  return encrypted.toString("base64");
}

const prisma = new PrismaClient();

async function main() {
  // Clear data in REVERSE dependency order
  await prisma.projectTechnology.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.projectAllocation.deleteMany();
  await prisma.projectMentor.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create data
  const admin = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@gmail.com",
      passwordHash: await bcrypt.hash("defaultPassword", 10),
      role: "superAdmin",
      emailConfirmed: true,
    },
  });

  const menteeApp = await prisma.menteeApplication.create({
    data: {
      fullName: "John Doe",
      email: "john@example.com",
      nic: encryptNIC("123456789V"), // Always encrypt before storing
      mobileNumber: "+94771234567",
      address: "123 Main St",
      university: "State University",
      degreeProgram: "B.S. Computer Science",
      cvLink: "https://example.com/cv",
      status: "pending",
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Encryption Best Practices

- **Always encrypt sensitive fields** (NIC, SSN, financial data) before storing.
- Use `NIC_SSH_PUB_KEY_B64` environment variable (loaded from `.env`).
- Validate that the key exists before attempting encryption; throw descriptive errors if missing.
- Document which fields must be encrypted in code comments.

### Test Data Patterns

- Use realistic but clearly test-only values (e.g., `test@gmail.com`, `student1@gmail.com`).
- Include bulk test data (50+ records) for stress testing with a loop:

```mjs
const bulkStudents = [];
for (let i = 0; i < 50; i++) {
  const student = await prisma.user.create({
    data: {
      /* ... */
    },
  });
  bulkStudents.push(student);
}
```

- Create relationships and nested data in a logical order (parents before children).
- Add diverse data states (approved, pending, rejected) for testing UI logic.

### Running seed

```bash
npm run seed
```

---

## Database Migrations (`prisma/migrations/`)

### Creating a Migration

When the Prisma schema changes, always create a migration:

```bash
npm run migrate:maindb
```

This will:

1. Detect schema changes from `schema.prisma`.
2. Generate SQL migration in `prisma/migrations/<timestamp>_<name>/migration.sql`.
3. Apply migration to development database.
4. Update `_prisma_migrations` table.

### Migration Best Practices

- **Name migrations descriptively**: `20260601_add_article_models` not `20260601_`.
- **Review generated SQL** in `migration.sql` before committing.
- **Test migrations locally** against a copy of production schema.
- **Always commit migrations** — never rewrite history.
- **Use shadow database** for safety (enabled by default).

### Migration Workflow

1. Modify `schema.prisma`.
2. Run `npm run migrate:maindb` and review the generated SQL.
3. Test thoroughly on local database.
4. Commit both `schema.prisma` and the migration folder.
5. On deployment, migrations auto-apply in CI/CD.

---

## Testing with Prisma

### Test Database Setup

Tests use a separate database (`testdb`) with its own migration history:

```bash
npm run migrate:testdb  # Apply migrations to test database
npm run seed:test      # (Optional) Seed test database
```

Environment variable in `.env.test`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/testdb?schema=public
```

### Test Patterns

#### Per-test database reset

```ts
// test/preliminaries.test.ts
import { describe, beforeEach, afterEach, test, expect } from "@jest/globals";
import prisma from "@/lib/prisma";

describe("User Repository", () => {
  beforeEach(async () => {
    // Clear user data before each test
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    // Cleanup after test
    await prisma.$disconnect();
  });

  test("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "student",
      },
    });
    expect(user.id).toBeDefined();
  });
});
```

#### Encrypted field testing

```ts
// When testing encrypted fields, the test database must have the same encryption key
test("should encrypt NIC during creation", async () => {
  const app = await prisma.menteeApplication.create({
    data: {
      fullName: "Test",
      email: "test@example.com",
      nic: encryptNIC("123456789V"), // Encrypt in test too
      // ...
    },
  });
  // NIC is stored encrypted; decryption happens at application layer
  expect(app.nic).not.toBe("123456789V");
});
```

---

## Repository Data Access Layer

All Prisma queries live in repositories, never in API routes or components.

### Repository File Naming

- Naming: `<domain>_repository_impl.ts` (snake_case).
- Location: `src/repositories/`.

### Base Repository Class

All repositories extend `BaseRepository<T>`:

```ts
// src/repositories/user_repository_impl.ts
import BaseRepository from "./baseRepository";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  // Add domain-specific queries
  async findByEmail(email: string) {
    return this.delegate.findUnique({ where: { email } });
  }

  async getActiveStudents() {
    return this.delegate.findMany({
      where: { role: "student", isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
```

### BaseRepository Methods

The `BaseRepository` provides:

```ts
class BaseRepository<T> {
  constructor(protected delegate: any) {}

  async getAll() { ... }           // Fetch all records
  async getById(id: string) { ... } // Fetch by primary key
  async create(data: any) { ... }   // Create record
  async update(id: string, data) {} // Update record
  async delete(id: string) { ... }  // Delete record
}
```

### Data Access Best Practices

- **Use repositories** — never call `prisma` directly from API routes.
- **Use types** — always type query results with Prisma generated types.
- **Order by created date** — default to `orderBy: { createdAt: "desc" }` for list queries.
- **Include relations** — use `.include()` or `.select()` only when needed (N+1 prevention).

```ts
async getProjectsWithMentors(studentId: string) {
  return this.delegate.findMany({
    where: { studentId },
    include: { mentors: true }, // Include related mentors
    orderBy: { createdAt: "desc" },
  });
}
```

---

## Common Workflows

### Full Database Reset (Development Only)

Reset database, run all migrations, and seed test data:

```bash
npm run db:reset
```

This runs:

1. `prisma migrate reset --force` (drops database, recreates, applies migrations).
2. `prisma migrate dev` (ensure migrations are applied).
3. `npm run seed` (populate test data).

**⚠️ Only use on development databases — never on production.**

### Schema Drift Recovery

If Prisma detects schema drift (manual database edits, conflicting migrations):

```bash
npm run migrate:maindb
```

Prisma will:

1. Detect drift in shadow database.
2. Prompt to resolve or reset.
3. Apply pending migrations.

### Inspect Database State

View data via Prisma Studio:

```bash
npm run db:studio
```

Opens a web UI to browse and edit data (development only).

### Migrate Test Database

When schema changes, always migrate the test database:

```bash
npm run migrate:testdb
```

Ensures tests run against the latest schema.

---

## Environment Variables

### Production (`.env`)

```env
DATABASE_URL=postgresql://user:pass@host:5432/proddb?schema=public
NIC_SSH_PUB_KEY_B64=<base64-encoded-rsa-public-key>
```

### Development (`.env.local` or `.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/devdb?schema=public
NIC_SSH_PUB_KEY_B64=<base64-encoded-rsa-public-key>
```

### Testing (`.env.test`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/testdb?schema=public
NIC_SSH_PUB_KEY_B64=<base64-encoded-rsa-public-key>
```

**All three must have the same encryption key** for encrypted field consistency.

---

## Troubleshooting

| Issue                               | Solution                                                              |
| ----------------------------------- | --------------------------------------------------------------------- |
| **Prisma out of sync**              | Run `npm run generate` to regenerate Prisma client.                   |
| **Migration conflicts**             | Delete conflicting `.sql` file, run `npm run migrate:maindb` again.   |
| **Test database drift**             | Run `npm run migrate:testdb`.                                         |
| **Encryption errors**               | Verify `NIC_SSH_PUB_KEY_B64` is set in `.env`.                        |
| **Seed fails on unique constraint** | Run `npm run db:reset` to clear database first.                       |
| **Connection pool exhausted**       | Increase `connection_limit` in PostgreSQL or reduce client instances. |

---

## Summary of Commands

| Command                  | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `npm run generate`       | Regenerate Prisma client after schema changes.       |
| `npm run migrate:maindb` | Create and apply migrations to development database. |
| `npm run migrate:testdb` | Apply migrations to test database.                   |
| `npm run db:studio`      | Open Prisma Studio to view/edit data.                |
| `npm run db:reset`       | Full reset: delete, migrate, seed.                   |
| `npm run db:delete`      | Drop database (dangerous, use with care).            |
| `npm run seed`           | Populate test data via `seed.mjs`.                   |
