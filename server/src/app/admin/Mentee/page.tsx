// filepath: /home/nasrin/Downloads/Recode_book/Digital-Logbook/server/src/app/admin/Mentee/page.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Circle,
  MoreVertical,
  Search,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type BadgeIcon = "zap" | "star" | "award" | "users" | "circle";
type StatusType = "ACTIVE" | "INACTIVE";

type Mentee = {
  id: string;
  name: string;
  project: string;
  hours: number;
  status: StatusType;
  avatarUrl?: string;
  badges: BadgeIcon[];
};

const menteesData: Mentee[] = [
  {
    id: "1",
    name: "Elena Rodriguez",
    project: "INDIGO ARCHIVE REBRAND",
    hours: 124,
    status: "ACTIVE",
    badges: ["zap", "star"],
  },
  {
    id: "2",
    name: "Marcus Thorne",
    project: "SYSTEM MIGRATION",
    hours: 86,
    status: "ACTIVE",
    badges: ["award"],
  },
  {
    id: "3",
    name: "Sonia Vance",
    project: "DATA ETHICS AUDIT",
    hours: 12,
    status: "INACTIVE",
    badges: ["circle"],
  },
  {
    id: "4",
    name: "Liam Fletcher",
    project: "UI KIT EVOLUTION",
    hours: 44,
    status: "ACTIVE",
    badges: ["users"],
  },
  {
    id: "5",
    name: "Maya Khan",
    project: "AUTOMATION PIPELINE",
    hours: 68,
    status: "ACTIVE",
    badges: ["star", "award"],
  },
  {
    id: "6",
    name: "Noah Patel",
    project: "CONTENT OPS",
    hours: 22,
    status: "INACTIVE",
    badges: ["circle"],
  },
];

const ITEMS_PER_PAGE = 4;

function BadgeIconView({ type }: { type: BadgeIcon }) {
  switch (type) {
    case "zap":
      return <Zap className="h-3.5 w-3.5 text-orange-500" />;
    case "star":
      return <Star className="h-3.5 w-3.5 text-indigo-900" />;
    case "award":
      return <Award className="h-3.5 w-3.5 text-indigo-900" />;
    case "users":
      return <Users className="h-3.5 w-3.5 text-indigo-900" />;
    default:
      return <Circle className="h-3.5 w-3.5 text-slate-400" />;
  }
}

export default function MateePage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menteesData;
    return menteesData.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.project.toLowerCase().includes(q),
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageRows = filtered.slice(start, start + ITEMS_PER_PAGE);

  const archiveTotal = 42;
  const activeProjects = 7;
  const avgCompletion = 68;
  const pendingReviews = 3;

  return (
    <div className="min-h-screen bg-[#f7f8fb] p-5 md:p-8">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Management Hub
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0f1730]">
            All Mentees
          </h1>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search project-based mentees..."
            className="h-11 rounded-lg border-[#e3e7ee] bg-white pl-9"
          />
        </div>

        {/* Stats */}
        <Card className="rounded-xl border-[#e4e7ed] bg-white p-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Archive Total
              </p>
              <p className="text-4xl font-extrabold text-[#0b1459]">
                {archiveTotal}
              </p>
            </div>
            <div className="md:border-l md:pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Projects
              </p>
              <p className="text-4xl font-extrabold text-[#0b1459]">
                {String(activeProjects).padStart(2, "0")}
              </p>
            </div>
            <div className="md:border-l md:pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Avg. Completion
              </p>
              <p className="text-4xl font-extrabold text-[#0b1459]">
                {avgCompletion}%
              </p>
            </div>
            <div className="md:border-l md:pl-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Pending Reviews
              </p>
              <p className="text-4xl font-extrabold text-[#e45a3a]">
                {String(pendingReviews).padStart(2, "0")}
              </p>
            </div>
          </div>
        </Card>

        {/* Table header */}
        <div className="grid grid-cols-12 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:px-4">
          <p className="col-span-12 md:col-span-5">Mentee Identity (Project Based)</p>
          <p className="col-span-4 hidden md:col-span-2 md:block">Working Hours</p>
          <p className="col-span-3 hidden md:col-span-2 md:block">Active Badges</p>
          <p className="col-span-3 hidden md:col-span-2 md:block">Status</p>
          <p className="col-span-2 hidden text-right md:block">Actions</p>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {pageRows.map((m) => (
            <Card
              key={m.id}
              className="rounded-xl border-[#e4e7ed] bg-white px-3 py-3 md:px-4"
            >
              <div className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-12 flex items-center gap-3 md:col-span-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#d9dde5] text-sm font-bold text-[#0f1730]">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[18px] font-extrabold leading-none text-[#111827]">
                      {m.name}
                    </p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Project: {m.project}
                    </p>
                  </div>
                </div>

                <div className="col-span-4 md:col-span-2">
                  <p className="text-xl font-extrabold text-[#0b1459]">{m.hours}h</p>
                  <p className="text-[10px] font-bold uppercase text-slate-500">
                    This Month
                  </p>
                </div>

                <div className="col-span-3 flex items-center gap-1.5 md:col-span-2">
                  {m.badges.map((b, idx) => (
                    <BadgeIconView key={`${m.id}-${b}-${idx}`} type={b} />
                  ))}
                </div>

                <div className="col-span-3 md:col-span-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                      m.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end">
                  <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Card className="rounded-xl border-[#e4e7ed] bg-white p-4">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-8 w-8 rounded-md text-sm font-bold ${
                  n === currentPage
                    ? "bg-[#070c4f] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}