"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AsideSidebar from "@/components/AsideSidebar";
import { ReportsFilters } from "@/components/reports/ReportsFilters";
import { ReportsPagination } from "@/components/reports/ReportsPagination";
import { ReportsStatCards } from "@/components/reports/ReportsStatCards";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { useGeneratePDF } from "@/components/reports/useGeneratePDF";
import { useReportsData } from "@/components/reports/useReportsData";
import { useReportsFilters } from "@/components/reports/useReportsFilters";

export default function ReportsPage() {
  // Fetch raw report rows from the API
  const { tableRows, isLoading, fetchError } = useReportsData();

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
    startCount,
    endCount,
    setPage,
  } = useReportsFilters(tableRows);

  // PDF export using the currently filtered rows
  const { isExporting, generatePDF } = useGeneratePDF(
    filteredReports,
    dateFrom,
    dateTo,
  );

  return (
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />
      <div className="flex-1 p-8">
        <Card className="p-6 space-y-6">
          {/* Header + stat summary */}
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
            <ReportsStatCards
              totalGenerated={tableRows.length}
              pendingReports={0}
              completedReports={tableRows.length}
            />
          </Card>

          {/* Filters */}
          <Card className="p-4 bg-[#f8fafc] border-[#e4e7ed]">
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
          </Card>

          {/* Table and pagination */}
          <Card className="overflow-hidden">
            <ReportsTable
              isLoading={isLoading}
              fetchError={fetchError}
              visibleReports={visibleReports}
            />
            <ReportsPagination
              startCount={startCount}
              endCount={endCount}
              totalCount={filteredReports.length}
              safePage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </Card>
        </Card>
      </div>
    </div>
  );
}
