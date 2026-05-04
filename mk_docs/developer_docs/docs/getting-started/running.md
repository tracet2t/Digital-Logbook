# Running the App

Once you've installed dependencies and set up your environment, you're ready to start the development server.

---

## Start the Development Server

```bash
# From inside server/
npm run dev
```

Or, if you use Yarn:

```bash
yarn dev
```

After a few seconds, you should see output like:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## What to Expect

When you first open the app, you'll see the **login page**. Since there are no users yet, you'll need to create a Super Admin via the database or a seed script (check the repo README for seed instructions).

---

## Useful npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production build |
| `npm run test` | Run all Jest tests |
| `npm run generate` | Regenerate Prisma client after schema changes |
| `npm run migrate:maindb` | Apply new Prisma migrations to the database |

---

## Keeping Docker Running

The database must be running while the app is active. If you stopped Docker, restart it:

```bash
docker compose up -d
```

You can verify the database is up:

```bash
docker ps   # Should show a postgres container running
```

---

!!! tip "Hot Reload"
    The dev server uses Next.js hot reloading — changes to your code will reflect in the browser instantly without a full restart.
