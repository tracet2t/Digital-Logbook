# Troubleshooting

This page covers the most common issues you might run into when setting up or running Digital Logbook.

---

## Common Issues

### ❌ Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:**
Find and stop the process using port 3000, or run the app on a different port:

```bash
# Find the process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill it (replace <PID> with the process ID)
taskkill /PID <PID> /F

# Or run on a different port
PORT=3001 npm run dev
```

---

### ❌ Database Connection Error

**Error:**
```
Can't reach database server at localhost:5432
```

**Fix:**
Your Docker container isn't running. Start it:

```bash
docker compose up -d
```

Then verify it's up:

```bash
docker ps   # Should show a postgres container
```

---

### ❌ Missing Environment Variables

**Error:**
```
Error: Environment variable not found: JWT_SECRET
```

**Fix:**
Check that your `.env` file exists in `server/` and has all required variables. Compare with the [Environment Setup](environment.md) page.

---

### ❌ Prisma Client Not Generated

**Error:**
```
Cannot find module '.prisma/client'
```

**Fix:**
Regenerate the Prisma client:

```bash
npm run generate
```

---

### ❌ Schema / Migration Mismatch

**Error:**
```
The table 'public.Users' does not exist in the current database.
```

**Fix:**
Run migrations to bring the database up to date:

```bash
npm run migrate:maindb
```

If issues persist, check `prisma/migrations/` for pending migrations.

---

### ❌ Email Not Sending

**Symptom:** Invitations are created, but users don't receive emails.

**Fix:**
1. Double-check `EMAIL_USER` and `EMAIL_PASS` in `.env`.
2. If using Gmail, make sure you're using an **App Password**, not your regular password.
3. Check if Gmail has blocked the sign-in attempt — look for a security alert in your Gmail inbox.

---

## Still Stuck?

- Check the [Architecture](../architecture.md) page to understand the system better.
- Look at the [API Reference](../api/overview.md) for expected request/response shapes.
- Review the test files in `server/test/` for usage examples.
