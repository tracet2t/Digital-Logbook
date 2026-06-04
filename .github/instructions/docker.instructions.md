---
description: "Docker and containerization conventions. Use when: creating or modifying Dockerfiles, configuring docker-compose.yml, managing service dependencies, handling environment variables in containers, implementing health checks, setting up multi-stage builds, or troubleshooting container deployments."
applyTo: "Dockerfile*, docker-compose.yml, init/**, **/Dockerfile*"
---

# Docker & Containerization Conventions

## Architecture & Design Patterns

### Multi-Stage Builds

All Dockerfiles use **three-stage builds** to optimize image size and security:

1. **Base Stage** (`base`): Node 22.7.0-alpine foundation shared across stages
2. **Dependencies Stage** (`deps`): Install node modules from lockfile
3. **Builder Stage** (`builder`): Generate Prisma client and compile/build application code
4. **Runner Stage** (`runner`): Minimal production runtime with only necessary artifacts

**Benefits:**

- Reduces final image size (build tools excluded)
- Improves layer caching
- Enhances security (no dev dependencies in production)
- Supports lockfile-agnostic installation (yarn/npm/pnpm detection)

### Base Image Strategy

- **All services**: `node:22.7.0-alpine` (security updates, minimal footprint)
- Alpine is preferred for containerization; only use alternative bases if specific system libraries are required

---

## Security Best Practices

### Non-Root User Execution

Every Dockerfile **must** create and use a non-root user:

```dockerfile
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
```

- Use consistent GID/UID: `1001` for system users
- Apply `--chown` to all `COPY` operations copying into user-owned directories
- Drop root privileges before `CMD` or `ENTRYPOINT`

### File Permissions

When copying artifacts into the runner stage:

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
```

- Explicit `--chown` ensures user ownership of copied files
- Prevents permission issues at runtime
- Applies to source code, build output, and configuration files

---

## Next.js Application Container

### Dockerfile Structure

```dockerfile
FROM node:22.7.0-alpine AS base
FROM base AS deps
# Lockfile detection & install
FROM base AS builder
# Prisma client generation + npm run build
FROM base AS runner
# Production runtime
```

### Prisma Client Generation

**During Builder Stage:**

- Run `npx prisma generate` before `npm run build`
- This generates the Prisma Client code without requiring a database connection
- Build will fail if Prisma schema is invalid

**During Runtime (Startup Script):**

- Do **not** run migrations during image build
- Use `start.sh` script to execute `npx prisma migrate deploy` at container startup
- This ensures migrations run against the actual database, not during build

### Next.js Build Configuration

```dockerfile
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
```

- Disable telemetry in builder stage (no external calls during build)
- Use `npm run build` (not custom commands)
- Build output goes to `.next/standalone` in production runner

### Runtime Startup

The `start.sh` script **must** execute:

```bash
#!/bin/bash
npx prisma migrate deploy
exec node server.js
```

- Runs migrations in order before starting the app
- Handles fresh databases and schema updates gracefully
- `exec` ensures the Node process receives signals (SIGTERM for graceful shutdown)

### Exposed Ports & Environment

```dockerfile
EXPOSE 3000
ENV PORT=3000 HOSTNAME="0.0.0.0"
```

- Always expose port 3000 for Next.js
- Set `HOSTNAME=0.0.0.0` to listen on all interfaces (required in containers)
- Database and Redis connections use environment variables, not hardcoded defaults

---

## BullMQ Worker Container

### Dockerfile.worker Structure

The worker is a **separate, long-running process** consuming async tasks from Redis:

```dockerfile
FROM node:22.7.0-alpine AS base
FROM base AS deps
# Install with devDeps (tsx runtime needed)
FROM base AS builder
RUN npx prisma generate
FROM base AS runner
# Minimal runtime: node_modules, src, prisma, tsconfig
```

### Key Differences from App Container

- **Includes devDependencies**: `tsx` must be available at runtime for TypeScript execution
- **No public ports**: Worker does not expose any ports
- **TypeScript execution**: `tsx src/worker/index.ts` runs TS directly without compilation
- **No health check**: Workers are fire-and-forget; use BullMQ dashboard for monitoring

### Worker Process Execution

```dockerfile
CMD ["node_modules/.bin/tsx", "src/worker/index.ts"]
```

- Use absolute path to `tsx` binary for reliability
- Worker connects to Redis and PostgreSQL via environment variables
- Long-running process; container stays alive until stopped or error

---

## Environment Variables & Secrets Management

### Application Container

**Database & Cache (Internal Services):**

```
DATABASE_URL=postgresql://postgres:postgres@pgdb:5432/postgres?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
```

**Public/Client-Side Variables (prefixed `NEXT_PUBLIC_`):**

```
NEXT_PUBLIC_POSTGRES_HOST=pgdb
NEXT_PUBLIC_POSTGRES_USER=postgres
NEXT_PUBLIC_REDIS_HOST=redis
NEXT_PUBLIC_REDIS_PORT=6379
```

⚠️ **Warning**: `NEXT_PUBLIC_*` variables are embedded in client-side JavaScript. Do not put secrets here.

**MinIO (Object Storage):**

```
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}          # From .env
MINIO_SECRET_KEY=${MINIO_SECRET_KEY}          # From .env (not committed)
MINIO_USE_SSL=false
MINIO_BUCKET=${MINIO_BUCKET}
MINIO_PUBLIC_URL=${MINIO_PUBLIC_URL}
```

### Worker Container

**Database & Cache:**

```
DATABASE_URL=postgresql://postgres:postgres@pgdb:5432/postgres?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
```

**MinIO:**

```
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
MINIO_USE_SSL=false
MINIO_BUCKET=${MINIO_BUCKET}
MINIO_PUBLIC_URL=${MINIO_PUBLIC_URL}
```

**Email (for async notifications):**

```
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
```

### Secrets Convention

- **Not in git**: `.env` file containing `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `EMAIL_USER`, `EMAIL_PASS`
- **In docker-compose.yml**: Use `${VAR_NAME}` interpolation to read from `.env`
- **In production**: Use orchestrator secrets (Kubernetes Secrets, Docker Secrets, cloud provider secret managers)

