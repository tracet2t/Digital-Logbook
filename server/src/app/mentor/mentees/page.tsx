"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Award, Bell, Bookmark, ChevronLeft, ChevronRight, Circle, CircleHelp, ClipboardList, Eye, FileText, MoreVertical, Search, Settings, Star, User, Users, Zap } from "lucide-react";
import { FilterBar, PageHeader } from "@/components/admin";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type MentorProject = { id: string; name: string };
type ProjectMentee = { id: string; name: string };
type MenteeRow = { id: string; name: string; projectName: string };
type UiStatus = "ACTIVE" | "INACTIVE";

const ITEMS_PER_PAGE = 4;
const ROUTES = { mentor: "/mentor", mentees: "/mentor/mentees", bulkReport: "/mentor/bulkreport" };
const STATE_CARD_CLASS = "rounded-xl border-[#e4e7ed] bg-white p-8 text-center text-sm";

function StateCard({ message, toneClass }: { message: string; toneClass: string }) {
  return <Card className={`${STATE_CARD_CLASS} ${toneClass}`}>{message}</Card>;
}

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
function hashSeed(value: string) { return value.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0); }
function getPseudoHours(id: string) { return (hashSeed(id) % 120) + 10; }
function getPseudoStatus(id: string): UiStatus { return hashSeed(id) % 5 === 0 ? "INACTIVE" : "ACTIVE"; }
function MenteeBadgeIcon({ id }: { id: string }) {
  const pick = hashSeed(id) % 5;
  if (pick === 0) return <Zap className="h-3.5 w-3.5 text-orange-500" />;
  if (pick === 1) return <Star className="h-3.5 w-3.5 text-[#0a0f57]" />;
  if (pick === 2) return <Award className="h-3.5 w-3.5 text-[#0a0f57]" />;
  if (pick === 3) return <Users className="h-3.5 w-3.5 text-[#0a0f57]" />;
  return <Circle className="h-3.5 w-3.5 text-slate-300" />;
}

