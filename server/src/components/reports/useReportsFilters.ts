"use client";

import { useMemo, useState } from "react";

import { formatInputDate, ITEMS_PER_PAGE, type ReportRow } from "./types";

// Manages all filter state
export function useReportsFilters(tableRows: ReportRow[]) {
  const [page, setPage] = useState(1);
  const [projectFilter, setProjectFilter] = useState("all");
  const [mentorFilter, setMentorFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Unique, sorted options for the project
  const projectOptions = useMemo(
    () =>
      Array.from(new Set(tableRows.map((r) => r.projectName))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [tableRows],
  );
  const mentorOptions = useMemo(
    () =>
      Array.from(new Set(tableRows.map((r) => r.mentor))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [tableRows],
  );

  // Apply all active filters to produce the visible subset
  const filteredReports = useMemo(
    () =>
      tableRows.filter((row) => {
        const rowDate = formatInputDate(row.rawDate);
        return (
          (projectFilter === "all" || row.projectName === projectFilter) &&
          (mentorFilter === "all" || row.mentor === mentorFilter) &&
          (dateFrom.length === 0 || rowDate >= dateFrom) &&
          (dateTo.length === 0 || rowDate <= dateTo)
        );
      }),
    [dateFrom, dateTo, mentorFilter, projectFilter, tableRows],
  );

  // Pagination derived values
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
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

  const resetFilters = () => {
    setProjectFilter("all");
    setMentorFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return {
    // Filter state & setters
    projectFilter,
    mentorFilter,
    dateFrom,
    dateTo,
    setProjectFilter,
    setMentorFilter,
    setDateFrom,
    setDateTo,
    resetFilters,
    // Dropdown options
    projectOptions,
    mentorOptions,
    // Paginated data
    filteredReports,
    visibleReports,
    safePage,
    totalPages,
    startCount,
    endCount,
    setPage,
  };
}