---

## Docker Compose Service Dependencies

### Dependency Graph

```
nextjs-app ──┬── postgres (condition: service_healthy)
             ├── redis (condition: service_started)
             └── minio (condition: service_healthy)

worker ──────┬── postgres (condition: service_healthy)
             ├── redis (condition: service_started)
             └── minio (condition: service_healthy)

pgadmin ───── postgres (depends_on, no condition)
```

### Health Check Patterns

**PostgreSQL:**

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5
```

- Uses `pg_isready` (efficient, no TCP connection overhead)
- 5-second intervals with 5-second timeout (total ~25s failure detection)
- 5 retries before marking unhealthy

**MinIO:**

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
  interval: 10s
  timeout: 5s
  retries: 5
```

- HTTP endpoint check (MinIO-specific)
- Slightly longer intervals (10s) for S3-like object storage
- Detects readiness and object storage API functionality

**Redis:**

- No explicit health check (fast to start, rarely fails)
- If needed: `["CMD", "redis-cli", "ping"]`

### Service Startup Order

- `postgres` must be healthy before `nextjs-app` and `worker` start
- `minio` must be healthy before `nextjs-app` and `worker` start
- `redis` starts but no health check required
- `pgadmin` is optional for development (may wait on postgres without strict condition)

---

## Networking

### Network Type

```yaml
networks:
  mynetwork:
    driver: bridge
```

- **Custom bridge network** allows service-to-service DNS resolution by container name
- Services reference each other as `postgres`, `redis`, `minio` (not `localhost:6379`)
- Isolates containers from the host network

### Host vs Container Networking

