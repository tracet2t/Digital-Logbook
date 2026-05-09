# Production Checklist

Before deploying Digital Logbook to a production environment, go through this checklist to make sure everything is properly configured and secure.

---

## ✅ Environment & Configuration

- [ ] All `.env` variables are set for the production environment
- [ ] `JWT_SECRET` is a long, random, and unique string (not a test value)
- [ ] `JWT_EXPIRY` is set to an appropriate duration (e.g., `8h` or `1d`)
- [ ] `EMAIL_USER` and `EMAIL_PASS` are pointing to a production email account
- [ ] `NEXT_PUBLIC_BASE_URL` is set to the production domain (not `localhost`)
- [ ] `.env` file is **not** committed to version control

---

## ✅ Database

- [ ] PostgreSQL is running on a production-grade server or managed service
- [ ] Database backups are configured and tested
- [ ] All migrations have been applied (`npm run migrate:maindb`)
- [ ] Database connection string uses production credentials (not `postgres:postgres`)

---

## ✅ Application Build

- [ ] Run `npm run build` to generate the production build
- [ ] Build completes without TypeScript errors
- [ ] All tests pass (`npm run test`)
- [ ] No `console.log` statements left in production code

---

## ✅ Security

- [ ] JWT tokens are stored in **HTTP-only cookies** (already the default)
- [ ] CORS is configured correctly for your domain
- [ ] Sensitive routes are protected by middleware (already implemented)
- [ ] Error messages don't expose internal stack traces to users
- [ ] Database is not publicly accessible (only reachable from the app server)

---

## ✅ Docker (if using containers)

- [ ] Docker Compose is configured for production (separate from dev)
- [ ] Containers are set to restart on failure (`restart: always`)
- [ ] Volumes are configured for database persistence
- [ ] Redis is running if BullMQ report generation is needed

---

## ✅ Performance

- [ ] PostgreSQL connection pooling is configured
- [ ] BullMQ queue has enough Redis memory allocated
- [ ] Next.js static assets are served via a CDN or optimized hosting

---

## ✅ Monitoring

- [ ] Application logs are routed to a logging service
- [ ] Database connection errors will trigger alerts
- [ ] Uptime monitoring is set up

---

!!! tip "Managed Hosting"
    Consider using managed services for production:
    - **Database:** Supabase, Railway, or AWS RDS for PostgreSQL
    - **App:** Vercel (optimized for Next.js) or a VPS with Docker
    - **Redis:** Upstash (serverless Redis) for BullMQ queues

---

## Related Pages

- [Docker Setup](docker.md) — Docker configuration details
- [Environment Setup](../getting-started/environment.md) — All environment variables
- [Special Logic](../special-logic.md) — BullMQ/Redis details
