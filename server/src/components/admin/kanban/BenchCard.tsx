"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Square } from "lucide-react";

import { OnboardingApplication } from "@/hooks/admin/useAdminOnboarding";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { formatDate, getInitials } from "./utils";

interface BenchCardProps {
  application: OnboardingApplication;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onClick: () => void;
}

export function BenchCard({
  application,
  selected,
  onSelect,
  onClick,
}: BenchCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: application.id });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={[
        "group flex cursor-grab items-center gap-3 rounded-2xl border p-3 transition active:cursor-grabbing",
        isDragging ? "opacity-40 ring-2 ring-indigo-300" : "",
        selected
          ? "border-[#000053] bg-[#000053] text-white shadow-md"
          : "border-[#e8ebf0] bg-white shadow-sm hover:border-indigo-200",
      ].join(" ")}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(e);
        }}
        className="shrink-0 hover:bg-transparent"
      >
        {selected ? (
          <CheckSquare className="h-3.5 w-3.5 text-white" />
        ) : (
          <Square className="h-3.5 w-3.5 text-slate-300" />
        )}
      </Button>

      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback
          className={[
            "text-[10px] font-bold",
            selected ? "bg-white/20 text-white" : "bg-[#eef2ff] text-[#4338ca]",
          ].join(" ")}
        >
          {getInitials(application.fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate text-xs font-bold",
            selected ? "text-white" : "text-slate-800",
          ].join(" ")}
        >
          {application.fullName}
        </p>
        <p
          className={[
            "truncate text-[10px] italic",
            selected ? "text-indigo-200" : "text-slate-400",
          ].join(" ")}
        >
          {formatDate(application.createdAt)}
        </p>
      </div>
    </div>
  );
}
