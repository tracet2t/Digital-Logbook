import { defineConfig } from "prisma";

export default defineConfig({
  schema: "./prisma/schema.prisma",

  migrations: {
    path: "./prisma/migrations",
  },

  seed: "ts-node prisma/seed.ts",

  studio: {
    port: 5555,
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
});
