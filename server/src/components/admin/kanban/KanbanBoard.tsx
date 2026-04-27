"use client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { OnboardingApplication } from "@/_hooks/admin/useAdminOnboarding";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { CheckSquare, Plus, Search, Square } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { BenchCard } from "./BenchCard";
import { ProjectCard } from "./ProjectCard";
import { formatDate, getInitials } from "./utils";

interface Project {
  id: string;
  name: string;
  description: string | null;
  batchNo?: string | null;
}

interface KanbanBoardProps {
  benchLabel: string;
  benchBadgeText: string;
  benchEmptyText: string;
  assignmentLabel: string;
  bench: OnboardingApplication[];
  isLoading: boolean;
  applications: OnboardingApplication[];
  assignments: Record<string, Set<string>>;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  projectsLoading: boolean;
  selectedIds: Set<string>;
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleUnassign: (projectId: string, id: string) => void;
  activeApplication: OnboardingApplication | null;
  dragCount: number;
  onViewProfile: (app: OnboardingApplication) => void;
  onAddProject: () => void;
  benchSearch?: string;
  onBenchSearchChange?: (value: string) => void;
}

export function KanbanBoard({
  benchLabel,
  benchBadgeText,
  benchEmptyText,
  assignmentLabel,
  bench,
  isLoading,
  applications,
  assignments,
  projects,
  setProjects,
  projectsLoading,
  selectedIds,
  setSelectedIds,
  handleDragStart,
  handleDragEnd,
  handleUnassign,
  activeApplication,
  dragCount,
  onViewProfile,
  onAddProject,
  benchSearch = "",
  onBenchSearchChange,
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const { setNodeRef: setBenchRef, isOver: isBenchOver } = useDroppable({
    id: "BENCH",
  });

  const filteredBench = useMemo(() => {
    if (!benchSearch.trim()) return bench;
    const q = benchSearch.toLowerCase();
    return bench.filter((a) => a.fullName.toLowerCase().includes(q));
  }, [bench, benchSearch]);

  // Local state for drag-and-drop of project cards
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Only handle project card sorting here
  function handleProjectDragStart(event: DragStartEvent) {
    if (projects.some((p) => p.id === event.active.id)) {
      setActiveProjectId(event.active.id as string);
    }
    handleDragStart(event);
  }

  function handleProjectDragEnd(event: DragEndEvent) {
    if (
      activeProjectId &&
      event.over !== null &&
      projects.some((p) => p.id === event.active.id) &&
      projects.some((p) => p.id === event.over.id)
    ) {
      const oldIndex = projects.findIndex((p) => p.id === event.active.id);
      const newIndex = projects.findIndex((p) => p.id === event.over!.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setProjects(arrayMove(projects, oldIndex, newIndex));
      }
      setActiveProjectId(null);
      return;
    }
    setActiveProjectId(null);
    handleDragEnd(event); // call original for member DnD
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleProjectDragStart}
      onDragEnd={handleProjectDragEnd}
    >
      <div className="flex flex-col gap-2 rounded-2xl border border-[#e4e7ed] bg-white p-2 sm:flex-row sm:gap-3 sm:p-3 lg:gap-6 lg:p-6 2xl:gap-4 2xl:p-4 3xl:gap-3 3xl:p-3 2xl:overflow-hidden 2xl:h-[calc(100dvh-22rem)] w-full">
        {/* Bench */}
        <div
          ref={setBenchRef}
          className={[
            "flex w-full shrink-0 flex-col rounded-2xl border-b pb-3 pl-2 pr-1 transition sm:w-56 sm:border-b-0 sm:border-r sm:pb-0 sm:pl-2 sm:pr-1 md:w-60 lg:w-72 lg:pl-2 lg:pr-2 2xl:w-72 3xl:w-80",
            isBenchOver
              ? "border-indigo-300 bg-indigo-50/60"
              : "border-slate-100",
          ].join(" ")}
        >
          <div className="mb-4 flex items-center justify-between pr-3 sm:pr-4 lg:pr-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
              {benchLabel}
            </h3>
            <Badge className="rounded-full border-0 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-50">
              {filteredBench.length} {benchBadgeText}
            </Badge>
          </div>
          {/* Bench search */}
          {!isLoading && onBenchSearchChange && (
            <div className="mb-2 pr-3 sm:pr-4 lg:pr-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={benchSearch}
                  onChange={(e) => onBenchSearchChange(e.target.value)}
                  placeholder="Search by name..."
                  className="h-8 w-full rounded-lg border border-[#dbe0e8] bg-white pl-8 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          )}
          {/** Select All function :CheckBox */}
          {!isLoading && bench.length > 0 && (
            <div className="pr-3 sm:pr-4 lg:pr-6">
              <button
                type="button"
                onClick={() =>
                  setSelectedIds((prev) => {
                    const allSelected = bench.every((a) => prev.has(a.id));
                    if (allSelected) return new Set();
                    return new Set(bench.map((a) => a.id));
                  })
                }
                className="mb-2 flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400 transition hover:bg-slate-50"
              >
                {bench.every((a) => selectedIds.has(a.id)) ? (
                  <CheckSquare className="h-3.5 w-3.5 text-[#000053]" />
                ) : (
                  <Square className="h-3.5 w-3.5 text-slate-300" />
                )}
                Select All
              </button>
            </div>
          )}
          <ScrollArea className="max-h-64 sm:max-h-80 lg:max-h-none 2xl:flex-1">
            <div className="space-y-2 pr-3 sm:pr-4 lg:pr-6">
              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                </div>
              )}
              {!isLoading && filteredBench.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-100 px-3 py-8 text-center">
                  <p className="text-[10px] text-slate-400">{benchEmptyText}</p>
                </div>
              )}
              {!isLoading &&
                filteredBench.map((app) => (
                  <BenchCard
                    key={app.id}
                    application={app}
                    selected={selectedIds.has(app.id)}
                    onSelect={(e) => {
                      e.stopPropagation();
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        next.has(app.id)
                          ? next.delete(app.id)
                          : next.add(app.id);
                        return next;
                      });
                    }}
                    onClick={() => onViewProfile(app)}
                  />
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Assignment panel */}
        <div className="flex min-w-0 flex-1 flex-col 2xl:overflow-hidden">
          <div className="mb-3 flex items-center justify-between sm:mb-4 lg:mb-5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
              {assignmentLabel}
            </h3>
            <Button
              variant="ghost"
              size="icon-sm"
              className="bg-slate-50 text-slate-400 hover:bg-slate-100"
              onClick={onAddProject}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          {projectsLoading ? (
            <p className="py-10 text-center text-sm text-slate-400">
              Loading projects...
            </p>
          ) : projects.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No projects found. Create a project first.
            </p>
          ) : (
            <div className="2xl:flex-1 2xl:overflow-y-auto">
              <SortableContext items={projects.map((p) => p.id)}>
                <div className="grid grid-cols-2 gap-1.5 pb-2 pr-1 sm:gap-2 sm:grid-cols-3 lg:grid-cols-3 lg:gap-3 xl:grid-cols-4 2xl:grid-cols-4 2xl:gap-3 3xl:grid-cols-5 3xl:gap-3 4xl:grid-cols-6 4xl:gap-3">
                  {projects.map((project) => {
                    const assignedIds =
                      assignments[project.id] ?? new Set<string>();
                    const assignedApps = applications.filter((a) =>
                      assignedIds.has(a.id),
                    );
                    return (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        assignedApplications={assignedApps}
                        onUnassign={(appId) =>
                          handleUnassign(project.id, appId)
                        }
                        onViewProfile={onViewProfile}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {/* Project card drag overlay with defensive checks */}
        {activeProjectId ? (
          (() => {
            const project = projects.find((p) => p.id === activeProjectId);
            if (!project) return null;
            // Defensive: ensure assignments and applications are available
            const assignedIds = assignments?.[project.id] ?? new Set<string>();
            const assignedApps = Array.isArray(applications)
              ? applications.filter((a) => assignedIds.has(a.id))
              : [];
            return (
              <ProjectCard
                project={project}
                assignedApplications={assignedApps}
                onUnassign={() => {}}
                onViewProfile={() => {}}
              />
            );
          })()
        ) : activeApplication &&
          typeof activeApplication === "object" &&
          activeApplication.fullName ? (
          <div className="flex w-56 cursor-grabbing items-center gap-3 rounded-2xl border border-[#000053] bg-[#000053] p-3 shadow-2xl">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-white/20 text-[10px] font-bold text-white">
                {getInitials(activeApplication.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">
                {dragCount > 1
                  ? `Moving ${dragCount} profiles`
                  : activeApplication.fullName}
              </p>
              <p className="truncate text-[10px] italic text-indigo-200">
                {dragCount > 1
                  ? "Drop on a project"
                  : formatDate(activeApplication.createdAt)}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
