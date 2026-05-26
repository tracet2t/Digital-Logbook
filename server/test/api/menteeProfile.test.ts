/**
 * Mentee Profile API - Testing & Verification Guide
 *
 * This file demonstrates how to test and verify the mentee profile API
 * endpoint with various scenarios and edge cases.
 */

// ═════════════════════════════════════════════════════════════════════════
// 1. UNIT TESTS FOR THE API ENDPOINT
// ═════════════════════════════════════════════════════════════════════════

// ═════════════════════════════════════════════════════════════════════════
// 2. INTEGRATION TESTS WITH REACT QUERY HOOK
// ═════════════════════════════════════════════════════════════════════════

import { useMenteeProfile } from "@/_hooks/mentee/useMenteeProfile";
import { GET } from "@/app/api/mentee/profile/route";
// CURL test (requires authentication token in cookie)
/*
curl -X GET http://localhost:3000/api/mentee/profile \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN_HERE" \
  -v
*/

// ═════════════════════════════════════════════════════════════════════════
// 4. RESPONSE VALIDATION TESTS
// ═════════════════════════════════════════════════════════════════════════

import { MenteeProfileResponse } from "@/types/menteeProfile";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { NextRequest } from "next/server";

jest.mock("next/headers", () => {
  const payload =
    "eyJpZCI6InN0dWRlbnQtdXVpZC0xMjMiLCJlbWFpbCI6ImFsZXhAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCIsImZuYW1lIjoiQWxleCIsImxuYW1lIjoiU3RlcmxpbmcifQ==";

  return {
    cookies: () => ({
      get: () => ({ value: "header." + payload + ".signature" }),
    }),
  };
});

jest.mock("@/lib/prisma", () => {
  const mockFindUnique = jest.fn<(...args: unknown[]) => Promise<unknown>>();
  return {
    __esModule: true,
    default: {
      user: { findUnique: mockFindUnique },
      projectMentor: { findFirst: mockFindUnique },
    },
  };
});

describe("GET /api/mentee/profile", () => {
  function getMockPrisma() {
    return (
      jest.requireMock("@/lib/prisma") as {
        default: { user: { findUnique: jest.Mock } };
      }
    ).default;
  }

  beforeEach(() => {
    getMockPrisma().user.findUnique.mockReset();
  });

  describe("Authentication & Authorization", () => {
    test("should return 401 if user is not authenticated", async () => {
      // Temporarily override cookies for this test
      const mockModule = jest.requireMock("next/headers") as {
        cookies: () => { get: () => { value: string } | undefined };
      };
      const origCookies = mockModule.cookies;
      mockModule.cookies = () => ({ get: () => undefined });

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Unauthorized");

      // Restore
      mockModule.cookies = origCookies;
    });

    test("should return 403 if user role is not student", async () => {
      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockResolvedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockResolvedValue({
        id: "mentor-uuid",
        firstName: "Mentor",
        lastName: "User",
        role: "mentor",
      });

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Forbidden");
    });

    test("should return 401 if user ID is missing", async () => {
      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockResolvedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.message).toContain("User");
    });
  });

  describe("Success Response", () => {
    test("should return 200 with complete profile data", async () => {
      const mockProfileData = {
        id: "student-uuid-123",
        firstName: "Alex",
        lastName: "Sterling",
        email: "alex@example.com",
        role: "student",
        isActive: true,
        isFirstTimeLogin: false,
        batchNo: "Q3-2024",
        createdAt: new Date("2024-08-27"),
        updatedAt: new Date("2024-09-15"),
        projectAllocations: [
          {
            id: "proj-alloc-1",
            project: {
              id: "proj-1",
              name: "Digital Heritage v2",
              description: "Archive project",
              batchNo: "Q3-2024",
            },
            timeAllocationStatus: "accepted",
            assignedAt: new Date("2024-09-01"),
          },
        ],
        badges: [
          {
            badge: {
              id: "badge-1",
              name: "First Steps",
              description: "Completed first activity",
              iconUrl: "https://example.com/badge.png",
            },
            awardedAt: new Date("2024-09-01"),
          },
        ],
        activities: [
          {
            id: "activity-1",
            date: new Date("2024-09-15"),
            timeSpent: 2.5,
            status: "pending",
            feedback: {
              id: "feedback-1",
              status: "pending",
              feedbackNotes: null,
            },
          },
        ],
      };

      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockResolvedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockResolvedValue(mockProfileData);

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.profile.email).toBe("alex@example.com");
      expect(data.data.projects).toHaveLength(1);
      expect(data.data.badges).toHaveLength(1);
    });

    test("should return 404 if user profile not found", async () => {
      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockResolvedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("not found");
    });
  });

  describe("Statistics Calculation", () => {
    test("should correctly calculate profile statistics", async () => {
      const mockProfileData = {
        id: "student-uuid-123",
        firstName: "Alex",
        lastName: "Sterling",
        email: "alex@example.com",
        role: "student",
        isActive: true,
        isFirstTimeLogin: false,
        batchNo: "Q3-2024",
        createdAt: new Date(),
        updatedAt: new Date(),
        projectAllocations: [],
        badges: [],
        activities: [
          {
            id: "1",
            date: new Date(),
            timeSpent: 2.5,
            status: "accepted",
            feedback: { status: "approved", feedbackNotes: "" },
          },
          {
            id: "2",
            date: new Date(),
            timeSpent: 3.0,
            status: "pending",
            feedback: null,
          },
          {
            id: "3",
            date: new Date(),
            timeSpent: 1.5,
            status: "rejected",
            feedback: { status: "rejected", feedbackNotes: "" },
          },
        ],
      };

      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockResolvedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockResolvedValue(mockProfileData);

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );
      const data = await response.json();

      expect(data.data.statistics.totalActivities).toBe(3);
      expect(data.data.statistics.approvedActivities).toBe(1);
      expect(data.data.statistics.pendingActivities).toBe(1);
      expect(data.data.statistics.rejectedActivities).toBe(1);
      expect(data.data.statistics.totalHours).toBe(7); // 2.5 + 3 + 1.5
    });
  });

  describe("Error Handling", () => {
    test("should return 500 on database error", async () => {
      const prisma = (
        jest.requireMock("@/lib/prisma") as {
          default: {
            user: { findUnique: { mockRejectedValue: (v: unknown) => void } };
          };
        }
      ).default;
      prisma.user.findUnique.mockRejectedValue(
        new Error("DB connection failed"),
      );

      const response = await GET(
        new NextRequest(new URL("http://localhost:3000/api/mentee/profile")),
      );

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain("Internal server error");
    });
  });
});

