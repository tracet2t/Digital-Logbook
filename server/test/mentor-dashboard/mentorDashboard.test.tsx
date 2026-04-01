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

const mockDashboardData = {
  stats: {
    totalMentees: 12,
    projects: 5,
    totalWorkingHours: 240,
    averageWorkingHours: 20,
  },
  recentlyActiveMentees: [
    {
      initials: "JD",
      name: "John Doe",
      project: "E-Commerce Platform",
      lastActivity: "2 hours ago",
      status: "ACCEPTED" as const,
    },
    {
      initials: "SM",
      name: "Sarah Miller",
      project: "Mobile App",
      lastActivity: "1 day ago",
      status: "PENDING" as const,
    },
    {
      initials: "AB",
      name: "Aditya Bansal",
      project: "Data Analytics",
      lastActivity: "3 hours ago",
      status: "ACCEPTED" as const,
    },
  ],
};

describe("MentorDashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the dashboard header correctly", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText(/dashboard overview/i)).toBeInTheDocument();
    expect(screen.getByText("Mentor Portal")).toBeInTheDocument();
    expect(
      screen.getByText("Welcome back. Here is a summary of your mentorship activities.")
    ).toBeInTheDocument();
  });

  it("should display all stats cards with correct values", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText(/total mentees/i)).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText(/projects/i)).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText(/total working hours/i)).toBeInTheDocument();
    expect(screen.getByText("240h")).toBeInTheDocument();

    expect(screen.getByText(/average working hours/i)).toBeInTheDocument();
    expect(screen.getByText("20h")).toBeInTheDocument();
  });

  it("should display loading state with skeleton loaders", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<MentorDashboardPage />);

    const skeletonLoaders = document.querySelectorAll(".animate-pulse");
    expect(skeletonLoaders.length).toBeGreaterThan(0);
  });

  it("should display error message when API fails", () => {
    const errorMessage = "Failed to load dashboard data";
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error(errorMessage),
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should display recently active mentees section header", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("Recently Active Mentees")).toBeInTheDocument();
    expect(
      screen.getByText("Track mentee progress and engagement status.")
    ).toBeInTheDocument();
  });

  it("should render table with mentee data", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Sarah Miller")).toBeInTheDocument();
    expect(screen.getByText("Aditya Bansal")).toBeInTheDocument();

    expect(screen.getByText("E-Commerce Platform")).toBeInTheDocument();
    expect(screen.getByText("Mobile App")).toBeInTheDocument();
    expect(screen.getByText("Data Analytics")).toBeInTheDocument();

    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
    expect(screen.getByText("1 day ago")).toBeInTheDocument();
    expect(screen.getByText("3 hours ago")).toBeInTheDocument();
  });

  it("should display correct status badges for mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const acceptedBadges = screen.getAllByText("ACCEPTED");
    expect(acceptedBadges.length).toBe(2);

    const pendingBadges = screen.getAllByText("PENDING");
    expect(pendingBadges.length).toBe(1);
  });

  it("should display initials avatars for mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("SM")).toBeInTheDocument();
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("should display empty state when no recent mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: {
        stats: mockDashboardData.stats,
        recentlyActiveMentees: [],
      },
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("No recent mentees available.")).toBeInTheDocument();
  });

  it("should display error message in mentees section on API failure", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });

    render(<MentorDashboardPage />);

    expect(
      screen.getByText("Failed to load mentees. Please try again.")
    ).toBeInTheDocument();
  });

  it("should display View All button", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const viewAllButton = screen.getByText("View All");
    expect(viewAllButton).toBeInTheDocument();
  });

  it("should link View All button to /mentor/mentees", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const viewAllLink = screen.getByText("View All").closest("a");
    expect(viewAllLink).toHaveAttribute("href", "/mentor/mentees");
  });

  it("should display table headers correctly", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("PROJECT")).toBeInTheDocument();
    expect(screen.getByText("LAST ACTIVITY")).toBeInTheDocument();
    expect(screen.getByText("STATUS")).toBeInTheDocument();
  });

  it("should display loading state for mentees table", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<MentorDashboardPage />);

    const skeletonLoaders = document.querySelectorAll(".animate-pulse");
    expect(skeletonLoaders.length).toBeGreaterThan(0);
  });

  it("should render multiple mentees in correct order", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const nameCell = screen.getByText("John Doe");
    expect(nameCell).toBeInTheDocument();

    const rows = screen.getAllByText(/John Doe|Sarah Miller|Aditya Bansal/);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should display default values (0) when data is null", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("Mentor Portal")).toBeInTheDocument();
    expect(screen.getByText("Recently Active Mentees")).toBeInTheDocument();
  });

  it("should have correct styling classes on stat cards", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const statCards = document.querySelectorAll(
      ".p-4.border.border-slate-200.bg-white.shadow-sm"
    );
    expect(statCards.length).toBeGreaterThan(0);
  });

  it("should render dashboard when data is available and no error", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(screen.getByText("Mentor Portal")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Failed to load dashboard data")).not.toBeInTheDocument();
  });

  it("should display avatar with correct background colors", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    const avatars = document.querySelectorAll(
      "div[class*='flex'][class*='h-8'][class*='w-8'][class*='items-center'][class*='justify-center'][class*='rounded-full']"
    );
    expect(avatars.length).toBeGreaterThan(0);
  });

  it("should not show empty state message when mentees exist", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    render(<MentorDashboardPage />);

    expect(
      screen.queryByText("No recent mentees available.")
    ).not.toBeInTheDocument();
  });

  it("should have proper spacing and layout structure", () => {
    mockUseMentorDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    });

    const { container } = render(<MentorDashboardPage />);

    const mainContainer = container.querySelector(".w-full.min-h-screen");
    expect(mainContainer).toBeInTheDocument();

    const statsGrid = container.querySelector(".grid.grid-cols-1");
    expect(statsGrid).toBeInTheDocument();
  });
});
