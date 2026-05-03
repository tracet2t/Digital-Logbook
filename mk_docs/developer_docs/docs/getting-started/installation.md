# Installation

This guide walks you through cloning the project and installing all dependencies.

---

## Step 1 — Clone the Repository

```bash
git clone <repo-url>
```

After cloning, your folder structure will look like this:

```
Digital-Logbook v2/
├── server/          ← Main application code lives here
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── docker-compose.yml
└── docs/            ← Project documentation
```

---

## Step 2 — Navigate to the Server Folder

All commands should be run from inside the `server/` directory:

```bash
cd "Digital-Logbook v2/server"
```

---

## Step 3 — Set the Correct Node Version

The project requires **Node.js v22.7.0**. If you use `nvm`:

```bash
nvm use          # Uses the version in .nvmrc
nvm install      # Only needed if the version isn't installed yet
```

You can verify your Node version:

```bash
node --version   # Should print v22.7.0
```

---

## Step 4 — Install Dependencies

```bash
npm install npm@10.8.2   # Pin npm to the required version
npm install              # Install all project dependencies
```

!!! note "Why pin npm?"
    The project was developed and tested with `npm@10.8.2`. Using a different version might produce unexpected behavior with lock files.

---

## Step 5 — Start the Database

The project uses **PostgreSQL running inside Docker**. Start it with:

```bash
# First time — builds the Docker image
docker compose up --build

# Subsequent runs — just start it
docker compose up -d
```

!!! warning "Docker must be running"
    Make sure Docker Desktop is open and running before executing this command.

---

## Step 6 — Run Database Migrations

Once the database is up, apply the Prisma schema:

```bash
npm run generate       # Generates Prisma client
npm run migrate:maindb # Applies migrations to the database
```

---

## What's Next?

- [Configure environment variables →](environment.md)
- [Start the development server →](running.md)
