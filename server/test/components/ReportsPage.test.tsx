import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ReportsTable } from "@/components/reports/ReportsTable";

jest.mock("lucide-react", () => {
  const icon = ({ className }: { className?: string }) => (
    <svg data-testid="icon" className={className} />
  );

  return {
    BarChart2: icon,
    BookOpen: icon,
    Briefcase: icon,
    Cpu: icon,
    FolderOpen: icon,
    GraduationCap: icon,
    Layers: icon,
    Monitor: icon,
    Palette: icon,
    Users: icon,
  };
});

jest.mock("@/components/ui/table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
  TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
  TableHead: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
  TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
}));

jest.mock("@/components/admin/TableStateRows", () => ({
  __esModule: true,
  default: ({
    loading,
    error,
    empty,
    loadingMessage,
    emptyMessage,
  }: {
    loading: boolean;
    error: string | null;
    empty: boolean;
    loadingMessage: string;
    emptyMessage: string;
  }) => {
    if (loading) {
      return (
        <tr>
          <td>{loadingMessage}</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td>{error}</td>
        </tr>
      );
    }

    if (empty) {
      return (
        <tr>
          <td>{emptyMessage}</td>
        </tr>
      );
    }

    return null;
  },
}));

describe("ReportsTable component", () => {
  const reports = [
    {
      id: "rep-1",
      projectName: "Digital Logbook App",
      mentor: "Jane Mentor",
      studentsCount: 4,
      date: "Mar 24, 2026",
      rawDate: "2026-03-24",
    },
    {
      id: "rep-2",
      projectName: "UI Design Portal",
      mentor: "John Coach",
      studentsCount: 7,
      date: "Mar 20, 2026",
      rawDate: "2026-03-20",
    },
  ];

  it("renders report rows when data is available", () => {
    const html = renderToStaticMarkup(
      <ReportsTable isLoading={false} fetchError={null} visibleReports={reports} />,
    );

    expect(html).toContain("Digital Logbook App");
    expect(html).toContain("Jane Mentor");
    expect(html).toContain("4");
    expect(html).toContain("Mar 24, 2026");

    expect(html).toContain("UI Design Portal");
    expect(html).toContain("John Coach");
    expect(html).toContain("7");
    expect(html).toContain("Mar 20, 2026");
  });

  it("shows loading state", () => {
    const html = renderToStaticMarkup(
      <ReportsTable isLoading={true} fetchError={null} visibleReports={[]} />,
    );

    expect(html).toContain("Loading reports...");
    expect(html).not.toContain("Digital Logbook App");
  });

  it("shows error state", () => {
    const html = renderToStaticMarkup(
      <ReportsTable
        isLoading={false}
        fetchError="Unable to fetch reports"
        visibleReports={[]}
      />,
    );

    expect(html).toContain("Unable to fetch reports");
    expect(html).not.toContain("No reports found for the selected filters.");
  });

  it("shows empty state when there are no reports", () => {
    const html = renderToStaticMarkup(
      <ReportsTable isLoading={false} fetchError={null} visibleReports={[]} />,
    );

    expect(html).toContain("No reports found for the selected filters.");
  });
});