| Context                | Usage                                                       |
| ---------------------- | ----------------------------------------------------------- |
| **Inside container**   | `REDIS_HOST=redis` (service name on custom bridge)          |
| **From host machine**  | `localhost:6379` (port forwarded in `docker-compose.yml`)   |
| **Between containers** | `redis:6379` (service name + port on custom bridge network) |

### DNS Configuration

The `nextjs-app` service includes custom DNS:

```yaml
dns:
  - 8.8.8.8 # Google
  - 1.1.1.1 # Cloudflare
```

- Ensures external API calls resolve correctly (e.g., email services)
- Only set if default container DNS fails for external resolution

---

## Volumes & Persistence

### Defined Volumes

```yaml
volumes:
  postgres:
    driver: local
  minio_data:
    driver: local
```

- **Local driver**: Data stored on host machine (`/var/lib/docker/volumes/...`)
- **Persistence**: Survives container restarts and removals
- **Development**: Sufficient for local testing
- **Production**: Use cloud storage or persistent volumes

### Volume Mounting Strategy

- **postgres**: Anonymous volume (default), persists database data
- **minio_data**: Named volume, persists object storage data
- **No volume mounts for app/worker**: Stateless application containers

---

## Building & Running

### Build Context

Both Dockerfiles build from `./server` directory:

```yaml
nextjs-app:
  build:
    context: ./server
    dockerfile: Dockerfile
```

- Build context includes `package.json`, `src/`, `prisma/`, `tsconfig.json`
- Avoids copying unnecessary files (docs, tests, .git)
- Dockerfile paths relative to build context

### Lockfile Detection (deps stage)

```dockerfile
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi
```

- Detects which package manager was used
- Ensures reproducible builds
- Fails explicitly if no lockfile found

### Startup Script Permission

```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh
RUN chmod +x ./start.sh
```

- `chmod +x` must be called after copying the script
- Ensures non-root user can execute (permissions already set via `--chown`)

---

## Common Patterns

### Environment Variable Propagation

```yaml
nextjs-app:
  environment:
    DATABASE_URL: "postgresql://..."
    REDIS_HOST: redis
    NEXT_PUBLIC_POSTGRES_HOST: pgdb # Client-side variable
```

- Pass environment variables in `docker-compose.yml`
- Use `${VAR_NAME}` syntax to read from `.env` file
- Container inherits all listed variables at startup

### Conditional Dependencies (for Production Readiness)

```yaml
depends_on:
  postgres:
    condition: service_healthy
```

- Only start when `postgres` health check passes
- Prevents connection errors on startup
- Apply to stateful services (databases, message brokers)

### Reusable Service Configuration

For services appearing in multiple containers, define at top level:

```yaml
x-postgres-connection: &postgres-url
  DATABASE_URL: "postgresql://postgres:postgres@pgdb:5432/postgres?schema=public"

services:
  nextjs-app:
    environment:
      <<: *postgres-url
```

- YAML anchors (`&`) and aliases (`*`) reduce duplication
- Easier to maintain single source of truth for shared config

---

## Troubleshooting

### Container Won't Start

1. Check logs: `docker logs <container_name>`
2. Verify health checks: `docker ps` (check STATUS column)
3. Ensure all dependencies are healthy first
4. Check environment variables: `docker inspect <container_name> | grep -A 100 Env`

### Migrations Fail at Startup

1. Verify `DATABASE_URL` is correct
2. Check `start.sh` is executable (`chmod +x`)
3. Ensure Prisma schema is valid (`npx prisma validate`)
4. Run manually: `docker exec <container> npx prisma migrate deploy --skip-generate`

### Services Can't Connect

1. Verify services are on same network (`docker network inspect mynetwork`)
2. Check service names match (use container name, not image name)
3. Confirm ports are correct (Redis: 6379, PostgreSQL: 5432, MinIO: 9000)
4. Test connectivity: `docker exec <container> ping <service_name>`

---

## Related Documentation

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [BullMQ Docker Example](https://docs.bullmq.io/)
- [Prisma Migration in Containers](https://www.prisma.io/docs/orm/prisma-migrate/getting-started)
