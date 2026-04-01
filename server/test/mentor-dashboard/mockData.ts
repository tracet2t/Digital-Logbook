/**
 * Mock Data for Mentor Dashboard Tests
 * 
 * This file contains reusable mock data and helper functions
 * for the Mentor Dashboard test suite.
 */

import { MentorDashboardData, RecentMentee } from "@/hooks/mentor/useMentorDashboard";

/**
 * Mock Dashboard Stats
 */
export const mockStatsComplete = {
  totalMentees: 12,
  projects: 5,
  totalWorkingHours: 240,
  averageWorkingHours: 20,
};

export const mockStatsEmpty = {
  totalMentees: 0,
  projects: 0,
  totalWorkingHours: 0,
  averageWorkingHours: 0,
};

export const mockStatsSingle = {
  totalMentees: 1,
  projects: 1,
  totalWorkingHours: 10,
  averageWorkingHours: 10,
};

export const mockStatsLarge = {
  totalMentees: 100,
  projects: 50,
  totalWorkingHours: 5000,
  averageWorkingHours: 50,
};

/**
 * Mock Recently Active Mentees
 */
export const mockMentees = {
  john: {
    initials: "JD",
    name: "John Doe",
    project: "E-Commerce Platform",
    lastActivity: "2 hours ago",
    status: "ACCEPTED" as const,
  },
  sarah: {
    initials: "SM",
    name: "Sarah Miller",
    project: "Mobile App",
    lastActivity: "1 day ago",
    status: "PENDING" as const,
  },
  aditya: {
    initials: "AB",
    name: "Aditya Bansal",
    project: "Data Analytics",
    lastActivity: "3 hours ago",
    status: "ACCEPTED" as const,
  },
  mike: {
    initials: "MT",
    name: "Mike Taylor",
    project: "DevOps Platform",
    lastActivity: "30 mins ago",
    status: "REJECTED" as const,
  },
  lucy: {
    initials: "LJ",
    name: "Lucy Jones",
    project: "Cloud Infrastructure",
    lastActivity: "45 mins ago",
    status: "PENDING" as const,
  },
};

/**
 * Mock Complete Dashboard Data
 */
export const mockDashboardDataComplete: MentorDashboardData = {
  stats: mockStatsComplete,
  recentlyActiveMentees: [
    mockMentees.john,
    mockMentees.sarah,
    mockMentees.aditya,
  ],
};

/**
 * Mock Empty Dashboard Data
 */
export const mockDashboardDataEmpty: MentorDashboardData = {
  stats: mockStatsEmpty,
  recentlyActiveMentees: [],
};

/**
 * Mock Dashboard Data with Single Mentee
 */
export const mockDashboardDataSingle: MentorDashboardData = {
  stats: mockStatsSingle,
  recentlyActiveMentees: [mockMentees.john],
};

/**
 * Mock Dashboard Data with Many Mentees
 */
export const mockDashboardDataMany: MentorDashboardData = {
  stats: mockStatsLarge,
  recentlyActiveMentees: Array.from({ length: 20 }, (_, i) => ({
    initials: `M${i}`,
    name: `Mentee ${i}`,
    project: `Project ${i}`,
    lastActivity: `${i} hours ago`,
    status: (i % 3 === 0 ? "ACCEPTED" : i % 3 === 1 ? "PENDING" : "REJECTED") as
      | "ACCEPTED"
      | "PENDING"
      | "REJECTED",
  })),
};

/**
 * Mock Dashboard Data with All Statuses
 */
export const mockDashboardDataMixedStatus: MentorDashboardData = {
  stats: {
    totalMentees: 5,
    projects: 3,
    totalWorkingHours: 100,
    averageWorkingHours: 20,
  },
  recentlyActiveMentees: [
    mockMentees.john,      // ACCEPTED
    mockMentees.sarah,     // PENDING
    mockMentees.mike,      // REJECTED
    mockMentees.lucy,      // PENDING
    {
      initials: "CS",
      name: "Chris Smith",
      project: "Frontend Framework",
      lastActivity: "1 hour ago",
      status: "ACCEPTED" as const,
    },
  ],
};

