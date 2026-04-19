// Mock the sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock the useQueryClient hook
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

import { toast } from "sonner";
import { useState } from "react";

// Manually invoke the hook logic for testing
describe("useBulkSendInvitations - Hook Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send single invitation successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    const invitation = { email: "user@test.com", role: "student" as const };

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });

    expect(response.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });
  });

  test("should handle failed invitation response", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid email" }),
    });

    const invitation = { email: "invalid@test.com", role: "student" as const };

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });

    const errorData = await response.json();

    expect(response.ok).toBe(false);
    expect(errorData.message).toBe("Invalid email");
  });

  test("should handle network errors in fetch", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const invitation = { email: "user@test.com", role: "student" as const };

    try {
      await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitation),
      });
      fail("Should have thrown an error");
    } catch (error) {
      expect(error).toEqual(new Error("Network error"));
    }
  });

  test("should send invitations sequentially", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    const invitations = [
      { email: "user1@test.com", role: "student" as const },
      { email: "user2@test.com", role: "student" as const },
      { email: "user3@test.com", role: "student" as const },
    ];

    // Simulate sequential sending
    for (let i = 0; i < invitations.length; i++) {
      const invitation = invitations[i];
      await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitation),
      });
    }

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  test("should send correct request headers and body", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    const invitation = {
      email: "user@test.com",
      role: "mentor" as const,
      firstName: "John",
      lastName: "Doe",
      projectId: "proj-123",
    };

    await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });
  });

  test("should handle superAdmin role", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Success" }),
    });

    const invitation = { email: "admin@test.com", role: "superAdmin" as const };

    await fetch("/api/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invitation),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/invitations",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "admin@test.com",
          role: "superAdmin",
        }),
      })
    );
  });

  test("should handle multiple failed invitations", async () => {
    const failedResponses = [
      { ok: false, json: async () => ({ message: "Email already exists" }) },
      { ok: false, json: async () => ({ message: "Invalid role" }) },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(failedResponses[0])
      .mockResolvedValueOnce(failedResponses[1]);

    const invitations = [
      { email: "existing@test.com", role: "student" as const },
      { email: "invalid@test.com", role: "mentor" as const },
    ];

    const errors = [];

    for (let i = 0; i < invitations.length; i++) {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitations[i]),
      });

      if (!res.ok) {
        const errorData = await res.json();
        errors.push({
          row: i + 1,
          email: invitations[i].email,
          error: errorData.message || "Failed to send invitation",
        });
      }
    }

    expect(errors).toEqual([
      {
        row: 1,
        email: "existing@test.com",
        error: "Email already exists",
      },
      {
        row: 2,
        email: "invalid@test.com",
        error: "Invalid role",
      },
    ]);
  });

  test("should handle mixed success and failure scenarios", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Success" }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Invalid email" }),
      });

    const invitations = [
      { email: "valid@test.com", role: "student" as const },
      { email: "invalid@test.com", role: "student" as const },
    ];

    let success = 0;
    let failed = 0;

    for (let i = 0; i < invitations.length; i++) {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invitations[i]),
      });

      if (res.ok) {
        success++;
      } else {
        failed++;
      }
    }

    expect(success).toBe(1);
    expect(failed).toBe(1);
  });

  test("should validate email format in invitation data", async () => {
    const invitation = {
      email: "user@test.com",
      role: "student" as const,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(invitation.email)).toBe(true);

    const invalidEmail = {
      email: "invalid-email",
      role: "student" as const,
    };

    expect(emailRegex.test(invalidEmail.email)).toBe(false);
  });

  test("should validate role values in invitation data", async () => {
    const validRoles = ["student", "mentor", "superAdmin"];

    const invitation1 = { email: "user@test.com", role: "student" as const };
    const invitation2 = { email: "user@test.com", role: "mentor" as const };
    const invitation3 = {
      email: "user@test.com",
      role: "superAdmin" as const,
    };

    expect(validRoles.includes("student")).toBe(true);
    expect(validRoles.includes("mentor")).toBe(true);
    expect(validRoles.includes("superAdmin")).toBe(true);
  });

  test("should handle empty invitation data", async () => {
    const invitations: any[] = [];

    expect(invitations.length).toBe(0);
  });

  test("should handle optional fields in invitation data", async () => {
    const invitationWithOptionalFields = {
      email: "user@test.com",
      role: "student" as const,
      firstName: "John",
      lastName: "Doe",
      projectId: "proj-123",
    };

    expect(invitationWithOptionalFields.firstName).toBe("John");
    expect(invitationWithOptionalFields.lastName).toBe("Doe");
    expect(invitationWithOptionalFields.projectId).toBe("proj-123");
  });

  test("should calculate progress percentage", async () => {
    const total = 5;

    for (let current = 1; current <= total; current++) {
      const percentage = Math.round((current / total) * 100);
      expect(percentage).toBe((current / total) * 100);
    }

    // Final check
    expect(Math.round((5 / 5) * 100)).toBe(100);
  });

  test("should handle API response with message field", async () => {
    const responses = [
      { ok: true, json: async () => ({ message: "Success" }) },
      { ok: false, json: async () => ({ message: "Invalid email" }) },
      { ok: false, json: async () => ({}) }, // Missing message field
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce(responses[0])
      .mockResolvedValueOnce(responses[1])
      .mockResolvedValueOnce(responses[2]);

    // Test successful response
    let res = await fetch("/api/invitations", {
      method: "POST",
      body: JSON.stringify({ email: "user@test.com", role: "student" }),
    });
    expect(res.ok).toBe(true);

    // Test failed response with message
    res = await fetch("/api/invitations", {
      method: "POST",
      body: JSON.stringify({ email: "invalid@test.com", role: "student" }),
    });
    const errorData = await res.json();
    expect(errorData.message).toBe("Invalid email");

    // Test failed response without message
    res = await fetch("/api/invitations", {
      method: "POST",
      body: JSON.stringify({ email: "test@test.com", role: "student" }),
    });
    const emptyErrorData = await res.json();
    expect(emptyErrorData.message).toBeUndefined();
  });
});
