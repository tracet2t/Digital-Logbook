"use client";

import { Dispatch, SetStateAction } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";

import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";
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
}: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-hidden rounded-[2.5rem] border border-[#e4e7ed] bg-white p-6">
        {/* Bench */}
        <div className="flex w-64 shrink-0 flex-col border-r border-slate-100 pr-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-[#000053]">
              {benchLabel}
            </h3>
            <Badge className="rounded-full border-0 bg-indigo-50 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:bg-indigo-50">
              {bench.length} {benchBadgeText}
            </Badge>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-1">
              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                  <Skeleton className="h-14 rounded-2xl" />
                </div>
              )}
              {!isLoading && bench.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-100 px-3 py-8 text-center">
                  <p className="text-[10px] text-slate-400">{benchEmptyText}</p>
                </div>
              )}
              {!isLoading &&
                bench.map((app) => (
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
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between">
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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
                    onUnassign={(appId) => handleUnassign(project.id, appId)}
                    onViewProfile={onViewProfile}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeApplication ? (
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
