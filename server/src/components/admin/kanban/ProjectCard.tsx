"use client";

import { useDroppable } from "@dnd-kit/core";
import { Briefcase, UserX } from "lucide-react";

import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";
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

export function ProjectCard({
  project,
  assignedApplications,
  onUnassign,
  onViewProfile,
}: ProjectCardProps) {
  const { setNodeRef, isOver } = useDroppable({ id: project.id });

  return (
    <div
      ref={setNodeRef}
      className={[
        "group flex min-h-[280px] flex-col rounded-3xl border p-5 transition",
        isOver
          ? "border-indigo-300 bg-indigo-50/50"
          : "border-[#e4e7ed] bg-slate-50/50 hover:border-slate-200",
      ].join(" ")}
    >
      <div className="mb-3 flex items-start justify-between">
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-xl shadow-sm transition",
            isOver
              ? "bg-[#000053] text-white"
              : "bg-white text-slate-300 group-hover:bg-[#000053] group-hover:text-white",
          ].join(" ")}
        >
          <Briefcase className="h-4 w-4" />
        </div>
      </div>

      <h4 className="mb-1 text-sm font-black uppercase tracking-tight text-[#000053]">
        {project.name}
      </h4>
      {project.batchNo && (
        <span className="inline-block mb-1 w-fit px-3 py-0.5 rounded-full bg-[#EBEBEB] text-[11px] font-semibold text-blue-600 leading-tight">
          {project.batchNo}
        </span>
      )}
      {project.description && (
        <p className="mb-4 line-clamp-2 text-[10px] font-medium text-slate-400">
          {project.description}
        </p>
      )}
      {/** Scrollbar to kandban project card */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        {assignedApplications.length > 0 ? (
          <ScrollArea className="max-h-[220px] pr-1">
            <div className="flex flex-col gap-1.5">
              {assignedApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onViewProfile(app)}
                  className="group/item flex cursor-pointer items-center justify-between rounded-xl border border-transparent bg-white px-3 py-2 shadow-sm transition hover:border-indigo-100"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-[9px] font-bold text-white">
                        {getInitials(app.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-[11px] font-bold text-slate-700">
                      {app.fullName}
                    </span>
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
                    <UserX className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div
            className={[
              "flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed py-8 transition",
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