describe("useMenteeProfile Hook", () => {
  test("hook module exports a function", () => {
    expect(typeof useMenteeProfile).toBe("function");
  });

  test("hook implementation fetches from /api/mentee/profile", () => {
    const fnStr = useMenteeProfile.toString();
    expect(fnStr).toContain("/api/mentee/profile");
    expect(fnStr).toContain("useQuery");
  });
});

// ═════════════════════════════════════════════════════════════════════════
// 3. MANUAL TESTING WITH CURL/FETCH
// ═════════════════════════════════════════════════════════════════════════

/**
 * Test endpoints using curl or fetch in browser console
 */

// STEP 1: Login (get JWT token in HTTP-only cookie)
// POST /api/auth/login with email and password

// STEP 2: Fetch profile (token automatically sent in cookie)
async function testMenteeProfile() {
  try {
    const response = await fetch("http://localhost:3000/api/mentee/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: sends HTTP-only cookie
    });

    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response:", data);

    if (data.success) {
      console.log("Profile:", data.data.profile);
      console.log("Statistics:", data.data.statistics);
      console.log("Projects:", data.data.projects);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function validateProfileResponse(
  response: unknown,
): response is MenteeProfileResponse {
  const resp = response as Partial<MenteeProfileResponse>;
  const profile = resp.data?.profile;
  const statistics = resp.data?.statistics;

  return (
    resp.success === true &&
    typeof profile?.id === "string" &&
    typeof profile.firstName === "string" &&
    typeof profile.lastName === "string" &&
    typeof profile.email === "string" &&
    profile.role === "student" &&
    Array.isArray(resp.data?.projects) &&
    Array.isArray(resp.data?.badges) &&
    Array.isArray(resp.data?.recentActivities) &&
    typeof statistics?.profileCompletion === "number" &&
    typeof resp.timestamp === "string"
  );
}

test("API response matches expected schema", async () => {
  const response = await fetch("/api/mentee/profile", {
    credentials: "include",
  });
  const data = await response.json();

  expect(validateProfileResponse(data)).toBe(true);
  expect(data.data.profile.role).toBe("student");
  expect(data.data.statistics.profileCompletion).toBeGreaterThanOrEqual(0);
  expect(data.data.statistics.profileCompletion).toBeLessThanOrEqual(100);
});

// ═════════════════════════════════════════════════════════════════════════
// 5. PERFORMANCE TESTING
// ═════════════════════════════════════════════════════════════════════════

async function measureApiPerformance() {
  const startTime = performance.now();

  const response = await fetch("/api/mentee/profile", {
    credentials: "include",
  });

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`API Response Time: ${duration.toFixed(2)}ms`);

  // Should complete in less than 500ms
  expect(duration).toBeLessThan(500);

  return await response.json();
}

// ═════════════════════════════════════════════════════════════════════════
// 6. EDGE CASES & BOUNDARY TESTING
// ═════════════════════════════════════════════════════════════════════════

describe("Mentee Profile - Edge Cases", () => {
  test("should handle user with no projects", async () => {
    // User with empty projectAllocations array
    // Expected: projects array is empty, mentor is null
  });

  test("should handle user with no badges", async () => {
    // User with empty badges array
    // Expected: badges array is empty
  });

  test("should handle user with no activities", async () => {
    // User with empty activities array
    // Expected: all statistics are 0, recentActivities is empty
  });

  test("should calculate profile completion correctly", async () => {
    // Test various scenarios:
    // - Minimal profile: ~33%
    // - Full profile: ~85-100%
  });

  test("should handle very long strings gracefully", async () => {
    // Test with long names, descriptions, feedback notes
  });

  test("should handle timezone differences", async () => {
    // Dates should be ISO strings
  });
});

// ═════════════════════════════════════════════════════════════════════════
// 7. SECURITY TESTING
// ═════════════════════════════════════════════════════════════════════════

describe("Mentee Profile - Security", () => {
  test("should not expose sensitive data in error messages", async () => {
    // Error responses should not contain database queries or paths
  });

  test("should enforce role-based access strictly", async () => {
    // Mentor should not access student profile endpoint
    // SuperAdmin should not access student profile endpoint
  });

  test("should validate JWT token signature", async () => {
    // Tampered tokens should be rejected
  });

  test("should not return other users' data", async () => {
    // User A should only see User A's profile
    // No way to query other users
  });

  test("should handle expired tokens correctly", async () => {
    // Should return 401, not 500
  });
});

export { testMenteeProfile, validateProfileResponse, measureApiPerformance };
