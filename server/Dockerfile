# Install dependencies only when needed
FROM node:22.7.0-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm config set registry https://registry.npm.taobao.org && npm install


# Rebuild the source code only when needed
FROM node:22.7.0-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run the application
FROM node:22.7.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]