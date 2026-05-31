import { describe, expect, test } from "@jest/globals";

describe("Environment Variables", () => {
  test("should load environment variables from .env.test", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.DATABASE_URL).toMatch(/^postgresql:\/\//);
  });
});
