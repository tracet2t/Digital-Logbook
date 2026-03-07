#!/bin/sh

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the Next.js standalone server
echo "Starting Next.js server..."
exec node server.js