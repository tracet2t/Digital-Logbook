# 📘 Digital Logbook (Digital Diary)

A web application developed with **Next.js (TypeScript)**, **PostgreSQL** (via **Prisma**), and **Docker**. This project is part of the **TRACE T2T Internship Program** to help interns and mentors track evaluations and logbook entries efficiently.

---

## 🚀 Tech Stack

- **Frontend/Backend**: [Next.js](https://nextjs.org/) (v14.2.5) with TypeScript  
- **Database**: PostgreSQL (v16.3) via [Prisma ORM](https://www.prisma.io/)  
- **Containerization**: Docker with Compose  
- **Other Services**: Redis, pgAdmin

---

## 🔧 Prerequisites

Ensure you have the following installed:

- **Node.js**: `v22.7.0`
- **npm**: `v10.8.2`
- **Docker**: `v27.1.2`
- **PostgreSQL**: Installed **locally**
- **Docker Desktop** running

---

## 📁 Project Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/tracet2t/Digital-Logbook.git
cd Digital-Logbook
```

---

### 2. Configure Environment Variables

Edit a `.env` file in the root directory:

```env
BASE_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

# Authentication
JWT_SECRET="thisismysecretkey"
JWT_EXPIRY="60 min"
ISSUER=http://localhost:3000
AUDIENCE=http://localhost:3000

# Frontend
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Config - Replace with your credentials
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

📝 **Note**: Replace email credentials with valid ones.

---

### 3. Install Node and npm (Using `nvm`)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 22.7.0
nvm use
npm install -g npm@10.8.2
```

---

### 4. Install PostgreSQL Locally

You must have PostgreSQL running on your machine (outside Docker):

- Create a `postgres` database
- Use credentials:  
  - **User**: `postgres`  
  - **Password**: `postgres`

---

### 5. Prepare for Initial Docker Build

#### A. Dockerfile

In `server/Dockerfile`, **comment out** this line:

```Dockerfile
# RUN npx prisma migrate deploy
```

#### B. docker-compose.yml

**Comment out** the entire `nextjs-app` block:

```yaml
# nextjs-app:
#   container_name: nextjs-app
#   build:
#     context: ./server 
#     dockerfile: Dockerfile
#   ports:
#     - "3000:3000"
#   environment:
#     NEXT_PUBLIC_POSTGRES_HOST: pgdb
#     NEXT_PUBLIC_POSTGRES_USER: postgres
#     NEXT_PUBLIC_POSTGRES_PASSWORD: postgres
#     NEXT_PUBLIC_REDIS_HOST: redis
#     NEXT_PUBLIC_REDIS_PORT: 6379
#   depends_on:
#     - postgres
#     - redis
#   networks:
#     - mynetwork
#   dns:
#     - 8.8.8.8
#     - 1.1.1.1
```

---

## 🐳 Start Docker Services

```bash
docker compose up --build
```

This will run:

- **pgAdmin**: [http://localhost:8080](http://localhost:8080)  
- **PostgreSQL**
- **Redis**

---

## 🧬 Run Prisma Migrations

In a **new terminal**:

```bash
cd server/
npm install
npx prisma migrate dev
```

This sets up your DB schema and generates the Prisma client.

---

## ▶️ Run the App Locally

```bash
cd server/
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🛠 pgAdmin Setup (Optional)

- Go to: [http://localhost:8080](http://localhost:8080)  
- Login:
  - **Email**: `admin@example.com`
  - **Password**: `admin`
- Add a server manually:
  - **Host**: Use PostgreSQL container IP (get via `docker inspect`)
  - **Username**: `postgres`
  - **Password**: `postgres`

---

## 👤 Default Mentor Login

Use the following default login to access the mentor dashboard:

- **Email**: `mentor1@gmail.com`  
- **Password**: `t2tuser`

This account is created automatically on first migration.

---