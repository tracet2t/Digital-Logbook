<div align="center">

# 📚 Digital-Logbook

### A Modern Mentorship & Learning Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.19.1-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.3-316192?logo=postgresql)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Digital-Logbook** is a comprehensive full-stack web application designed to facilitate structured learning relationships between mentees and mentors. It provides a robust platform for tracking learning activities, managing projects, delivering feedback, and generating performance reports.

### What Problem Does It Solve?

- **Activity Tracking**: Students log daily learning activities with time spent and technologies used
- **Mentor Oversight**: Mentors review student progress and provide timely, structured feedback
- **Project Management**: Organize learning across multiple domains (software, film, training, research)
- **Performance Analytics**: Generate detailed reports on mentor activities and student progress
- **User Administration**: Streamlined user management, invitations, and role-based access control
- **Gamification**: Award badges to recognize and motivate student achievements

### Who Is It For?

- **Students/Mentees**: Track learning progress, receive feedback, and earn recognition
- **Mentors**: Monitor mentees, provide feedback, and log mentoring activities
- **Super Admins**: Manage users, projects, invitations, and platform analytics

---

## ✨ Features

### For Students

- 📝 **Activity Logging** - Log daily activities with time tracking and technology tags
- 📊 **Progress Dashboard** - Visualize learning progress and performance metrics
- 🏆 **Gamification** - Earn badges for achievements and milestones
- 👤 **Profile Management** - Manage personal information and learning preferences
- 📅 **Task Calendar** - Calendar view of activities and deadlines

### For Mentors

- 👥 **Mentee Management** - View and manage assigned students
- ✅ **Feedback System** - Approve, reject, or provide feedback on student activities
- 📈 **Bulk Reporting** - Generate comprehensive reports (PDF/Excel export)
- 📅 **Activity Calendar** - Calendar view of all mentee activities
- ⏱️ **Time Tracking** - Log mentoring hours and activities

### For Super Admins

- 🎯 **Project Management** - Create and manage projects across multiple domains
- 👤 **User Management** - Create, deactivate, and manage user roles
- 📧 **Bulk Invitations** - Send and track email invitations with unique tokens
- 📊 **Analytics Dashboard** - Platform-wide analytics and insights
- 🏆 **Badge Management** - Create and award achievement badges
- ⚠️ **Warning System** - Flag and monitor concerning activity patterns
- 📄 **Report Management** - View and manage generated reports

### Cross-Platform Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🎨 **Modern UI** - Beautiful, responsive interface with TailwindCSS
- 🚀 **Type-Safe APIs** - End-to-end type safety with oRPC
- 📱 **Responsive Design** - Mobile-friendly interface
- 🌙 **Dark Mode Support** - Theme switching capability
- 📧 **Email Notifications** - Automated email notifications via Nodemailer
- 🔄 **Background Jobs** - Async task processing with BullMQ

---

## 🛠️ Tech Stack

### Frontend

