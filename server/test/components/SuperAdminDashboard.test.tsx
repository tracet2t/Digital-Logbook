import React from "react";

import { useAdminDashboard } from "@/_hooks/admin/useAdminDashboard";
import { renderToStaticMarkup } from "react-dom/server";

import { PageHeader } from "@/components/admin";
import RecentProjectsTable from "@/components/admin-dashboard/RecentProjectsTable";
import StatsGrid from "@/components/admin-dashboard/StatsGrid";
import SuperAdminDashboard from "@/components/admin-dashboard/SuperAdminDashboard";

jest.mock("lucide-react", () => {
  const icon = ({ className }: { className?: string }) => (
    <svg data-testid="icon" className={className} />
  );

  return {
    Activity: icon,
    Briefcase: icon,
    GraduationCap: icon,
    Mail: icon,
    UserCheck: icon,
    Users: icon,
  };
});

jest.mock("@/hooks/admin/useAdminDashboard", () => ({
  useAdminDashboard: jest.fn(),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogClose: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <footer>{children}</footer>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <header>{children}</header>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

jest.mock("@/components/admin", () => ({
  AdminPageLayout: ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  ),
  PageHeader: jest.fn(
    ({ title, subtitle }: { title: string; subtitle: string }) => (
      <header>{`${title} ${subtitle}`}</header>
    ),
  ),
}));

jest.mock("@/components/admin-dashboard/StatsGrid", () => ({
  __esModule: true,
  default: jest.fn(() => <div>StatsGrid</div>),
}));

jest.mock("@/components/admin-dashboard/RecentProjectsTable", () => ({
  __esModule: true,
  default: jest.fn(() => <div>RecentProjectsTable</div>),
}));

describe("SuperAdminDashboard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useAdminDashboard as jest.Mock).mockReturnValue({
      stats: {},
      recentProjects: [],
      isLoading: true,
      error: null,
    });

    const html = renderToStaticMarkup(<SuperAdminDashboard />);

    expect(html).toContain("Loading Super Admin dashboard...");
    expect(html).not.toContain("StatsGrid");
    expect(html).not.toContain("RecentProjectsTable");
  });

  it("renders error state", () => {
    (useAdminDashboard as jest.Mock).mockReturnValue({
      stats: {},
      recentProjects: [],
      isLoading: false,
      error: "Unable to load dashboard",
    });

    const html = renderToStaticMarkup(<SuperAdminDashboard />);

    expect(html).toContain("Unable to load dashboard");
    expect(html).not.toContain("StatsGrid");
    expect(html).not.toContain("RecentProjectsTable");
  });

  it("renders dashboard data and passes expected props", () => {
    const recentProjects = [
      {
        projectName: "Digital Logbook",
        domain: "Web",
        dateCreated: "Mar 24, 2026",
        status: "In Progress",
      },
    ];

    (useAdminDashboard as jest.Mock).mockReturnValue({
      stats: {
        totalUsers: 120,
        students: 75,
        mentors: 30,
        totalProjects: 24,
        pendingInvites: 8,
        activeProjects: 11,
      },
      recentProjects,
      isLoading: false,
      error: null,
    });

    const html = renderToStaticMarkup(<SuperAdminDashboard userName="Alex" />);

    expect(html).toContain("StatsGrid");
    expect(html).toContain("RecentProjectsTable");

    expect(PageHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Admin Super Dashboard",
        subtitle: "Welcome back, Alex! Here’s your latest platform summary.",
      }),
      {},
    );

    const statsGridProps = (StatsGrid as jest.Mock).mock.calls[0][0];
    expect(statsGridProps.stats).toHaveLength(6);
    expect(statsGridProps.stats[0]).toEqual(
      expect.objectContaining({ label: "Total Users", value: 120 }),
    );
    expect(statsGridProps.stats[5]).toEqual(
      expect.objectContaining({ label: "Active Projects", value: 11 }),
    );

    expect(RecentProjectsTable).toHaveBeenCalledWith(
      expect.objectContaining({ projects: recentProjects }),
      {},
    );
  });
});
