# Docker Setup

Digital Logbook uses **Docker** to run PostgreSQL (and optionally Redis) in isolated containers. This makes setup consistent across machines — no need to install PostgreSQL locally.

---

## What Docker Runs

| Service | Image | Purpose |
|---|---|---|
| **postgres** | `postgres:16` | Main PostgreSQL database |
| **redis** *(if configured)* | `redis:alpine` | BullMQ queue for async report generation |

---

## Starting Docker

From the `server/` directory:

```bash
# First time — builds the image
docker compose up --build

# Subsequent starts
docker compose up -d      # -d runs in background (detached)
```

---

## Stopping Docker

```bash
docker compose down       # Stops containers but keeps data
docker compose down -v    # ⚠️ Also deletes volumes (all DB data)
```

!!! warning "Deleting Volumes"
    Running `docker compose down -v` will **erase your database**. Only do this if you want a fresh start.

---

## Verifying Everything is Running

```bash
docker ps
```

You should see output like:

```
CONTAINER ID   IMAGE         STATUS         PORTS
abc123         postgres:16   Up 2 minutes   0.0.0.0:5432->5432/tcp
```

---

## Docker Compose Configuration

The `docker-compose.yml` file in `server/` defines the services. Key settings:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: digital_logbook
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
```

!!! tip "Changing Credentials"
    If you change `POSTGRES_USER` or `POSTGRES_PASSWORD` here, update `DATABASE_URL` in your `.env` file to match.

---

## Connecting to the Database Directly

To inspect the database via `psql`:

```bash
docker exec -it <container_name> psql -U postgres -d digital_logbook
```

Or use a GUI tool like **pgAdmin**, **TablePlus**, or **DBeaver** — connect to `localhost:5432`.

---

## Related Pages

- [Installation](../getting-started/installation.md) — Full setup walkthrough
- [Environment Setup](../getting-started/environment.md) — DATABASE_URL configuration
- [Troubleshooting](../getting-started/troubleshooting.md) — Docker connection errors
- [Production Checklist](checklist.md) — Things to do before going live
