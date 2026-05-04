# Getting Started

Welcome! This section will help you set up and run the Digital Logbook project on your local machine.

## What You Need to Know First

Digital Logbook is a **Next.js full-stack application** that uses:

- **PostgreSQL** as the database (managed via Docker)
- **Prisma** as the ORM (database access layer)
- **Node.js** to run the server

The entire backend and frontend live in one codebase — the `server/` folder inside the repository.

---

## Prerequisites

Make sure you have the following installed before you begin:

| Tool | Required Version | Purpose |
|---|---|---|
| **Node.js** | v22.7.0 | Runtime for the app |
| **npm** | v10.8.2 | Package manager |
| **Docker** | v27.1.2+ | Runs PostgreSQL in a container |
| **nvm** *(optional)* | Any | Manages Node.js versions easily |

!!! tip "Using nvm"
    We recommend using `nvm` (Node Version Manager) to match the exact Node version required.
    The project includes a `.nvmrc` file — just run `nvm use` in the project root.

---

## Setup Overview

Setting up Digital Logbook involves these steps:

1. **Clone** the repository
2. **Install** Node dependencies
3. **Start** the PostgreSQL database via Docker
4. **Configure** environment variables
5. **Run** database migrations
6. **Start** the development server

Follow the guides in this section in order:

- [Installation](installation.md) — Clone and install dependencies
- [Environment Setup](environment.md) — Configure your `.env` file
- [Running the App](running.md) — Start the dev server
- [Troubleshooting](troubleshooting.md) — Common issues and fixes
