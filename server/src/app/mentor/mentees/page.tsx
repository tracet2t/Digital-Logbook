"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Circle, Eye, MoreVertical, Search, Star, Users, Zap } from "lucide-react";
import { FilterBar, PageHeader } from "@/components/admin";
import AdminPagination from "@/components/admin/AdminPagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    const router = useRouter();

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
    }, []);

    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return allRows;
        return allRows.filter(
            (row) =>
                row.name.toLowerCase().includes(q) ||
                row.projectName.toLowerCase().includes(q),
        );
    }, [allRows, search]);

    const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
    const visibleRows = filteredRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const viewProfile = (row: MenteeRow) => {
        router.push(
            `/mentor/mentees/profile-view?studentId=${encodeURIComponent(row.id)}&projectId=${encodeURIComponent(row.projectId)}`,
        );
    };

    return (
        <div className="p-4 md:p-8">
            {/* Page header — "Mentor Portal" only, no icon buttons */}
            <div className="-mx-4 -mt-4 mb-6 border-b border-[#e4e7ed] bg-white px-4 py-3 md:-mx-8 md:-mt-8 md:px-8">
                <p className="text-[22px] font-black tracking-tight text-[#0b1459]">
                    Mentor Portal
                </p>
            </div>

            <div className="mx-auto max-w-6xl space-y-5">
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

                {/* Mentee identity table — real DB rows, each in its own card */}
                <Card className="rounded-xl border-[#e4e7ed] bg-white overflow-hidden">
                    {/* Column header row */}
                    <div className="hidden grid-cols-12 gap-3 border-b border-[#e4e7ed] px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:grid md:px-5">
                        <p className="col-span-4">Mentee Identity (Project Based)</p>
                        <p className="col-span-2">Working Hours</p>
                        <p className="col-span-2 text-center">Active Badges</p>
                        <p className="col-span-2 text-center">Status</p>
                        <p className="col-span-2 pr-4 text-right">Actions</p>
                    </div>

                    {/* State rows */}
                    {isLoading && (
                        <div className="p-8 text-center text-sm text-slate-500">
                            Loading mentees…
                        </div>
                    )}
                    {!isLoading && fetchError && (
                        <div className="p-8 text-center text-sm text-red-500">
                            {fetchError}
                        </div>
                    )}
                    {!isLoading && !fetchError && visibleRows.length === 0 && (
                        <div className="p-8 text-center text-sm text-slate-500">
                            No mentees found for this selection.
                        </div>
                    )}

                    {/* Data rows */}
                    {!isLoading && !fetchError && (
                        <div className="divide-y divide-[#e4e7ed]">
                            {visibleRows.map((row) => (
                                <div
                                    key={`${row.id}-${row.projectId}`}
                                    className="grid grid-cols-12 items-center gap-3 px-4 py-4 transition-colors hover:bg-slate-50 md:px-5"
                                >
                                    {/* Identity */}
                                    <div className="col-span-10 flex items-center gap-3 md:col-span-4">
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

                                    {/* Working hours */}
                                    <div className="col-span-2 hidden flex-col items-start md:col-span-2 md:flex">
                                        <p className="text-xl font-extrabold text-[#0b1459]">
                                            {row.workingHours}h
                                        </p>
                                        <p className="text-[10px] font-bold uppercase text-slate-500">
                                            Total
                                        </p>
                                    </div>

                                    {/* Badges */}
                                    <div className="hidden items-center justify-center gap-1 md:col-span-2 md:flex">
                                        <BadgeIcon count={row.badgeCount} />
                                        {row.badgeCount > 0 && (
                                            <span className="text-xs font-bold text-[#0b1459]">
                                                {row.badgeCount}
                                            </span>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="hidden items-center justify-center md:col-span-2 md:flex">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${row.isActive
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-200 text-slate-600"
                                                }`}
                                        >
                                            {row.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>

                                    {/* Actions — View Profile only */}
                                    <div className="col-span-2 flex items-center justify-end pr-0 md:col-span-2 md:pr-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    type="button"
                                                    aria-label={`Actions for ${row.name}`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-44">
                                                <DropdownMenuItem
                                                    onClick={() => viewProfile(row)}
                                                    className="cursor-pointer gap-2"
                                                >
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                    View Profile
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

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
    );
}
