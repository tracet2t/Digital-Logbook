"use client";

import { OnboardingApplication } from "@/_hooks/admin/useAdminOnboarding";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Briefcase, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getInitials } from "./utils";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    batchNo?: string | null;
  };
  assignedApplications: OnboardingApplication[];
  onUnassign: (appId: string) => void;
  onViewProfile: (app: OnboardingApplication) => void;
}

function DraggableAssignedRow({
  app,
  onUnassign,
  onViewProfile,
}: {
  app: OnboardingApplication;
  onUnassign: (appId: string) => void;
  onViewProfile: (app: OnboardingApplication) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: app.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const getStatusDotColor = () => {
    switch (app.invitationStatus) {
      case "Active":
        return "bg-emerald-500";
      case "Pending":
        return "bg-amber-500";
      case "Expired":
        return "bg-rose-500";
      default:
        return null;
    }
  };

  const dotColor = getStatusDotColor();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onViewProfile(app);
      }}
      className={[
        "group/item flex h-8 cursor-grab items-center justify-between rounded-2xl border border-transparent bg-white px-2 py-1 shadow-sm transition active:cursor-grabbing hover:border-indigo-100 sm:h-9 sm:px-3 sm:py-1.5 lg:h-10",
        isDragging ? "opacity-40 ring-2 ring-indigo-300" : "",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-2">
        <Avatar className="h-6 w-6 shrink-0 sm:h-7 sm:w-7">
          <AvatarFallback className="bg-[#000053] text-[9px] font-bold text-white">
            {getInitials(app.fullName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 items-center gap-1.5">
          {dotColor && (
            <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
          )}
          <span className="truncate text-[10px] font-bold text-slate-700 sm:text-[11px]">
            {app.fullName}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          onUnassign(app.id);
        }}
        className="opacity-0 hover:bg-rose-50 hover:text-rose-500 group-hover/item:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function ProjectCard({
  project,
  assignedApplications,
  onUnassign,
  onViewProfile,
}: ProjectCardProps) {
  // Sortable for the card itself
  const {
    setNodeRef: setSortableRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    isSorting,
    over,
  } = useSortable({ id: project.id });

  // Droppable for member assignment
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: project.id,
  });

  // Compose refs for both sortable and droppable
  const setRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.6 : 1,
    boxShadow: isDragging
      ? "0 8px 32px 0 rgba(0,0,83,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.08)"
      : isOver
        ? "0 0 0 2px #6366f1, 0 1.5px 6px 0 rgba(0,0,0,0.08)"
        : undefined,
  };

  return (
    <div
      ref={setRef}
      style={style}
      className={[
        "group flex h-[175px] flex-1 flex-col rounded-2xl border p-2 transition-all duration-200 max-sm:h-[155px] sm:h-[185px] md:h-[175px] sm:p-2.5 lg:h-auto lg:min-h-[280px] lg:p-5",
        isDragging
          ? "border-[#000053] bg-white/90 shadow-2xl scale-[1.03]"
          : isOver
            ? "border-indigo-300 bg-indigo-50/50"
            : "border-[#e4e7ed] bg-slate-50/50 hover:border-slate-200",
        isSorting ? "ring-2 ring-indigo-200" : "",
      ].join(" ")}
    >
      <div className="mb-1.5 flex items-start justify-between lg:mb-3">
        {/* Drag handle */}
        <button
          type="button"
          className={[
            "drag-handle flex h-7 w-7 items-center justify-center rounded-xl shadow-sm transition sm:h-8 sm:w-8 cursor-grab active:cursor-grabbing",
            isOver
              ? "bg-[#000053] text-white"
              : "bg-white text-slate-300 group-hover:bg-[#000053] group-hover:text-white",
          ].join(" ")}
          tabIndex={0}
          aria-label="Drag project card"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
        >
          <Briefcase className="h-4 w-4" />
        </button>
      </div>

      <h4 className="mb-0.5 line-clamp-2 text-[11px] font-black uppercase tracking-tight text-[#000053] sm:text-xs lg:text-sm">
        {project.name}
      </h4>
      {project.batchNo && (
        <span className="mb-0.5 inline-block w-fit rounded-full bg-[#EBEBEB] px-1.5 py-0.5 text-[9px] font-semibold leading-tight text-blue-600 sm:px-2 sm:text-[10px] lg:px-3 lg:text-[11px]">
          {project.batchNo}
        </span>
      )}
      {project.description && (
        <p className="mb-1 line-clamp-1 text-[8px] font-medium text-slate-400 sm:text-[9px] lg:mb-4 lg:text-[10px] lg:line-clamp-2">
          {project.description}
        </p>
      )}
      {/* Scrollbar to kanban project card */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        {assignedApplications.length > 0 ? (
          <ScrollArea className="max-h-[146px] pr-1 sm:max-h-[162px] md:max-h-[162px] lg:max-h-[178px]">
            <div className="flex flex-col gap-1.5">
              {assignedApplications.map((app) => (
                <DraggableAssignedRow
                  key={app.id}
                  app={app}
                  onUnassign={onUnassign}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div
            className={[
              "flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed py-3 transition sm:py-4 lg:py-8",
              isOver
                ? "border-indigo-200 opacity-80"
                : "border-slate-100 opacity-40",
            ].join(" ")}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">
              Drop Member
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
