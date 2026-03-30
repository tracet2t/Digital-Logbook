import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MentorDashboardPage from "@/app/mentor/dashboard/page";

// Mock the useMentorDashboard hook
jest.mock("@/hooks/mentor", () => ({
  useMentorDashboard: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

import { useMentorDashboard } from "@/hooks/mentor";

const mockUseMentorDashboard = useMentorDashboard as jest.Mock;

describe("MentorDashboardPage - Integration & Edge Cases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle data with single mentee", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 1,
          projects: 1,
          totalWorkingHours: 10,
          averageWorkingHours: 10,
        },
        recentlyActiveMentees: [
          {
            initials: "JD",
            name: "John Doe",
            project: "Project A",
            lastActivity: "1 hour ago",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Project A")).toBeInTheDocument();
  });

  it("should handle data with large number of mentees", () => {
    const mentees = Array.from({ length: 20 }, (_, i) => ({
      initials: `M${i}`,
      name: `Mentee ${i}`,
      project: `Project ${i}`,
      lastActivity: `${i} hours ago`,
      status: i % 3 === 0 ? ("ACCEPTED" as const) : "PENDING" as const,
    }));

    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 20,
          projects: 15,
          totalWorkingHours: 500,
          averageWorkingHours: 25,
        },
        recentlyActiveMentees: mentees,
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("Mentee 0")).toBeInTheDocument();
    expect(screen.getByText("Mentee 5")).toBeInTheDocument();
  });

  it("should handle stats with zero values", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 0,
          projects: 0,
          totalWorkingHours: 0,
          averageWorkingHours: 0,
        },
        recentlyActiveMentees: [],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("No recent mentees available.")).toBeInTheDocument();
  });

  it("should handle very long names and projects", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 1,
          projects: 1,
          totalWorkingHours: 50,
          averageWorkingHours: 25,
        },
        recentlyActiveMentees: [
          {
            initials: "LN",
            name: "This is a very long mentor name that might overflow the table",
            project: "Very Long Project Name That Exceeds Normal Length",
            lastActivity: "1 year 2 months and 3 days ago",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(
      screen.getByText(
        "This is a very long mentor name that might overflow the table"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Very Long Project Name That Exceeds Normal Length")
    ).toBeInTheDocument();
  });

  it("should handle special characters in names and projects", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 1,
          projects: 1,
          totalWorkingHours: 40,
          averageWorkingHours: 20,
        },
        recentlyActiveMentees: [
          {
            initials: "JD",
            name: "José García-López",
            project: "AI/ML Platform (v2.0)",
            lastActivity: "2 hours ago",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("José García-López")).toBeInTheDocument();
    expect(screen.getByText("AI/ML Platform (v2.0)")).toBeInTheDocument();
  });

  it("should display all accepted mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 3,
          projects: 2,
          totalWorkingHours: 60,
          averageWorkingHours: 20,
        },
        recentlyActiveMentees: [
          {
            initials: "JD",
            name: "John Doe",
            project: "Project A",
            lastActivity: "1 hour ago",
            status: "ACCEPTED" as const,
          },
          {
            initials: "SM",
            name: "Sarah Miller",
            project: "Project B",
            lastActivity: "2 hours ago",
            status: "ACCEPTED" as const,
          },
          {
            initials: "AB",
            name: "Aditya Bansal",
            project: "Project C",
            lastActivity: "3 hours ago",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const acceptedBadges = screen.getAllByText("ACCEPTED");
    expect(acceptedBadges.length).toBe(3);
  });

  it("should display all pending mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 2,
          projects: 2,
          totalWorkingHours: 30,
          averageWorkingHours: 15,
        },
        recentlyActiveMentees: [
          {
            initials: "MT",
            name: "Mike Taylor",
            project: "Project X",
            lastActivity: "30 mins ago",
            status: "PENDING" as const,
          },
          {
            initials: "LJ",
            name: "Lucy Jones",
            project: "Project Y",
            lastActivity: "1 hour ago",
            status: "PENDING" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const pendingBadges = screen.getAllByText("PENDING");
    expect(pendingBadges.length).toBe(2);
  });

  it("should handle mixed status mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 5,
          projects: 3,
          totalWorkingHours: 100,
          averageWorkingHours: 20,
        },
        recentlyActiveMentees: [
          {
            initials: "JD",
            name: "John Doe",
            project: "Project A",
            lastActivity: "1 hour ago",
            status: "ACCEPTED" as const,
          },
          {
            initials: "SM",
            name: "Sarah Miller",
            project: "Project B",
            lastActivity: "2 hours ago",
            status: "PENDING" as const,
          },
          {
            initials: "AB",
            name: "Aditya Bansal",
            project: "Project C",
            lastActivity: "3 hours ago",
            status: "REJECTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("ACCEPTED")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("REJECTED")).toBeInTheDocument();
  });

  it("should handle null data gracefully", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("Mentor Portal")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
  });

  it("should handle error with custom message", () => {
    const customError = "Database connection failed";
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(customError),
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText(customError)).toBeInTheDocument();
  });

  it("should handle consecutive loading and success states", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { rerender } = render(<MentorDashboardPage />);

    let skeletonLoaders = document.querySelectorAll(".animate-pulse");
    expect(skeletonLoaders.length).toBeGreaterThan(0);

    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 5,
          projects: 2,
          totalWorkingHours: 60,
          averageWorkingHours: 12,
        },
        recentlyActiveMentees: [
          {
            initials: "TM",
            name: "Test Mentee",
            project: "Test Project",
            lastActivity: "just now",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    rerender(<MentorDashboardPage />);

    expect(screen.getByText("Test Mentee")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should handle very large working hours values", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 10,
          projects: 5,
          totalWorkingHours: 9999,
          averageWorkingHours: 999,
        },
        recentlyActiveMentees: [],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("9999h")).toBeInTheDocument();
    expect(screen.getByText("999h")).toBeInTheDocument();
  });

  it("should maintain correct layout with various data sizes", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 42,
          projects: 8,
          totalWorkingHours: 420,
          averageWorkingHours: 35,
        },
        recentlyActiveMentees: [
          {
            initials: "CS",
            name: "Chris Smith",
            project: "DevOps Platform",
            lastActivity: "15 mins ago",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    const { container } = render(<MentorDashboardPage />);

    const statsGrid = container.querySelector(".grid.grid-cols-1");
    expect(statsGrid).toBeInTheDocument();

    const mainContent = container.querySelector(".flex-1");
    expect(mainContent).toBeInTheDocument();
  });

  it("should display dashboard with minimal valid data", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 1,
          projects: 1,
          totalWorkingHours: 1,
          averageWorkingHours: 1,
        },
        recentlyActiveMentees: [
          {
            initials: "AB",
            name: "A B",
            project: "P",
            lastActivity: "now",
            status: "ACCEPTED" as const,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("A B")).toBeInTheDocument();
    expect(screen.getByText("P")).toBeInTheDocument();
  });

  it("should not display error when error is null", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: {
          totalMentees: 5,
          projects: 2,
          totalWorkingHours: 50,
          averageWorkingHours: 10,
        },
        recentlyActiveMentees: [],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(
      screen.queryByDisplayValue(/failed|error/i)
    ).not.toBeInTheDocument();
  });

  it("should handle rapid data changes", () => {
    const dataSet1 = {
      stats: {
        totalMentees: 5,
        projects: 2,
        totalWorkingHours: 50,
        averageWorkingHours: 10,
      },
      recentlyActiveMentees: [
        {
          initials: "JD",
          name: "John Doe",
          project: "Project A",
          lastActivity: "1 hour ago",
          status: "ACCEPTED" as const,
        },
      ],
    };

    const dataSet2 = {
      stats: {
        totalMentees: 8,
        projects: 3,
        totalWorkingHours: 80,
        averageWorkingHours: 13,
      },
      recentlyActiveMentees: [
        {
          initials: "SM",
          name: "Sarah Miller",
          project: "Project B",
          lastActivity: "30 mins ago",
          status: "PENDING" as const,
        },
      ],
    };

    mockUseMentorDashboard.mockReturnValue({
      data: dataSet1,
      isLoading: false,
      error: null,
    });

    const { rerender } = render(<MentorDashboardPage />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    mockUseMentorDashboard.mockReturnValue({
      data: dataSet2,
      isLoading: false,
      error: null,
    });

    rerender(<MentorDashboardPage />);
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});
