# Setup Guide

!!! note "This page is a quick reference"
    For a full step-by-step walkthrough, see the [Getting Started](getting-started/overview.md) section.

---

## Prerequisites

| Tool | Required Version |
|---|---|
| Node.js | v22.7.0 |
| npm | v10.8.2 |
| Docker | v27.1.2+ |
| PostgreSQL | v16.3 (via Docker) |
| nvm *(optional)* | Any |

---

## Quick Setup

```bash
# Clone and navigate
git clone <repo-url>
cd "Digital-Logbook v2/server"

# Set Node version
nvm use

# Install dependencies
npm install npm@10.8.2
npm install

# Start database
docker compose up -d

# Apply migrations
npm run generate
npm run migrate:maindb

# Start dev server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create `server/.env` with:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/digital_logbook
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ISSUER=your_issuer
AUDIENCE=your_audience
JWT_EXPIRY=1d
```

See [Environment Setup](getting-started/environment.md) for a full description of each variable.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| Port 3000 in use | Stop other services or change the port |
| Database not connecting | Make sure Docker is running (`docker compose up -d`) |
| Missing env vars | Check your `.env` file |
| Prisma errors | Run `npm run generate` and `npm run migrate:maindb` |

See [Troubleshooting](getting-started/troubleshooting.md) for more details.
