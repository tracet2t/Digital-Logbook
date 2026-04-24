/**
 * Mentee Profile API - Testing & Verification Guide
 * 
 * This file demonstrates how to test and verify the mentee profile API
 * endpoint with various scenarios and edge cases.
 */

// ═════════════════════════════════════════════════════════════════════════
// 1. UNIT TESTS FOR THE API ENDPOINT
// ═════════════════════════════════════════════════════════════════════════

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/mentee/profile/route';

describe('GET /api/mentee/profile', () => {
  let mockSession: any;
  let mockPrisma: any;

  beforeEach(() => {
    // Mock the session
    mockSession = {
      isAuthenticated: jest.fn().mockReturnValue(true),
      getRole: jest.fn().mockReturnValue('student'),
      getId: jest.fn().mockReturnValue('student-uuid-123'),
    };

    // Mock prisma calls
    mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
      projectMentor: {
        findFirst: jest.fn(),
      },
    };
  });

  describe('Authentication & Authorization', () => {
    test('should return 401 if user is not authenticated', async () => {
      mockSession.isAuthenticated.mockReturnValue(false);

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('Unauthorized');
    });

    test('should return 403 if user role is not student', async () => {
      mockSession.getRole.mockReturnValue('mentor');

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('Forbidden');
    });

    test('should return 401 if user ID is missing', async () => {
      mockSession.getId.mockReturnValue(null);

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.message).toContain('User ID not found');
    });
  });

  describe('Success Response', () => {
    test('should return 200 with complete profile data', async () => {
      const mockProfileData = {
        id: 'student-uuid-123',
        firstName: 'Alex',
        lastName: 'Sterling',
        email: 'alex@example.com',
        role: 'student',
        isActive: true,
        isFirstTimeLogin: false,
        batchNo: 'Q3-2024',
        createdAt: new Date('2024-08-27'),
        updatedAt: new Date('2024-09-15'),
        projectAllocations: [
          {
            id: 'proj-alloc-1',
            project: {
              id: 'proj-1',
              name: 'Digital Heritage v2',
              description: 'Archive project',
              batchNo: 'Q3-2024',
            },
            timeAllocationStatus: 'accepted',
            assignedAt: new Date('2024-09-01'),
          },
        ],
        badges: [
          {
            badge: {
              id: 'badge-1',
              name: 'First Steps',
              description: 'Completed first activity',
              iconUrl: 'https://example.com/badge.png',
            },
            awardedAt: new Date('2024-09-01'),
          },
        ],
        activities: [
          {
            id: 'activity-1',
            date: new Date('2024-09-15'),
            timeSpent: 2.5,
            status: 'pending',
            feedback: {
              id: 'feedback-1',
              status: 'pending',
              feedbackNotes: null,
            },
          },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockProfileData);

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.profile.email).toBe('alex@example.com');
      expect(data.data.projects).toHaveLength(1);
      expect(data.data.badges).toHaveLength(1);
    });

    test('should return 404 if user profile not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('not found');
    });
  });

  describe('Statistics Calculation', () => {
    test('should correctly calculate profile statistics', async () => {
      const mockProfileData = {
        id: 'student-uuid-123',
        firstName: 'Alex',
        lastName: 'Sterling',
        email: 'alex@example.com',
        role: 'student',
        isActive: true,
        isFirstTimeLogin: false,
        batchNo: 'Q3-2024',
        createdAt: new Date(),
        updatedAt: new Date(),
        projectAllocations: [],
        badges: [],
        activities: [
          { id: '1', date: new Date(), timeSpent: 2.5, status: 'accepted', feedback: { status: 'approved', feedbackNotes: '' } },
          { id: '2', date: new Date(), timeSpent: 3.0, status: 'pending', feedback: null },
          { id: '3', date: new Date(), timeSpent: 1.5, status: 'rejected', feedback: { status: 'rejected', feedbackNotes: '' } },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockProfileData);

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));
      const data = await response.json();

      expect(data.data.statistics.totalActivities).toBe(3);
      expect(data.data.statistics.approvedActivities).toBe(1);
      expect(data.data.statistics.pendingActivities).toBe(1);
      expect(data.data.statistics.rejectedActivities).toBe(1);
      expect(data.data.statistics.totalHours).toBe(7); // 2.5 + 3 + 1.5
    });
  });

  describe('Error Handling', () => {
    test('should return 500 on database error', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('DB connection failed'));

      const response = await GET(new NextRequest(new URL('http://localhost:3000/api/mentee/profile')));

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('Internal server error');
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════
// 2. INTEGRATION TESTS WITH REACT QUERY HOOK
// ═════════════════════════════════════════════════════════════════════════

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMenteeProfile } from '@/_hooks/mentee/useMenteeProfile';

describe('useMenteeProfile Hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  test('should fetch and return mentee profile', async () => {
    const mockData = {
      success: true,
      data: {
        profile: {
          id: 'uuid-123',
          firstName: 'Alex',
          lastName: 'Sterling',
          email: 'alex@example.com',
          fullName: 'Alex Sterling',
          role: 'student',
          isActive: true,
          isFirstTimeLogin: false,
          batchNo: 'Q3-2024',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        projects: [],
        mentor: null,
        badges: [],
        statistics: {
          totalActivities: 0,
          approvedActivities: 0,
          pendingActivities: 0,
          rejectedActivities: 0,
          totalHours: 0,
          profileCompletion: 50,
        },
        recentActivities: [],
      },
      timestamp: new Date().toISOString(),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useMenteeProfile(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData.data);
    expect(result.current.error).toBeNull();
  });

  test('should handle unauthorized error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        message: 'Unauthorized',
      }),
    });

    const { result } = renderHook(() => useMenteeProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Unauthorized');
  });

  test('should retry on failure', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { profile: { id: 'uuid' } },
        }),
      });

    const { result } = renderHook(() => useMenteeProfile(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
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
    const response = await fetch('http://localhost:3000/api/mentee/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: sends HTTP-only cookie
    });

    console.log('Status:', response.status);

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('Profile:', data.data.profile);
      console.log('Statistics:', data.data.statistics);
      console.log('Projects:', data.data.projects);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

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

import { MenteeProfileResponse } from '@/types/menteeProfile';

function validateProfileResponse(response: unknown): response is MenteeProfileResponse {
  const resp = response as any;

  return (
    resp.success === true &&
    resp.data &&
    resp.data.profile &&
    resp.data.profile.id &&
    resp.data.profile.firstName &&
    resp.data.profile.lastName &&
    resp.data.profile.email &&
    resp.data.profile.role === 'student' &&
    Array.isArray(resp.data.projects) &&
    Array.isArray(resp.data.badges) &&
    Array.isArray(resp.data.recentActivities) &&
    resp.data.statistics &&
    typeof resp.data.statistics.profileCompletion === 'number' &&
    typeof resp.timestamp === 'string'
  );
}

test('API response matches expected schema', async () => {
  const response = await fetch('/api/mentee/profile', {
    credentials: 'include',
  });
  const data = await response.json();

  expect(validateProfileResponse(data)).toBe(true);
  expect(data.data.profile.role).toBe('student');
  expect(data.data.statistics.profileCompletion).toBeGreaterThanOrEqual(0);
  expect(data.data.statistics.profileCompletion).toBeLessThanOrEqual(100);
});

// ═════════════════════════════════════════════════════════════════════════
// 5. PERFORMANCE TESTING
// ═════════════════════════════════════════════════════════════════════════

async function measureApiPerformance() {
  const startTime = performance.now();

  const response = await fetch('/api/mentee/profile', {
    credentials: 'include',
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

describe('Mentee Profile - Edge Cases', () => {
  test('should handle user with no projects', async () => {
    // User with empty projectAllocations array
    // Expected: projects array is empty, mentor is null
  });

  test('should handle user with no badges', async () => {
    // User with empty badges array
    // Expected: badges array is empty
  });

  test('should handle user with no activities', async () => {
    // User with empty activities array
    // Expected: all statistics are 0, recentActivities is empty
  });

  test('should calculate profile completion correctly', async () => {
    // Test various scenarios:
    // - Minimal profile: ~33%
    // - Full profile: ~85-100%
  });

  test('should handle very long strings gracefully', async () => {
    // Test with long names, descriptions, feedback notes
  });

  test('should handle timezone differences', async () => {
    // Dates should be ISO strings
  });
});

// ═════════════════════════════════════════════════════════════════════════
// 7. SECURITY TESTING
// ═════════════════════════════════════════════════════════════════════════

describe('Mentee Profile - Security', () => {
  test('should not expose sensitive data in error messages', async () => {
    // Error responses should not contain database queries or paths
  });

  test('should enforce role-based access strictly', async () => {
    // Mentor should not access student profile endpoint
    // SuperAdmin should not access student profile endpoint
  });

  test('should validate JWT token signature', async () => {
    // Tampered tokens should be rejected
  });

  test('should not return other users\' data', async () => {
    // User A should only see User A's profile
    // No way to query other users
  });

  test('should handle expired tokens correctly', async () => {
    // Should return 401, not 500
  });
});

export { testMenteeProfile, validateProfileResponse, measureApiPerformance };
