/**
 * Test Setup and Configuration for Mentor Dashboard Tests
 * 
 * This file documents the test structure and configuration needed
 * for running the Mentor Dashboard test suite.
 * 
 * Test Files:
 * - mentorDashboard.test.tsx: Main dashboard component tests (20+ test cases)
 * - mentorDashboard.integration.test.tsx: Integration & edge case tests (15+ test cases)
 * - components.test.tsx: StatCard & StatusBadge component tests (20+ test cases)
 * - menteeRow.test.tsx: MenteeRow component tests (18+ test cases)
 */

/**
 * JEST CONFIGURATION
 * 
 * Required jest.config.ts settings:
 * 
 * {
 *   preset: "ts-jest",
 *   testEnvironment: "jsdom",
 *   roots: ["<rootDir>/test"],
 *   moduleNameMapper: {
 *     "^@/(.*)$": "<rootDir>/src/$1",
 *   },
 *   setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
 *   testMatch: ["**/*.test.tsx", "**/*.test.ts"],
 *   transform: {
 *     "^.+\\.tsx?$": ["ts-jest", {
 *       tsconfig: {
 *         jsx: "react-jsx",
 *         esModuleInterop: true,
 *       },
 *     }],
 *   },
 * }
 */

/**
 * REQUIRED DEPENDENCIES
 * 
 * npm install --save-dev:
 * - @testing-library/react
 * - @testing-library/jest-dom
 * - @testing-library/user-event
 * - jest
 * - ts-jest
 * - @types/jest
 * - jest-environment-jsdom
 */

/**
 * TEST CATEGORIES
 */

// ============================================================================
// 1. MAIN DASHBOARD TESTS (mentorDashboard.test.tsx)
// ============================================================================

/**
 * Test Scenarios:
 * 
 * Header & Layout:
 * - Dashboard header renders correctly
 * - All labels and descriptions display
 * 
 * Stats Cards:
 * - All 4 stats cards render with correct values
 * - Total Mentees: 12
 * - Projects: 5
 * - Total Working Hours: 240h
 * - Average Working Hours: 20h
 * 
 * Loading State:
 * - Skeleton loaders display while loading
 * - Multiple skeleton items for table
 * 
 * Error State:
 * - Error message displays on API failure
 * - Error message in main dashboard section
 * - Error message in mentees section
 * 
 * Mentees Table:
 * - Table headers render correctly (NAME, PROJECT, LAST ACTIVITY, STATUS)
 * - All mentee rows display with data
 * - Status badges show correct colors
 * - Initials avatars display correctly
 * 
 * Empty State:
 * - "No recent mentees available" message displays
 * - Shows when mentees array is empty
 * 
 * Navigation:
 * - "View All" button displays
 * - "View All" button links to /mentor/mentees
 * 
 * Data Handling:
 * - Default values (0) when data is null
 * - Styling classes applied correctly
 * - Dashboard renders without errors
 */

// ============================================================================
// 2. COMPONENT TESTS (components.test.tsx)
// ============================================================================

/**
 * StatCard Component Tests:
 * - Renders with label and value
 * - Handles string and number values
 * - Displays loading skeleton
 * - Renders optional icon
 * - Applies correct styling (uppercase, tracking, bold)
 * - Hides value during loading
 * - Has proper border and shadow
 * - Supports multiple card instances
 * - Displays zero values
 * 
 * StatusBadge Component Tests:
 * - ACCEPTED status: green (emerald) styling
 * - PENDING status: yellow (amber) styling
 * - REJECTED status: red (rose) styling
 * - All statuses have border
 * - All have rounded-full class
 * - All have proper padding (px-2 py-1)
 * - All have correct font size and weight
 * - All three status types render correctly
 */

// ============================================================================
// 3. MENTEE ROW TESTS (menteeRow.test.tsx)
// ============================================================================

