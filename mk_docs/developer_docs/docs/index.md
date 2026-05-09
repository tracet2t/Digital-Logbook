# 📚 Digital Logbook

> **A modern mentorship management platform** built for organizations that want to track student progress, coordinate mentors, manage projects, and generate reports — all in one place.

---

## 🚀 What is Digital Logbook?

**Digital Logbook** is a full-stack web application that helps organizations run structured mentorship programs. It connects students, mentors, and administrators in a single platform where:

- 📋 **Students** log their daily activities and track their progress
- 👨‍🏫 **Mentors** review logs, give feedback, and monitor mentee performance
- 🛠️ **Admins** manage users, projects, invitations, and generate reports

Whether you're onboarding a new batch of students or reviewing monthly progress, Digital Logbook has you covered.

---

## ✨ Key Features

| Feature                   | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| 🔐 **Role-Based Access**  | Three roles: Student, Mentor, Super Admin — each with their own dashboard |
| 📁 **Project Management** | Create projects, assign mentors and students, track progress              |
| 📨 **Invitation System**  | Invite users via email with secure token-based registration               |
| 📊 **Activity Logging**   | Students log activities; mentors approve or reject with feedback          |
| 📈 **Reports**            | Generate and export CSV/PDF reports for mentor activity                   |
| 📤 **Bulk Upload**        | Upload Excel files to invite multiple users at once                       |
| 🖥️ **Admin Dashboard**    | Analytics, user management, kanban board, and system overview             |
| 🔒 **Secure Auth**        | JWT-based authentication with cookie sessions                             |

---

## 🏗️ System Architecture (Quick Overview)

```
User (Browser)
    │
    ▼
Next.js App (Frontend + API Routes)
    │
    ├── API Routes (/api/*)      ← Handles all backend logic
    ├── Middleware               ← JWT auth, role-based routing
    ├── Services & Repositories  ← Business logic + Prisma DB queries
    │
    ▼
PostgreSQL (via Prisma ORM)
    │
    ▼
Docker (containerized environment)
```

> For a detailed breakdown, see the [Architecture page](architecture.md).

---

## 🛠️ Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui |
| **Backend**  | Node.js, Next.js API Routes                            |
| **Database** | PostgreSQL 16 with Prisma ORM                          |
| **Auth**     | JSON Web Tokens (JWT), HTTP-only cookies               |
| **Queue**    | BullMQ + Redis (async report generation)               |
| **Email**    | Nodemailer (Gmail SMTP)                                |
| **Testing**  | Jest (unit + integration tests)                        |
| **DevOps**   | Docker, Docker Compose                                 |

---

## ⚡ Quick Start

Get the project running in 5 minutes:

```bash
# 1. Clone the repository
git clone <repo-url>
cd "Digital-Logbook v2/server"

# 2. Install dependencies
nvm use
npm install

# 3. Start the database (Docker)
docker compose up -d

# 4. Set up your environment
cp .env.example .env   # Edit with your values

# 5. Run database migrations
npm run generate
npm run migrate:maindb

# 6. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

!!! tip "First time here?"
Head to the [Installation Guide](getting-started/installation.md) for a step-by-step walkthrough with detailed explanations.

---

## 📖 How to Use This Documentation

This documentation is organized to take you from zero to productive as quickly as possible:

| Section                                        | What You'll Learn                               |
| ---------------------------------------------- | ----------------------------------------------- |
| [Getting Started](getting-started/overview.md) | How to install, configure, and run the project  |
| [Architecture](architecture.md)                | How the system is structured and how data flows |
| [Features](features/admin-dashboard.md)        | What each feature does and how to use it        |
| [Components](components/shared-admin.md)       | Reusable UI components and how to use them      |
| [API Reference](api/overview.md)               | All available API endpoints with examples       |
| [Deployment](deployment/docker.md)             | How to deploy with Docker                       |
| [Testing](testing.md)                          | How to run and interpret tests                  |

---

## 👥 User Roles at a Glance

```
Super Admin
├── Manages all users, projects, and invitations
├── Views system-wide analytics and reports
└── Full access to all admin features

Mentor
├── Reviews assigned student activity logs
├── Provides feedback and approves/rejects activities
└── Generates reports for their mentees

Student
├── Logs daily activities and progress
├── Views feedback from mentor
└── Tracks assigned projects
```

---

!!! note "Source of Truth"
This documentation is maintained alongside the codebase. If you notice anything outdated, please open an issue or submit a pull request.