export default function MenteesPage() {
  const router = useRouter();
  const goTo = (path: string) => router.push(path);

  const [projects, setProjects] = useState<MentorProject[]>([]);
  const [rows, setRows] = useState<MenteeRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadProjects = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/mentor/filter", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load mentor projects");
        const data = (await res.json()) as MentorProject[];
        if (!active) return;
        setProjects(data);
      } catch (error) {
        if (!active) return;
        setFetchError(error instanceof Error ? error.message : "Failed to load mentor projects");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadProjects();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadMentees = async () => {
      if (projects.length === 0) { setRows([]); return; }
      setIsLoading(true);
      setFetchError(null);
      try {
        const perProjectResponses = await Promise.all(
          projects.map(async (project) => {
            const res = await fetch(`/api/mentor/filter?projectId=${project.id}`, { cache: "no-store" });
            if (!res.ok) return [] as MenteeRow[];
            const data = (await res.json()) as ProjectMentee[];
            return data.map((m) => ({ id: m.id, name: m.name, projectName: project.name }));
          }),
        );
        if (!active) return;
        const unique = new Map<string, MenteeRow>();
        perProjectResponses.flat().forEach((mentee) => {
          const previous = unique.get(mentee.id);
          if (!previous) {
            unique.set(mentee.id, mentee);
            return;
          }
          unique.set(mentee.id, {
            ...previous,
            projectName: previous.projectName === mentee.projectName ? previous.projectName : `${previous.projectName}, ${mentee.projectName}`,
          });
        });
        setRows(Array.from(unique.values()));
      } catch (error) {
        if (!active) return;
        setRows([]);
        setFetchError(error instanceof Error ? error.message : "Failed to load mentees");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    loadMentees();
    return () => { active = false; };
  }, [projects]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => row.name.toLowerCase().includes(q) || row.id.toLowerCase().includes(q) || row.projectName.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const visibleRows = filteredRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const activeRows = filteredRows.filter((row) => getPseudoStatus(row.id) === "ACTIVE");
  const avgHours = filteredRows.length === 0 ? 0 : Math.round(filteredRows.reduce((sum, row) => sum + getPseudoHours(row.id), 0) / filteredRows.length);
  const pendingReviews = filteredRows.filter((row) => hashSeed(row.id + row.projectName) % 4 === 0).length;

  return (
    <div className="p-5 md:p-8">
      <div className="-mx-5 -mt-5 mb-6 border-b border-[#e4e7ed] bg-white px-5 py-3 md:-mx-8 md:-mt-8 md:px-8">
        <div className="flex items-center justify-between">
          <p className="text-[22px] font-black tracking-tight text-[#0b1459]">Mentor Portal</p>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e45a3a]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem onSelect={() => goTo(ROUTES.mentees)}>You have pending mentee reviews</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => goTo(ROUTES.bulkReport)}>Open bulk reports</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Help" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"><CircleHelp className="h-4 w-4" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onSelect={() => goTo(ROUTES.mentor)}>Go to mentor dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => goTo(ROUTES.mentees)}>View mentees guide</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Profile" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1459] text-white transition hover:bg-[#151f73]"><User className="h-4 w-4" /></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => goTo(ROUTES.mentor)}>Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => goTo(ROUTES.mentor)}><Settings className="mr-2 h-4 w-4 text-slate-500" />Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Management Hub</p>
          <PageHeader title="All Mentees" subtitle={undefined} />
        </div>

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
                className="h-11 w-full rounded-lg border border-[#e3e7ee] bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 md:w-[420px]"
              />
            </div>
          </FilterBar.Field>
        </FilterBar>

        <Card className="rounded-xl border-[#e4e7ed] bg-white px-5 py-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Archive Total</p><p className="text-4xl font-extrabold text-[#0b1459]">{filteredRows.length}</p></div>
            <div className="md:border-l md:pl-6"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Projects</p><p className="text-4xl font-extrabold text-[#0b1459]">{String(activeRows.length).padStart(2, "0")}</p></div>
            <div className="md:border-l md:pl-6"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg. Completion</p><p className="text-4xl font-extrabold text-[#0b1459]">{avgHours}h</p></div>
            <div className="md:border-l md:pl-6"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Reviews</p><p className="text-4xl font-extrabold text-[#e45a3a]">{String(pendingReviews).padStart(2, "0")}</p></div>
          </div>
        </Card>

        <div className="grid grid-cols-12 gap-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 md:px-4">
          <p className="col-span-12 md:col-span-4">Mentee Identity (Project Based)</p>
          <p className="hidden md:col-span-2 md:block">Working Hours</p>
          <p className="hidden md:col-span-2 md:block text-center">Active Badges</p>
          <p className="hidden md:col-span-2 md:block text-center">Status</p>
          <p className="hidden md:col-span-2 text-right md:block md:pr-6">Actions</p>
        </div>

        <div className="space-y-3">
          {!isLoading && !fetchError && visibleRows.length === 0 ? <StateCard message="No mentees found for this selection." toneClass="text-slate-500" /> : null}
          {isLoading ? <StateCard message="Loading mentees..." toneClass="text-slate-500" /> : null}
          {!isLoading && fetchError ? <StateCard message={fetchError} toneClass="text-red-500" /> : null}

          {!isLoading &&
            !fetchError &&
            visibleRows.map((row) => {
              const hours = getPseudoHours(row.id);
              const status = getPseudoStatus(row.id);
              return (
                <Card key={row.id} className="rounded-xl border-[#e4e7ed] bg-white px-3 py-3 md:px-4">
                  <div className="grid grid-cols-12 items-center gap-3 md:gap-4">
                    <div className="col-span-12 flex items-center gap-3 md:col-span-4">
                      <Avatar className="h-10 w-10 border border-[#d9dde5] bg-[#f5f7fb]"><AvatarFallback className="bg-[#e9edf5] text-xs font-bold text-[#0f1730]">{getInitials(row.name)}</AvatarFallback></Avatar>
                      <div><p className="text-[18px] font-extrabold leading-none text-[#111827]">{row.name}</p><p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Project: {row.projectName}</p></div>
                    </div>
                    <div className="col-span-4 md:col-span-2 flex flex-col items-start md:items-start"><p className="text-xl font-extrabold text-[#0b1459]">{hours}h</p><p className="text-[10px] font-bold uppercase text-slate-500">This Month</p></div>
                    <div className="col-span-3 md:col-span-2 flex items-center justify-center"><MenteeBadgeIcon id={row.id} /></div>
                    <div className="col-span-3 md:col-span-2 flex items-center justify-center">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>{status}</span>
                    </div>
                    <div className="col-span-2 md:col-span-2 flex items-center justify-end md:pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" aria-label={`Actions for ${row.name}`} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"><MoreVertical className="h-4 w-4" /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => goTo(`${ROUTES.mentees}/${row.id}`)} className="cursor-pointer gap-2"><Eye className="h-4 w-4 text-slate-500" />View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => goTo(`${ROUTES.bulkReport}?studentId=${row.id}`)} className="cursor-pointer gap-2"><FileText className="h-4 w-4 text-slate-500" />Generate Report</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => goTo(ROUTES.bulkReport)} className="cursor-pointer gap-2"><ClipboardList className="h-4 w-4 text-slate-500" />Bulk Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        <Card className="rounded-xl border-[#e4e7ed] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filteredRows.length === 0 ? 0 : startIndex + 1} to {Math.min(safePage * ITEMS_PER_PAGE, filteredRows.length)} of {filteredRows.length} mentees</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`h-8 w-8 rounded-md text-sm font-bold ${n === safePage ? "bg-[#070c4f] text-white" : "text-slate-600 hover:bg-slate-100"}`}>{n}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
        <button type="button" aria-label="Saved mentees" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#070c4f] text-white shadow-lg transition hover:bg-[#0d1464]"><Bookmark className="h-5 w-5" /></button>
        <button type="button" aria-label="Bulk reports" onClick={() => goTo(ROUTES.bulkReport)} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#070c4f] text-white shadow-lg transition hover:bg-[#0d1464]"><ClipboardList className="h-5 w-5" /></button>
      </div>
    </div>
  );
}
