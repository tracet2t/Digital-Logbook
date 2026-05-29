import type { MonitorUserCardData } from "@/_hooks/admin/useAdminMonitorUsers";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MonitorUserCardProps {
  user: MonitorUserCardData;
  onSelect?: (userId: string) => void;
}

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const roleStyles: Record<MonitorUserCardData["role"], string> = {
  student: "bg-emerald-50 text-emerald-700",
  mentor: "bg-indigo-50 text-indigo-700",
  superAdmin: "bg-slate-100 text-slate-600",
};

const taskStatusStyles: Record<
  NonNullable<MonitorUserCardData["taskStatus"]>,
  string
> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  reviewed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missed: "bg-rose-50 text-rose-700 border-rose-200",
};

const taskStatusLabels: Record<
  NonNullable<MonitorUserCardData["taskStatus"]>,
  string
> = {
  pending: "Pending",
  reviewed: "Reviewed",
  missed: "Missed",
};

const warningRingStyles: Record<
  NonNullable<MonitorUserCardData["warningType"]>,
  string
> = {
  low: "ring-amber-300",
  medium: "ring-orange-400",
  high: "ring-rose-500",
};

const formatProjects = (projects: string[]) => {
  if (projects.length === 0) return "No projects";
  if (projects.length <= 2) return projects.join(", ");
  return `${projects.slice(0, 2).join(", ")} +${projects.length - 2}`;
};

export default function MonitorUserCard({
  user,
  onSelect,
}: MonitorUserCardProps) {
  const handleSelect = () => {
    onSelect?.(user.id);
  };

  const warningRingClass = user.warningType
    ? `ring-2 ring-offset-2 ring-offset-white ${warningRingStyles[user.warningType]}`
    : "";

  return (
    <Card
      className="cursor-pointer rounded-2xl border border-[#e4e7ed] bg-white p-4 transition-shadow hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleSelect();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-semibold text-[#0a0f57] ${warningRingClass}`}
        >
          {getInitials(user.firstName, user.lastName)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#0a0f57]">
                {user.firstName} {user.lastName}
              </p>
              {user.taskStatus && (
                <Badge
                  variant="default"
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${taskStatusStyles[user.taskStatus]}`}
                >
                  {user.taskStatus === "pending"
                    ? "Pending review"
                    : taskStatusLabels[user.taskStatus]}
                </Badge>
              )}
            </div>
            <Badge
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${roleStyles[user.role]}`}
            >
              {user.role}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{user.email}</p>
          <p className="text-[11px] text-slate-500">
            {formatProjects(user.assignedProjects)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{user.batchNo ? `Batch ${user.batchNo}` : "No batch"}</span>
        <span>{user.isActive ? "Active" : "Inactive"}</span>
      </div>
    </Card>
  );
}
