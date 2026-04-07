"use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import { Award, Circle, Search, Star, Users, Zap } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterBar, PageHeader } from "@/components/admin";
import AdminPagination from "@/components/admin/AdminPagination";
import MenteeProfileView from "@/components/mentor/MenteeProfileView";

type MenteeRow = {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  workingHours: number;
  badgeCount: number;
  isActive: boolean;
};

type Summary = {
  archiveTotal: number;
  activeProjects: number;
  avgCompletionHours: number;
  pendingReviews: number;
};

type ApiResponse = {
  summary: Summary;
  rows: MenteeRow[];
  total: number;
};

const ITEMS_PER_PAGE = 4;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function BadgeIcon({ count }: { count: number }) {
  if (count === 0) return <Circle className="h-4 w-4 text-slate-300" />;
  if (count >= 5) return <Award className="h-4 w-4 text-[#0a0f57]" />;
  if (count >= 3) return <Star className="h-4 w-4 text-[#0a0f57]" />;
  if (count >= 2) return <Users className="h-4 w-4 text-[#0a0f57]" />;
  return <Zap className="h-4 w-4 text-orange-500" />;
}

export default function MenteesPage() {
  const [allRows, setAllRows] = useState<MenteeRow[]>([]);
  const [summary, setSummary] = useState<Summary>({
    archiveTotal: 0,
    activeProjects: 0,
    avgCompletionHours: 0,
    pendingReviews: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedDialogRow, setSelectedDialogRow] = useState<MenteeRow | null>(
    null,
  );
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/mentor/mentees", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load mentees");
        const data = (await res.json()) as ApiResponse;
        if (!active) return;
        setAllRows(data.rows);
        setSummary(data.summary);
      } catch (error) {
        if (!active) return;
        setFetchError(
          error instanceof Error ? error.message : "Failed to load mentees",
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [refetchKey]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.projectName.toLowerCase().includes(q),
    );
  }, [allRows, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleRows = filteredRows.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="gap-5 flex flex-col bg-[#f1f1f9] min-h-screen">
      {/* Responsive parent container and card, similar to calendar page */}
      <div className="flex-grow flex flex-col w-full p-4">
        <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-lg w-full">
          {/* Mentor Portal heading */}
          <div className="mb-6 border-b border-[#e4e7ed] pb-3">
            <p className="text-[22px] font-black tracking-tight text-[#0b1459]">
              Mentor Portal
            </p>
          </div>
          <div className="w-full space-y-5">
            {/* Title */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Management Hub
              </p>
              <PageHeader title="All Mentees" subtitle={undefined} />
            </div>

            {/* Search filter */}
            <Card className="rounded-xl border-[#e4e7ed] bg-white px-4 py-3 md:px-5">
              <FilterBar>
                <FilterBar.Field label="Search">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search project based mentees..."
                      className="h-10 w-full rounded-lg border border-[#e3e7ee] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 sm:w-[360px] md:w-[420px]"
                    />
                  </div>
                </FilterBar.Field>
              </FilterBar>
            </Card>

            {/* Stats card — real DB values */}
            <Card className="rounded-xl border-[#e4e7ed] bg-white px-5 py-5">
              <div className="grid grid-cols-2 gap-y-5 divide-x-0 md:grid-cols-4 md:divide-x md:divide-[#e4e7ed]">
                <div className="px-0 md:px-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Archive Total
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-[#0b1459]">
                    {summary.archiveTotal}
                  </p>
                </div>
                <div className="pl-0 md:pl-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Active Mentees
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-[#0b1459]">
                    {String(summary.activeProjects).padStart(2, "0")}
                  </p>
                </div>
                <div className="pl-0 md:pl-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Avg. Completion
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-[#0b1459]">
                    {summary.avgCompletionHours}h
                  </p>
                </div>
                <div className="pl-0 md:pl-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Pending Reviews
                  </p>
                  <p className="mt-1 text-4xl font-extrabold text-[#e45a3a]">
                    {String(summary.pendingReviews).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </Card>

            {/* Mentee identity table — shadcn Table */}
            <Card className="rounded-xl border-[#e4e7ed] bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#e4e7ed] hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-3 px-5">
                      Mentee Identity (Project Based)
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-3">
                      Working Hours
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-3 text-center">
                      Active Badges
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-500 py-3 text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="p-8 text-center text-sm text-slate-500"
                      >
                        Loading mentees…
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && fetchError && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="p-8 text-center text-sm text-red-500"
                      >
                        {fetchError}
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && !fetchError && visibleRows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="p-8 text-center text-sm text-slate-500"
                      >
                        No mentees found for this selection.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    !fetchError &&
                    visibleRows.map((row) => (
                      <TableRow
                        key={`${row.id}-${row.projectId}`}
                        className="cursor-pointer hover:bg-slate-50 border-b border-[#e4e7ed]"
                        onClick={() => setSelectedDialogRow(row)}
                      >
                        {/* Identity */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0 border border-[#d9dde5] bg-[#f5f7fb]">
                              <AvatarFallback className="bg-[#e9edf5] text-xs font-bold text-[#0f1730]">
                                {getInitials(row.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate text-[17px] font-extrabold leading-tight text-[#111827]">
                                {row.name}
                              </p>
                              <p className="mt-0.5 truncate text-[11px] font-bold uppercase tracking-wide text-slate-500">
                                Project: {row.projectName}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Working hours */}
                        <TableCell className="py-4">
                          <p className="text-xl font-extrabold text-[#0b1459]">
                            {row.workingHours}h
                          </p>
                          <p className="text-[10px] font-bold uppercase text-slate-500">
                            Total
                          </p>
                        </TableCell>

                        {/* Badges */}
                        <TableCell className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <BadgeIcon count={row.badgeCount} />
                            {row.badgeCount > 0 && (
                              <span className="text-xs font-bold text-[#0b1459]">
                                {row.badgeCount}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${
                              row.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {row.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* AdminPagination inside the table card */}
              {!isLoading && !fetchError && (
                <AdminPagination
                  page={safePage}
                  totalPages={totalPages}
                  total={filteredRows.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  itemLabel="mentees"
                  onPageChange={(p) => setPage(p)}
                />
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Profile View Dialog */}
      {selectedDialogRow && (
        <Suspense>
          <MenteeProfileView
            key={`${selectedDialogRow.id}-${selectedDialogRow.projectId}`}
            initialStudentId={selectedDialogRow.id}
            initialProjectId={selectedDialogRow.projectId}
            onAllocationChange={() => setRefetchKey((k) => k + 1)}
            isOpen={selectedDialogRow !== null}
            onClose={() => setSelectedDialogRow(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