| Technology                                      | Version | Purpose                         |
| ----------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                  | 14.2.5  | React framework with SSR/SSG    |
| [React](https://react.dev/)                     | 18.x    | UI library                      |
| [TypeScript](https://www.typescriptlang.org/)   | 5.x     | Type-safe JavaScript            |
| [TailwindCSS](https://tailwindcss.com/)         | Latest  | Utility-first CSS framework     |
| [Radix UI](https://www.radix-ui.com/)           | Latest  | Accessible component primitives |
| [shadcn/ui](https://ui.shadcn.com/)             | Latest  | Re-usable component library     |
| [React Hook Form](https://react-hook-form.com/) | 7.x     | Form validation                 |
| [Zod](https://zod.dev/)                         | 3.x     | Schema validation               |
| [TanStack Query](https://tanstack.com/query)    | v5      | Data fetching & caching         |

### Backend

| Technology                                                            | Version | Purpose                   |
| --------------------------------------------------------------------- | ------- | ------------------------- |
| [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) | 14.2.5  | API endpoints             |
| [oRPC](https://orpc.io/)                                              | 1.13.14 | Type-safe RPC framework   |
| [Prisma](https://www.prisma.io/)                                      | 5.19.1  | ORM for database access   |
| [PostgreSQL](https://www.postgresql.org/)                             | 16.3    | Relational database       |
| [Redis](https://redis.io/)                                            | Latest  | Caching & job queue       |
| [BullMQ](https://docs.bullmq.io/)                                     | 5.x     | Background job processing |
| [Jose](https://github.com/panva/jose)                                 | 5.x     | JWT token handling        |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)                  | 5.x     | Password hashing          |
| [Nodemailer](https://nodemailer.com/)                                 | 6.x     | Email sending             |

### DevOps & Tools

| Technology                                         | Version | Purpose                       |
| -------------------------------------------------- | ------- | ----------------------------- |
| [Docker](https://www.docker.com/)                  | 27.1.2+ | Containerization              |
| [Docker Compose](https://docs.docker.com/compose/) | Latest  | Multi-container orchestration |
| [Jest](https://jestjs.io/)                         | Latest  | Testing framework             |
| [ESLint](https://eslint.org/)                      | Latest  | Code linting                  |
| [Prettier](https://prettier.io/)                   | Latest  | Code formatting               |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `v22.7.0` (use [nvm](https://github.com/nvm-sh/nvm) for version management)
- **npm**: `10.8.2`
- **Docker**: `27.1.2+` ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Latest version
- **Git**: Latest version

> **Note**: Using the exact Node.js and npm versions is crucial for compatibility.

---

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/tracet2t/Digital-Logbook.git
cd Digital-Logbook

# 2. Navigate to server directory
cd server

# 3. Use the correct Node.js version
nvm use
# If not installed, run: nvm install

# 4. Install npm version
npm install npm@10.8.2

# 5. Install dependencies
npm install

# 6. Start Docker containers (from root directory)
cd ..
docker compose up --build

# 7. Return to server directory
cd server

# 8. Run database migrations
npm run migrate:maindb

# 9. Seed the database (optional)
npm run seed

# 10. Start the development server
npm run dev

# 11. Open your browser
# Application: http://localhost:3000
# PgAdmin: http://localhost:8080
```

---

## 💻 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/tracet2t/Digital-Logbook.git
cd Digital-Logbook
```

### Step 2: Set Up Node.js Environment

```bash
cd server

# Install Node Version Manager (if not already installed)
# https://github.com/nvm-sh/nvm#installing-and-updating

# Use the required Node.js version
nvm use

# If the version is not installed
nvm install

# Install the correct npm version
npm install npm@10.8.2
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp dotenv .env
```

Edit `.env` with your configuration (see [Environment Variables](#-environment-variables) section).

---

## 🔐 Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:your-db-password@pgdb:5432/postgres?schema=public"
NEXT_PUBLIC_POSTGRES_HOST=pgdb
NEXT_PUBLIC_POSTGRES_USER=postgres
NEXT_PUBLIC_POSTGRES_PASSWORD=your-db-password

# Redis Configuration (for job queue)
NEXT_PUBLIC_REDIS_HOST=redis
NEXT_PUBLIC_REDIS_PORT=6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
BASE_URL=http://localhost:3000

# Email Configuration (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@example.com

# Application Configuration
NODE_ENV=development
```

> ⚠️ **Security Warning**: Never commit your `.env` file to version control. The `.env` file is already in `.gitignore`.

### Environment Variable Descriptions

| Variable        | Description                                     | Example                               |
| --------------- | ----------------------------------------------- | ------------------------------------- |
| `DATABASE_URL`  | PostgreSQL connection string                    | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`    | Secret key for JWT token signing (min 32 chars) | `your-super-secret-key`               |
| `BASE_URL`      | Application base URL                            | `http://localhost:3000`               |
| `SMTP_HOST`     | SMTP server hostname                            | `smtp.gmail.com`                      |
| `SMTP_PORT`     | SMTP server port                                | `587` or `465`                        |
| `SMTP_USER`     | SMTP username/email                             | `your-email@example.com`              |
| `SMTP_PASSWORD` | SMTP password                                   | `your-app-password`                   |

---

## 🗄️ Database Setup

### Using Docker (Recommended)

The project uses Docker Compose to manage PostgreSQL, Redis, and pgAdmin:

```bash
# From project root directory
# First time setup
docker compose up --build

# Subsequent runs
docker compose up
```

This will start:

- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`
- **pgAdmin** on `localhost:8080` (admin@example.com / admin)

### Run Migrations

```bash
cd server
npm run migrate:maindb
```

### Seed Database (Optional)

```bash
npm run seed
```

### Database Tools

```bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:delete
```

---

## 📁 Project Structure

```
Digital-Logbook/
├── server/                          # Main application directory
│   ├── src/
│   │   ├── app/                     # Next.js pages & layouts
│   │   │   ├── admin/              # Super admin pages
│   │   │   ├── mentor/             # Mentor pages
│   │   │   ├── student/            # Student pages
│   │   │   └── login/              # Authentication pages
│   │   ├── components/             # React components
│   │   │   ├── admin/              # Admin-specific components
│   │   │   ├── mentor/             # Mentor-specific components
│   │   │   └── ui/                 # Shared UI components (shadcn/ui)
│   │   ├── routers/                # oRPC API routers
│   │   ├── repositories/           # Data access layer (Prisma)
│   │   ├── services/               # Business logic
│   │   ├── server_actions/         # Next.js Server Actions
│   │   ├── middlewares/            # Authentication & routing middleware
│   │   ├── schemas/                # Zod validation schemas
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── utils/                  # Utility functions
│   │   ├── lib/                    # Library configurations
│   │   └── worker/                 # Background job workers (BullMQ)
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   ├── seed.mjs                # Database seeding script
│   │   └── migrations/             # Database migrations
│   ├── public/                     # Static assets
│   ├── test/                       # Test files
│   └── package.json                # Dependencies & scripts
├── docs/                           # Documentation
│   ├── api/                        # API documentation
│   ├── QA-Testcases/               # Test cases
│   └── schema/                     # Database schema docs
├── init/                           # Database initialization scripts
├── docker-compose.yml              # Docker services configuration
└── README.md                       # This file
```

---

## 📜 Available Scripts

Navigate to the `server/` directory and run:

| Script              | Command                  | Description                           |
| ------------------- | ------------------------ | ------------------------------------- |
| **Development**     | `npm run dev`            | Start development server on port 3000 |
| **Build**           | `npm run build`          | Build production bundle               |
| **Start**           | `npm start`              | Start production server               |
| **Lint**            | `npm run lint`           | Run ESLint                            |
| **Test**            | `npm test`               | Run Jest tests                        |
| **Prisma Generate** | `npm run generate`       | Generate Prisma Client                |
| **Migrate DB**      | `npm run migrate:maindb` | Run database migrations               |
| **Migrate Test DB** | `npm run migrate:testdb` | Run test database migrations          |
| **Seed DB**         | `npm run seed`           | Seed database with initial data       |
| **Prisma Studio**   | `npm run db:studio`      | Open Prisma Studio (DB GUI)           |
| **Reset DB**        | `npm run db:delete`      | Reset database (⚠️ deletes all data)  |

---

## 📚 API Documentation

### oRPC Framework

This project uses [oRPC](https://orpc.io/) for type-safe API development. oRPC provides:

- End-to-end type safety
- Automatic OpenAPI schema generation
- Runtime validation with Zod
- React Query integration

### API Routes

API routers are located in `server/src/routers/`:

- **Authentication**: User login, registration, password reset
- **Projects**: CRUD operations for projects
- **Invitations**: Bulk invitations and invitation management
- **Activities**: Student activity logging and retrieval
- **Feedback**: Mentor feedback on student activities
- **Reports**: Report generation and management
- **Users**: User management (admin)
- **Badges**: Badge creation and awarding

### Documentation Links

- [API Registration & Authentication](./docs/api/API_Registration.md)
- [API Projects](./docs/api/API_PROJECTS.md)
- [API Invitations](./docs/api/API_INVITATIONS.md)
- [oRPC Beginner Guide](./server/ORPC_BEGINNER_GUIDE.md)
- [oRPC Quick Reference](./server/ORPC_QUICK_REFERENCE.md)
- [oRPC Implementation Explanation](./server/ORPC_IMPLEMENTATION_EXPLANATION.md)

---

## 🧪 Testing

The project uses **Jest** for unit and integration testing.

### Run Tests

```bash
cd server

# Run all tests
npm test

# Run tests for specific file
npm test -- invitationRepository.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

Test files are located in `server/test/`:

- `invitationRepository.test.ts` - Invitation repository tests
- `menteeTechnologyRepository.test.ts` - Technology repository tests
- `preliminaries.test.ts` - Preliminary setup tests
- `studentTaskTechnologiesRoute.test.ts` - Route tests

### Test Documentation

Comprehensive test cases are documented in [docs/QA-Testcases/](./docs/QA-Testcases/):

- [Admin Dashboard Component](./docs/QA-Testcases/ADMIN_DASHBOARD_COMPONENT.md)
- [Project Component](./docs/QA-Testcases/PROJECT_COMPONENT.md)
- [User Component](./docs/QA-Testcases/USER_COMPONENT.md)
- [Report Component](./docs/QA-Testcases/REPORT_COMPONENT.md)
- [Invitation Repository](./docs/QA-Testcases/INVITATION_REPOSITORY.md)
- [Overall Admin Module](./docs/QA-Testcases/OVERALL_ADMIN_MODULE_TESTCASES.md)

---

## 🚢 Deployment

### Docker Deployment

The application is containerized and can be deployed using Docker:

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f nextjs-app

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes data)
docker compose down -v
```

### Production Considerations

1. **Environment Variables**: Use production values for all sensitive variables
2. **Database**: Use managed PostgreSQL service (e.g., AWS RDS, Supabase)
3. **Redis**: Use managed Redis service (e.g., Redis Cloud, AWS ElastiCache)
4. **Secrets Management**: Use environment variable managers (e.g., AWS Secrets Manager)
5. **SSL/TLS**: Enable HTTPS with valid SSL certificates
6. **Monitoring**: Set up logging and monitoring (e.g., Sentry, DataDog)
7. **Backups**: Configure automated database backups

### Recommended Platforms

- [Vercel](https://vercel.com/) - Next.js optimized deployment
- [Railway](https://railway.app/) - Full-stack deployment
- [AWS](https://aws.amazon.com/) - EC2, ECS, or App Runner
- [DigitalOcean](https://www.digitalocean.com/) - App Platform or Droplets

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in package.json dev script
"dev": "next dev -p 3001"
```

#### Docker Issues

```bash
# Restart Docker services
docker compose down
docker compose up --build

# Clean Docker cache
docker system prune -a
```

#### Database Connection Issues

1. Ensure Docker containers are running: `docker compose ps`
2. Check `DATABASE_URL` in `.env` file
3. Verify PostgreSQL container health: `docker logs pgdb`

#### Prisma Client Issues

```bash
# Regenerate Prisma Client
npm run generate

# Reset and regenerate
npm run db:delete
npm run migrate:maindb
npm run generate
```

#### Node Version Mismatch

```bash
# Ensure correct Node.js version
nvm use

# If not installed
nvm install 22.7.0
nvm use 22.7.0
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📖 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) directory:

### Setup & Installation

- [Environment Setup Guide](./docs/README.md)

### Feature Guides

- [Bulk Invitation Guide](./docs/BULK_INVITATION_GUIDE.md)
- [Shared Components Guide](./docs/shared-components-guide.md)

### API Documentation

- [Authentication & Registration API](./docs/api/API_Registration.md)
- [Projects API](./docs/api/API_PROJECTS.md)
- [Invitations API](./docs/api/API_INVITATIONS.md)

### Developer Guides

- [oRPC Beginner Guide](./server/ORPC_BEGINNER_GUIDE.md)
- [oRPC Quick Reference](./server/ORPC_QUICK_REFERENCE.md)
- [oRPC Implementation Details](./server/ORPC_IMPLEMENTATION_EXPLANATION.md)

### Database

- [Database Schema Documentation](./docs/schema/README.md)

### Testing

- [QA Test Cases](./docs/QA-Testcases/)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed
4. **Run tests**
   ```bash
   npm test
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Code Style Guidelines

- **TypeScript**: Use strict type checking
- **Components**: Follow React best practices
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for complex functions
- **Formatting**: Run Prettier before committing
- **Testing**: Write tests for new features

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Project Structure Conventions

- **Components**: Place in appropriate domain folder (`admin/`, `mentor/`, `student/`)
- **Routers**: Use oRPC router pattern
- **Repositories**: Follow repository pattern for data access
- **Schemas**: Define Zod schemas for validation
- **Types**: Add TypeScript interfaces in `types/` directory

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2024 tracet2t

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [oRPC](https://orpc.io/) - Type-safe RPC framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📞 Support

For questions, issues, or feature requests:

- **Issues**: [GitHub Issues](https://github.com/tracet2t/Digital-Logbook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tracet2t/Digital-Logbook/discussions)

---

## © Copyright & Rights

**All rights reserved © 2024-2026 Tracet2t**

This project and all associated intellectual property, including but not limited to source code, documentation, design, and trademarks, are the exclusive property of **Tracet2t**.

While this software is licensed under the MIT License (see [LICENSE](./LICENSE) file), all rights not expressly granted by the license are reserved by Tracet2t.

---

<div align="center">

Made with ❤️ by [Tracet2t](https://github.com/tracet2t)

**© 2024-2026 Tracet2t. All Rights Reserved.**

⭐ Star this repository if you find it helpful!

</div>
