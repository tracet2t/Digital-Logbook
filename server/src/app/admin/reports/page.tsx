"use client";

import { useState } from "react";
import AsideSidebar from "@/components/AsideSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FileText, Clock, CheckCircle, Settings2 } from "lucide-react";

type ReportStatus = "completed" | "pending" | "failed" | "wip";

interface Report {
  projectName: string;
  mentor: string;
  studentsCount: number;
  status: ReportStatus;
  date: string;
}

const MOCK_REPORTS: Report[] = [
  {
    projectName: "Alpha Initiative",
    mentor: "Dr. Aris Thorne",
    studentsCount: 24,
    status: "completed",
    date: "Oct 24, 2023",
  },
  {
    projectName: "Beta Growth Phase",
    mentor: "Sarah Jenkins",
    studentsCount: 18,
    status: "pending",
    date: "Oct 25, 2023",
  },
  {
    projectName: "Quantum Leap",
    mentor: "Marcus Vane",
    studentsCount: 42,
    status: "completed",
    date: "Oct 22, 2023",
  },
  {
    projectName: "Eco-Sustain Project",
    mentor: "Elena Rossi",
    studentsCount: 12,
    status: "failed",
    date: "Oct 21, 2023",
  },
];

const statusBadge: Record<
  ReportStatus,
  { variant: "completed" | "pending" | "failed" | "wip"; label: string }
> = {
  completed: { variant: "completed", label: "Completed" },
  pending: { variant: "pending", label: "Pending" },
  failed: { variant: "failed", label: "Failed" },
  wip: { variant: "wip", label: "In Progress" },
};

export default function ReportsPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-[#f1f1f9]">
      <AsideSidebar />

      <div className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Reports</h1>
          <Button className="bg-[#0A0A0A] text-white hover:bg-[#333]">
            Generate Report
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Total Generated</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">1,284</p>
            </div>
            <FileText className="text-[#737373]" size={28} />
          </Card>
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Pending Reports</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">42</p>
            </div>
            <Clock className="text-yellow-500" size={28} />
          </Card>
          <Card className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-[#737373]">Completed Reports</p>
              <p className="text-3xl font-bold text-[#0A0A0A]">1,242</p>
            </div>
            <CheckCircle className="text-green-500" size={28} />
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                Project
              </label>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="alpha">Alpha Initiative</SelectItem>
                  <SelectItem value="beta">Beta Growth Phase</SelectItem>
                  <SelectItem value="quantum">Quantum Leap</SelectItem>
                  <SelectItem value="eco">Eco-Sustain Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                Mentor
              </label>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Select Mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aris">Dr. Aris Thorne</SelectItem>
                  <SelectItem value="sarah">Sarah Jenkins</SelectItem>
                  <SelectItem value="marcus">Marcus Vane</SelectItem>
                  <SelectItem value="elena">Elena Rossi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#737373] font-semibold uppercase tracking-wide">
                Date Range
              </label>
              <input
                type="date"
                className="border border-[#E5E5E5] rounded-md px-3 py-2 text-sm text-[#0A0A0A] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              />
            </div>
            <Button
              variant="ghost"
              className="text-[#737373] hover:text-[#0A0A0A]"
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card>
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
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold uppercase text-[#737373]">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REPORTS.map((report) => (
                <TableRow  className="hover:bg-[#F5F5F5]">
                  <TableCell>
                    <div className="font-semibold text-[#0A0A0A]">
                      {report.projectName}
                    </div>
                    <div className="text-xs text-[#737373]"></div>
                  </TableCell>
                  <TableCell className="text-[#0A0A0A]">
                    {report.mentor}
                  </TableCell>
                  <TableCell className="text-[#0A0A0A]">
                    {report.studentsCount}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadge[report.status].variant}>
                      {statusBadge[report.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#737373]">
                    {report.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#737373]">
              Showing 1 to 4 of 1,284 entries
            </p>
            <Pagination className="w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                {[1, 2, 3].map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Card>
      </div>
    </div>
  );
}
