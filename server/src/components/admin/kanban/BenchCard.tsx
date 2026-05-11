"use client";

import { OnboardingApplication } from "@/_hooks/admin/useAdminOnboarding";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Square } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

  const userStatusLabel =
    application.status?.toLowerCase() === "inactive" ? "Inactive" : "Active";

  const invitationStatusLabel =
    application.invitationStatus === "Active"
      ? "Accepted"
      : application.invitationStatus;

  const getInvitationBadgeClasses = () => {
    if (selected) {
      return "bg-white/20 text-white border-white/20";
    }

    switch (application.invitationStatus) {
      case "Accepted":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/60";
      case "Pending":
        return "bg-amber-50 text-amber-600 border-amber-200/60";
      case "Expired":
        return "bg-rose-50 text-rose-600 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getUserBadgeClasses = () => {
    if (selected) {
      return "bg-white/20 text-white border-white/20";
    }

    return application.status?.toLowerCase() === "inactive"
      ? "bg-rose-50 text-rose-600 border-rose-200/60"
      : "bg-emerald-50 text-emerald-600 border-emerald-200/60";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={[
        "group flex w-full min-w-0 cursor-grab items-center gap-2 rounded-xl border px-2.5 py-2 transition active:cursor-grabbing",
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

      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={[
            "text-[10px] font-bold",
            selected ? "bg-white/20 text-white" : "bg-[#000053] text-white",
          ].join(" ")}
        >
          {getInitials(application.fullName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={[
              "truncate text-xs font-semibold",
              selected ? "text-white" : "text-slate-800",
            ].join(" ")}
          >
            {application.fullName}
          </p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          <Badge
            variant="secondary"
            className={[
              "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
              getUserBadgeClasses(),
            ].join(" ")}
          >
            {userStatusLabel}
          </Badge>
          {application.invitationStatus && (
            <Badge
              variant="secondary"
              className={[
                "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
                getInvitationBadgeClasses(),
              ].join(" ")}
            >
              {invitationStatusLabel}
            </Badge>
          )}
        </div>
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