/**
 * Mock Error Objects
 */
export const mockErrors = {
  generic: new Error("Failed to fetch mentor dashboard data"),
  database: new Error("Database connection failed"),
  network: new Error("Network error"),
  timeout: new Error("Request timeout"),
  unauthorized: new Error("Unauthorized access"),
  validation: new Error("Invalid request data"),
};

/**
 * Helper function to create mock dashboard data
 */
export function createMockDashboardData(
  stats: {
    totalMentees: number;
    projects: number;
    totalWorkingHours: number;
    averageWorkingHours: number;
  },
  mentees: RecentMentee[] = []
): MentorDashboardData {
  return {
    stats,
    recentlyActiveMentees: mentees,
  };
}

/**
 * Helper function to create mock mentee
 */
export function createMockMentee(
  overrides: Partial<RecentMentee> = {}
): RecentMentee {
  return {
    initials: "JD",
    name: "John Doe",
    project: "Sample Project",
    lastActivity: "just now",
    status: "ACCEPTED" as const,
    ...overrides,
  };
}

/**
 * Hook Return State Variations
 */
export const mockHookStates = {
  loading: {
    data: null,
    isLoading: true,
    error: null,
  },
  success: {
    data: mockDashboardDataComplete,
    isLoading: false,
    error: null,
  },
  error: {
    data: null,
    isLoading: false,
    error: mockErrors.generic,
  },
  empty: {
    data: mockDashboardDataEmpty,
    isLoading: false,
    error: null,
  },
  null: {
    data: null,
    isLoading: false,
    error: null,
  },
};

/**
 * Avatar Color Palette Test Cases
 */
export const mockAvatarColors = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
  { bg: "bg-green-100", text: "text-green-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-red-100", text: "text-red-700" },
];

/**
 * Status Badge Color Mapping
 */
export const mockStatusColorMap = {
  ACCEPTED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
  },
  PENDING: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
  },
  REJECTED: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
  },
};

/**
 * Edge Case Test Data
 */
export const mockEdgeCases = {
  veryLongName: {
    initials: "LN",
    name: "This is a very long mentor name that might overflow the table and cause layout issues",
    project: "Very Long Project Name That Exceeds Normal Length",
    lastActivity: "1 year 2 months and 3 days ago",
    status: "ACCEPTED" as const,
  },
  specialCharacters: {
    initials: "JG",
    name: "José García-López",
    project: "AI/ML Platform (v2.0) - Next-Gen",
    lastActivity: "2 hours ago",
    status: "PENDING" as const,
  },
  unicodeCharacters: {
    initials: "ZL",
    name: "张丽 (Zhang Li)",
    project: "数据分析平台 (Data Platform)",
    lastActivity: "3 hours ago",
    status: "ACCEPTED" as const,
  },
  minimalData: {
    initials: "AB",
    name: "A B",
    project: "P",
    lastActivity: "now",
    status: "ACCEPTED" as const,
  },
};

/**
 * Test Scenarios Factory
 */
export const testScenarios = {
  basicLoad: {
    scenario: "User opens dashboard with data loaded",
    state: mockHookStates.success,
    expectedBehavior: "Display all stats and mentees",
  },
  empty: {
    scenario: "Dashboard with no mentees",
    state: mockHookStates.empty,
    expectedBehavior: "Display empty state message",
  },
  loading: {
    scenario: "Dashboard data is loading",
    state: mockHookStates.loading,
    expectedBehavior: "Display loading skeletons",
  },
  error: {
    scenario: "Dashboard load failed",
    state: mockHookStates.error,
    expectedBehavior: "Display error message",
  },
  largeMenteeList: {
    scenario: "Dashboard with many mentees",
    state: {
      data: mockDashboardDataMany,
      isLoading: false,
      error: null,
    },
    expectedBehavior: "Render all mentees in table",
  },
};
