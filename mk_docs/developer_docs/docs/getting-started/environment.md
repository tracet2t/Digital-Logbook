# Environment Setup

Before running the app, you need to create a `.env` file in the `server/` directory. This file holds all the configuration values the application needs.

---

## Create the `.env` File

```bash
# From inside server/
cp .env.example .env
```

Then open `.env` in your editor and fill in the values.

---

## Environment Variables Reference

| Variable | Example Value | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/digital_logbook` | PostgreSQL connection string |
| `JWT_SECRET` | `your_super_secret_key` | Secret key used to sign JWT tokens |
| `EMAIL_USER` | `yourapp@gmail.com` | Gmail address used to send invitation emails |
| `EMAIL_PASS` | `your_app_password` | Gmail App Password (not your regular password) |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | The base URL of the application |
| `ISSUER` | `digital-logbook` | JWT issuer claim |
| `AUDIENCE` | `digital-logbook-users` | JWT audience claim |
| `JWT_EXPIRY` | `1d` | How long a JWT token is valid (`1d` = 1 day) |

---

## Full `.env` Example

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

---

## Important Notes

!!! warning "Never commit `.env` to Git"
    The `.env` file contains secrets. Make sure it's listed in `.gitignore` (it should be by default).

!!! tip "Gmail App Password"
    If you use Gmail for `EMAIL_USER`, you must generate an **App Password** from your Google Account settings.
    Regular Gmail passwords won't work if 2FA is enabled.

!!! tip "Changing the database password"
    If you change the PostgreSQL credentials, make sure to update both `DATABASE_URL` in `.env` **and** `docker-compose.yml`.

---

## What's Next?

- [Run the development server →](running.md)
