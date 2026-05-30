"use client";

import { useCallback, useEffect, useState } from "react";

import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AdminPageLayout,
  AdminPagination,
  PageHeader,
} from "@/components/admin";
import { ReportsFilters } from "@/components/reports/ReportsFilters";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { ITEMS_PER_PAGE } from "@/components/reports/types";
import { useGeneratePDF } from "@/components/reports/useGeneratePDF";
import { useReportsData } from "@/components/reports/useReportsData";
import { useReportsFilters } from "@/components/reports/useReportsFilters";

export default function ReportsPage() {
  // Fetch raw report rows from the API
  const { tableRows, isLoading, fetchError } = useReportsData();

  // Show total based on the rows used to populate the table so the header
  // always matches the displayed projects/mentors list.
  const reportCount = tableRows.length;

  // Manage filter state and derive paginated/filtered data
  const {
    projectFilter,
    mentorFilter,
    dateFrom,
    dateTo,
    setProjectFilter,
    setMentorFilter,
    setDateFrom,
    setDateTo,
    projectOptions,
    mentorOptions,
    resetFilters,
    filteredReports,
    visibleReports,
    safePage,
    totalPages,
    setPage,
  } = useReportsFilters(tableRows);

  // PDF export using the currently filtered rows
  const { isExporting, generatePDF } = useGeneratePDF(
    filteredReports,
    dateFrom,
    dateTo,
  );

  return (
    <AdminPageLayout className="bg-[#f1f1f9]">
      <div className="flex-1 p-8">
        <Card className="p-6 space-y-6">
          {/* Header and report total */}
          <Card className="p-6 space-y-4">
            <PageHeader
              title="Reports"
              action={
                <Button
                  className="bg-[#000053] text-white hover:bg-[#000053]"
                  disabled={isExporting || isLoading}
                  onClick={generatePDF}
                >
                  {isExporting ? "Generating..." : "Generate Report"}
                </Button>
              }
            />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E5E5] bg-[#fafafa] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#737373]">
                  Total Generated Reports
                </p>
                <p className="text-2xl font-bold text-[#0A0A0A]">
                  {reportCount}
                </p>
              </div>
              <FileText className="text-[#737373]" size={28} />
            </div>
          </Card>

          {/* Filters */}
          <ReportsFilters
            projectFilter={projectFilter}
            mentorFilter={mentorFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            projectOptions={projectOptions}
            mentorOptions={mentorOptions}
            onProjectChange={(v) => {
              setProjectFilter(v);
              setPage(1);
            }}
            onMentorChange={(v) => {
              setMentorFilter(v);
              setPage(1);
            }}
            onDateFromChange={(v) => {
              setDateFrom(v);
              setPage(1);
            }}
            onDateToChange={(v) => {
              setDateTo(v);
              setPage(1);
            }}
            onReset={resetFilters}
          />

          {/* Table and pagination */}
          <Card className="overflow-hidden">
            <ReportsTable
              isLoading={isLoading}
              fetchError={fetchError}
              visibleReports={visibleReports}
            />
            <AdminPagination
              page={safePage}
              totalPages={totalPages}
              total={filteredReports.length}
              itemsPerPage={ITEMS_PER_PAGE}
              itemLabel="entries"
              onPageChange={setPage}
            />
          </Card>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
