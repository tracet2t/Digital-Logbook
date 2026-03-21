"use client";

import { useEffect, useMemo, useState } from "react";

import { CheckCircle, Clock, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AsideSidebar from "@/components/AsideSidebar";

interface ReportRow {
  id: string;
  projectName: string;
  mentor: string;
  studentsCount: number;
  date: string;
  rawDate: string;
}

const ITEMS_PER_PAGE = 5;

function formatDisplayDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatInputDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [projectFilter, setProjectFilter] = useState("all");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tableRows, setTableRows] = useState<ReportRow[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const tableResponse = await fetch("/api/admin/reports", {
          cache: "no-store",
        });

        if (!tableResponse.ok) {
          const payload = await tableResponse
            .json()
            .catch(() => ({ message: "Failed to fetch project data" }));
          throw new Error(payload.message ?? "Failed to fetch project data");
        }

        const tableData = (await tableResponse.json()) as ReportRow[];

        if (!mounted) {
          return;
        }

        setTableRows(
          Array.isArray(tableData)
            ? tableData.map((row) => ({
                ...row,
                date: formatDisplayDate(row.rawDate),
              }))
            : [],
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        setTableRows([]);
        setFetchError(
          error instanceof Error
            ? error.message
            : "Failed to fetch project data",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const projectOptions = useMemo(() => {
    return Array.from(new Set(tableRows.map((row) => row.projectName))).sort(
      (left, right) => left.localeCompare(right),
    );
  }, [tableRows]);

  const mentorOptions = useMemo(() => {
    return Array.from(new Set(tableRows.map((row) => row.mentor))).sort(
      (left, right) => left.localeCompare(right),
    );
  }, [tableRows]);

  const filteredReports = useMemo(() => {
    return tableRows.filter((row) => {
      const matchesProject =
        projectFilter === "all" || row.projectName === projectFilter;
      const matchesMentor =
        mentorFilter === "all" || row.mentor === mentorFilter;

      const rowDate = formatInputDate(row.rawDate);
      const matchesFrom = dateFrom.length === 0 || rowDate >= dateFrom;
      const matchesTo = dateTo.length === 0 || rowDate <= dateTo;

      return matchesProject && matchesMentor && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, mentorFilter, projectFilter, tableRows]);

  const totalGenerated = tableRows.length;
  const pendingReports = 0;
  const completedReports = tableRows.length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter((pageNumber) => Math.abs(pageNumber - safePage) <= 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  const startCount = filteredReports.length === 0 ? 0 : startIndex + 1;
  const endCount = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredReports.length,
  );

  const [isExporting, setIsExporting] = useState(false);

  const resetFilters = () => {
    setProjectFilter("all");
    setMentorFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      let y = 50;

      // Header banner
      doc.setFillColor(6, 78, 124);
      doc.rect(0, 0, 595, 110, "F");
      doc.setFillColor(12, 112, 162);
      doc.rect(0, 70, 595, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LOGBOOK MENTORSHIP OS", margin, 36);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Project Reports", margin, 58);
      doc.setFontSize(9);
      doc.text(`Generated at: ${new Date().toLocaleString()}`, margin, 74);
      doc.text("Project Name · Mentor · Students Count · Date", margin, 88);
      doc.setTextColor(0, 0, 0);

      y = 128;
      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 16;

      // Summary row
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total rows exported: ${filteredReports.length}`, margin, y);
      if (dateFrom || dateTo) {
        const range = [
          dateFrom && `From: ${dateFrom}`,
          dateTo && `To: ${dateTo}`,
        ]
          .filter(Boolean)
          .join("   ");
        doc.text(range, margin + 200, y);
      }
      y += 20;

      // Table header
      const colX = {
        project: margin,
        mentor: margin + 180,
        students: margin + 360,
        date: margin + 440,
      };
      doc.setFillColor(247, 248, 250);
      doc.rect(margin, y - 10, 515, 18, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(55, 65, 81);
      doc.text("PROJECT NAME", colX.project + 3, y);
      doc.text("MENTOR", colX.mentor, y);
      doc.text("STUDENTS", colX.students, y);
      doc.text("DATE", colX.date, y);
      y += 14;

      doc.setDrawColor(220);
      doc.line(margin, y, 555, y);
      y += 6;

      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      let rowIndex = 0;
      for (const row of filteredReports) {
        if (y > 760) {
          doc.addPage();
          y = 50;
        }
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(margin, y - 9, 515, 14, "F");
        }
        doc.setTextColor(15, 23, 42);
        // Truncate long project/mentor names to avoid overflow
        const projectText =
          row.projectName.length > 28
            ? row.projectName.slice(0, 25) + "..."
            : row.projectName;
        const mentorText =
          row.mentor.length > 20 ? row.mentor.slice(0, 17) + "..." : row.mentor;
        doc.text(projectText, colX.project + 3, y);
        doc.text(mentorText, colX.mentor, y);
        doc.text(String(row.studentsCount), colX.students + 20, y);
        doc.text(row.date, colX.date, y);
        y += 14;
        rowIndex++;
      }

      doc.save(`project-reports-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF generation error", err);
      alert("Unable to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />

      <div className="flex-1 p-8 space-y-6">
        {/* Header + Stat Cards */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-page-title text-[#0A0A0A]">Reports</h1>
            <Button
              className="bg-[#0A0A0A] text-white hover:bg-[#333]"
              disabled={isExporting || isLoading}
              onClick={generatePDF}
            >
              {isExporting ? "Generating..." : "Generate Report"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Total Generated</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {totalGenerated}
                </p>
              </div>
              <FileText className="text-[#737373]" size={28} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Pending Reports</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {pendingReports}
                </p>
              </div>
              <Clock className="text-yellow-500" size={28} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
              <div>
                <p className="text-sm text-[#737373]">Completed Reports</p>
                <p className="text-3xl font-bold text-[#0A0A0A]">
                  {completedReports}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={28} />
            </div>
          </div>
        </Card>

        {/* Filters + Table */}
        <Card className="overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-[#E5E5E5]">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                  Project
                </label>
                <Select
                  value={projectFilter}
                  onValueChange={(value) => {
                    setProjectFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projectOptions.map((project) => (
                      <SelectItem key={project} value={project}>
                        {project}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                  Mentor
                </label>
                <Select
                  value={mentorFilter}
                  onValueChange={(value) => {
                    setMentorFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select Mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mentors</SelectItem>
                    {mentorOptions.map((mentor) => (
                      <SelectItem key={mentor} value={mentor}>
                        {mentor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                  From
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => {
                    setDateFrom(event.target.value);
                    setPage(1);
                  }}
                  className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                  To
                </label>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => {
                    setDateTo(event.target.value);
                    setPage(1);
                  }}
                  className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
              <Button
                variant="ghost"
                className="text-[#737373] hover:text-[#0A0A0A]"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5]">
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Project Name
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Mentor
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Students Count
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-[#737373]"
                  >
                    Loading reports...
                  </TableCell>
                </TableRow>
              ) : fetchError ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-red-500"
                  >
                    {fetchError}
                  </TableCell>
                </TableRow>
              ) : visibleReports.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-[#737373]"
                  >
                    No reports found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                visibleReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-[#F5F5F5]">
                    <TableCell>
                      <div className="font-semibold text-[#0A0A0A]">
                        {report.projectName}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#0A0A0A]">
                      {report.mentor}
                    </TableCell>
                    <TableCell className="text-[#0A0A0A]">
                      {report.studentsCount}
                    </TableCell>
                    <TableCell className="text-[#737373]">
                      {report.date}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#737373]">
              Showing {startCount} to {endCount} of {filteredReports.length}{" "}
              entries
            </p>
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setPage((currentPage) => Math.max(1, currentPage - 1))
                    }
                  />
                </PaginationItem>
                {safePage > 2 ? (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        isActive={safePage === 1}
                        onClick={() => setPage(1)}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {safePage > 3 ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                  </>
                ) : null}
                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={safePage === pageNumber}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {safePage < totalPages - 1 ? (
                  <>
                    {safePage < totalPages - 2 ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                    <PaginationItem>
                      <PaginationLink
                        isActive={safePage === totalPages}
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                ) : null}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setPage((currentPage) =>
                        Math.min(totalPages, currentPage + 1),
                      )
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
}
