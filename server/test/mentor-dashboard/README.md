# Mentor Dashboard Test Suite

Complete test coverage for the Mentor Dashboard component located at `server/src/app/mentor/dashboard/page.tsx`.

## 📋 Test Files

### 1. **mentorDashboard.test.tsx** (Main Component Tests)
- 20+ test cases for the main dashboard page
- Tests for rendering, data display, loading states, error handling, and navigation
- Covers Stats Cards, Recently Active Mentees table, empty states, and error states

### 2. **mentorDashboard.integration.test.tsx** (Integration & Edge Cases)
- 15+ test cases for edge cases and integration scenarios
- Tests for various data sizes (single mentee, many mentees, zero values)
- Tests for special characters, long names, rapid data changes
- Tests for state transitions and data consistency

### 3. **components.test.tsx** (UI Component Tests)
- 20+ test cases for StatCard and StatusBadge components
- Tests for rendering, styling, loading states, and color variants
- Independent component testing for reusability

### 4. **menteeRow.test.tsx** (Row Component Tests)
- 18+ test cases for MenteeRow component
- Tests for avatar generation, status badges, table cell styling
- Tests for hover effects and layout consistency

### 5. **mockData.ts** (Mock Data & Helpers)
- Reusable mock data for all test files
- Mock stats, mentees, errors, and edge case data
- Helper functions to create custom mock data
- Test scenario definitions

### 6. **TEST_SETUP.md** (Configuration Documentation)
- Jest configuration requirements
- Dependency information
- Test coverage details
- Running instructions

## 🎯 Test Coverage

**Total: 70+ Test Cases**

### Coverage Areas
- ✅ UI Rendering & Layout
- ✅ Data Display from API
- ✅ Loading States (Skeleton Loaders)
- ✅ Error States (Error Messages)
- ✅ Empty States (No Data)
- ✅ Navigation (View All Button)
- ✅ Component Styling & Classes
- ✅ Status Badges (Accepted/Pending/Rejected)
- ✅ Avatar Generation & Colors
- ✅ Table Rendering & Headers
- ✅ Edge Cases (Large Data, Special Characters)
- ✅ Data Consistency & Transitions

## 🚀 Running the Tests

### Prerequisites
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest ts-jest
```

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test mentorDashboard.test.tsx
```

### Run Mentor Dashboard Tests Only
```bash
npm test test/mentor-dashboard/
```

### Run with Coverage Report
```bash
npm test -- --coverage
```

### Watch Mode (Re-run on File Change)
```bash
npm test -- --watch
```

### Run Specific Test Suite
```bash
npm test -- -t "should render dashboard"
```

## 📋 Test Scenarios

### Main Dashboard (mentorDashboard.test.tsx)

| Scenario | Description |
|----------|-------------|
| Header Rendering | Dashboard header and titles display correctly |
| Stats Cards | All 4 stat cards show correct values |
| Loading State | Skeleton loaders appear while fetching |
| Error State | Error message displays on failure |
| Data Display | Mentees table shows all data correctly |
| Status Badges | Badges display with correct colors |
| Avatar Display | Initials avatars show for mentees |
| Empty State | "No mentees" message when list is empty |
| Navigation | "View All" button links to /mentor/mentees |

### Integration & Edge Cases (mentorDashboard.integration.test.tsx)

| Scenario | Description |
|----------|-------------|
| Single Mentee | Dashboard works with 1 mentee |
| Many Mentees | Dashboard handles 20+ mentees |
| Zero Stats | All stats can be 0 |
| Long Names | Handles very long names/projects |
| Special Characters | Handles José, García, AI/ML, etc. |
| All Statuses | Correctly displays Accepted/Pending/Rejected |
| Null Data | Gracefully handles null data |
| Custom Errors | Shows custom error messages |
| State Transitions | Handles loading → success → error flows |
| Large Values | Shows 9999+ hour values correctly |

### Components (components.test.tsx & menteeRow.test.tsx)

| Component | Test Cases |
|-----------|-----------|
| StatCard | 10+ tests (rendering, loading, styling) |
| StatusBadge | 10+ tests (all colors, styling) |
| MenteeRow | 18+ tests (avatar, status, layout) |

## 🔍 Mock Data

The test suite uses comprehensive mock data including:

- **Complete Data**: Full dashboard with stats and mentees
- **Empty Data**: No mentees available
- **Single Mentee**: Single entry in table
- **Many Mentees**: 20+ entries for load testing
- **Mixed Status**: Combination of Accepted/Pending/Rejected
- **Error States**: Multiple error scenarios
- **Edge Cases**: Special characters, long names, unicode
- **Color Palette**: All avatar and status colors tested

See `mockData.ts` for all available mock data.

## 🧪 Test Structure

Each test file follows this structure:

```typescript
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("@/hooks/mentor");
jest.mock("next/link");

describe("Component Name", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should test specific behavior", () => {
    // Arrange
    mockHook.mockReturnValue(mockData);
    
    // Act
    render(<Component />);
    
    // Assert
    expect(screen.getByText("expected text")).toBeInTheDocument();
  });
});
```

## 🎬 Key Testing Patterns

### 1. Mock Hooks
```typescript
jest.mock("@/hooks/mentor");
const mockUseMentorDashboard = useMentorDashboard as jest.Mock;
mockUseMentorDashboard.mockReturnValue({...});
```

### 2. Mock Next Components
```typescript
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});
```

### 3. Test Data Setup
```typescript
mockUseMentorDashboard.mockReturnValue({
  data: mockDashboardDataComplete,
  isLoading: false,
  error: null,
});
```

### 4. Query and Assertion
```typescript
render(<MentorDashboardPage />);
expect(screen.getByText("Dashboard Title")).toBeInTheDocument();
expect(screen.getAllByText("ACCEPTED")).toHaveLength(2);
```

## ✅ All Tests Pass

Current status: **✅ All 70+ tests passing**

Run tests to verify:
```bash
npm test -- test/mentor-dashboard/
```

## 📝 Notes

- All tests are isolated and can run independently
- Mock data is reusable and well-organized in `mockData.ts`
- Tests follow React Testing Library best practices
- No real API calls are made (all mocked)
- Tests verify behavior, not implementation details
- Compatible with Jest and React Testing Library

## 🔗 Related Files

- Component: `server/src/app/mentor/dashboard/page.tsx`
- Hook: `server/src/hooks/mentor/useMentorDashboard.ts`
- Types: `server/src/hooks/mentor/useMentorDashboard.ts`

## 📚 References

- [React Testing Library Docs](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Best Practices](https://testing-library.com/docs/queries/about)
