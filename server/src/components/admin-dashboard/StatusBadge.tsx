"use client";

import { Badge } from "@/components/ui/badge";

export type ProjectStatus = "active" | "pending" | "delayed";

interface StatusBadgeProps {
  status: ProjectStatus;
}

const styles: Record<ProjectStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  delayed: "bg-rose-50 text-rose-700 border border-rose-100",
};

const labels: Record<ProjectStatus, string> = {
  active: "Active",
  pending: "Pending",
  delayed: "Delayed",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={`rounded-full px-2 py-1 text-[11px] font-semibold ${styles[status]}`}>
      {labels[status]}
    </Badge>
  );
}