/**
 * MenteeRow Component Tests:
 * - Renders all mentee information
 * - Displays initials in avatar
 * - Name cell has correct styling
 * - Project cell has correct styling
 * - Last activity cell has correct styling
 * - Status badges render with correct colors
 * - Avatar has correct size (h-8 w-8)
 * - Row has hover effect
 * - Multiple rows render independently
 * - Different initials display correctly
 * - Border bottom styling applied
 * - Flex layout for name column
 * - Avatar font styling (semibold, text-sm)
 * - Activity time in correct cell
 * - Name and avatar together in first cell
 */

// ============================================================================
// 4. INTEGRATION & EDGE CASE TESTS (mentorDashboard.integration.test.tsx)
// ============================================================================

/**
 * Edge Cases:
 * - Single mentee in list
 * - Large number of mentees (20+)
 * - Zero values in stats
 * - Very long names and projects
 * - Special characters (José, García, AI/ML, etc.)
 * - All accepted mentees
 * - All pending mentees
 * - Mixed status mentees
 * - Null data handling
 * - Custom error messages
 * - Consecutive loading/success states
 * - Very large working hours values (9999)
 * - Layout consistency with various data
 * - Minimal valid data
 * - No error display when error is null
 * - Rapid data changes
 */

// ============================================================================
// RUNNING TESTS
// ============================================================================

/**
 * Commands:
 * 
 * Run all tests:
 * npm test
 * 
 * Run specific test file:
 * npm test mentorDashboard.test.tsx
 * 
 * Run with coverage:
 * npm test -- --coverage
 * 
 * Watch mode:
 * npm test -- --watch
 * 
 * Run only mentor-dashboard tests:
 * npm test test/mentor-dashboard/
 */

// ============================================================================
// MOCK SETUP
// ============================================================================

/**
 * Mocked Dependencies:
 * 
 * 1. useMentorDashboard hook
 *    - Returns: { data, isLoading, error }
 *    - Configurable for different scenarios
 * 
 * 2. next/link
 *    - Mocked to render as <a> tag
 *    - Preserves href attribute for navigation testing
 * 
 * 3. API calling
 *    - All API calls mocked through hook
 *    - No real network requests
 */

// ============================================================================
// TEST DATA STRUCTURE
// ============================================================================

/**
 * Mock Data:
 * 
 * DashboardStats:
 * - totalMentees: number
 * - projects: number
 * - totalWorkingHours: number
 * - averageWorkingHours: number
 * 
 * RecentMentee:
 * - initials: string (e.g., "JD")
 * - name: string
 * - project: string
 * - lastActivity: string (e.g., "2 hours ago")
 * - status: "ACCEPTED" | "PENDING" | "REJECTED"
 * 
 * MentorDashboardData:
 * - stats: DashboardStats
 * - recentlyActiveMentees: RecentMentee[]
 */

// ============================================================================
// TEST COVERAGE
// ============================================================================

/**
 * Current Coverage:
 * - 20+ main dashboard tests
 * - 15+ integration & edge case tests
 * - 20+ component tests (StatCard + StatusBadge)
 * - 18+ component tests (MenteeRow)
 * ──────────────────────────
 * Total: 70+ test cases
 * 
 * Coverage Areas:
 * ✓ UI Rendering
 * ✓ Data Display
 * ✓ Loading States
 * ✓ Error States
 * ✓ Empty States
 * ✓ Navigation
 * ✓ Styling & Layout
 * ✓ Edge Cases
 * ✓ Component Integration
 * ✓ Status Badges
 * ✓ Avatars & Color Generation
 * ✓ Large & Small Data Sets
 * ✓ Special Characters
 * ✓ Rapid Data Changes
 */

export const TEST_CONFIGURATION = {
  environment: "jsdom",
  testMatch: ["**/*.test.tsx"],
  setupFiles: [],
  mocks: ["@/hooks/mentor", "next/link"],
  totalTestCases: 70,
  testFiles: [
    "mentorDashboard.test.tsx",
    "mentorDashboard.integration.test.tsx",
    "components.test.tsx",
    "menteeRow.test.tsx",
  ],
};
