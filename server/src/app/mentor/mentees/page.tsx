"use client";

import { Suspense, useEffect, useMemo, useState } from "react";

import {
  Archive,
  Award,
  Circle,
  Clock3,
  Star,
  Timer,
  Users,
  Zap,
} from "lucide-react";

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
import { GenericCombobox } from "@/components/mentor/combobox";
import { MenteeAvatar } from "@/components/mentor/MenteeAvatar";
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
  const [selectedProject, setSelectedProject] = useState<string>("all");
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

  // Get unique project names for dropdown
  const projectOptions = useMemo(() => {
    const set = new Set<string>();
    allRows.forEach((row) => set.add(row.projectName));
    return Array.from(set);
  }, [allRows]);

  const projectFilterOptions = useMemo(
    () => ["All Projects", ...projectOptions],
    [projectOptions],
  );

  const selectedProjectOption =
    selectedProject === "all" ? "All Projects" : selectedProject;

  const filteredRows = useMemo(() => {
    let rows = allRows;
    if (selectedProject && selectedProject !== "all") {
      rows = rows.filter((row) => row.projectName === selectedProject);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((row) => row.name.toLowerCase().includes(q));
    }
    return rows;
  }, [allRows, selectedProject, search]);

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
          {/* Mentees heading */}
          <Card className="mb-6 space-y-6 p-6">
            <PageHeader title="Mentee Section" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
                <div>
                  <p className="text-sm text-[#737373]">Archive Total</p>
                  <p className="text-3xl font-bold text-[#0A0A0A]">
                    {summary.archiveTotal}
                  </p>
                </div>
                <Archive className="text-[#737373]" size={28} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
                <div>
                  <p className="text-sm text-[#737373]">Active Mentees</p>
                  <p className="text-3xl font-bold text-[#0A0A0A]">
                    {String(summary.activeProjects).padStart(2, "0")}
                  </p>
                </div>
                <Users className="text-[#737373]" size={28} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
                <div>
                  <p className="text-sm text-[#737373]">Avg. Completion</p>
                  <p className="text-3xl font-bold text-[#0A0A0A]">
                    {summary.avgCompletionHours}h
                  </p>
                </div>
                <Timer className="text-[#737373]" size={28} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#fafafa] p-5">
                <div>
                  <p className="text-sm text-[#737373]">Pending Reviews</p>
                  <p className="text-3xl font-bold text-[#0A0A0A]">
                    {String(summary.pendingReviews).padStart(2, "0")}
                  </p>
                </div>
                <Clock3 className="text-yellow-500" size={28} />
              </div>
            </div>
          </Card>
          <div className="w-full space-y-5">
            {/* Title */}
            {/* Project dropdown filter */}
            <Card className="rounded-xl border-[#e4e7ed] bg-white px-4 py-3 md:px-5">
              <FilterBar>
                <FilterBar.Field label="Project">
                  <GenericCombobox
                    items={projectFilterOptions}
                    value={selectedProjectOption}
                    onValueChange={(project) => {
                      setSelectedProject(
                        project === "All Projects" ? "all" : project,
                      );
                      setPage(1);
                    }}
                    placeholder="Select project"
                    className="w-full md:w-[240px]"
                    itemToStringValue={(project) => project}
                    renderItem={(project) => (
                      <div className="px-2 py-1 text-sm">{project}</div>
                    )}
                  />
                </FilterBar.Field>
                <FilterBar.Search
                  value={search}
                  onChange={(value) => {
                    setSearch(value);
                    setPage(1);
                  }}
                  placeholder="Search by name..."
                />
              </FilterBar>
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
                            <MenteeAvatar
                              studentId={row.id}
                              name={row.name}
                              initials={getInitials(row.name)}
                            />
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
            isOpen={true}
            onClose={() => setSelectedDialogRow(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
