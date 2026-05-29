import { describe, expect, test } from "@jest/globals";

describe("Environment Variables", () => {
  test("should load environment variables from .env.test", () => {
    expect(process.env.DATABASE_URL).toBe(
      "postgresql://postgres:postgres@localhost:5432/testdb?schema=public",
    );
  });
});
