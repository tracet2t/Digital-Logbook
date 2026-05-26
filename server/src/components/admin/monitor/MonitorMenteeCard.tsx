import type { MonitorMenteeCardData } from "@/_hooks/admin/useAdminMonitorMentees";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface MonitorMenteeCardProps {
  mentee: MonitorMenteeCardData;
  onSelect?: (menteeId: string) => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const taskStatusStyles: Record<
  NonNullable<MonitorMenteeCardData["taskStatus"]>,
  string
> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  reviewed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missed: "bg-rose-50 text-rose-700 border-rose-200",
};

const taskStatusLabels: Record<
  NonNullable<MonitorMenteeCardData["taskStatus"]>,
  string
> = {
  pending: "Pending review",
  reviewed: "Reviewed",
  missed: "Missed",
};

const warningRingStyles: Record<
  NonNullable<MonitorMenteeCardData["warningType"]>,
  string
> = {
  low: "ring-amber-300",
  medium: "ring-orange-400",
  high: "ring-rose-500",
};

export default function MonitorMenteeCard({
  mentee,
  onSelect,
}: MonitorMenteeCardProps) {
  const handleSelect = () => {
    onSelect?.(mentee.id);
  };

  const warningRingClass = mentee.warningType
    ? `ring-2 ring-offset-2 ring-offset-white ${warningRingStyles[mentee.warningType]}`
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
          {getInitials(mentee.name)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-[#0a0f57]">
              {mentee.name}
            </p>
            {mentee.taskStatus && (
              <Badge
                variant="outline"
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${taskStatusStyles[mentee.taskStatus]}`}
              >
                {taskStatusLabels[mentee.taskStatus]}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {mentee.totalHours} hrs logged
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tasks
        </p>
        {mentee.tasks.length === 0 ? (
          <p className="text-xs text-slate-500">No submissions yet</p>
        ) : (
          <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
            {mentee.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-[#f8fafc] px-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium text-[#0a0f57]">
                    {task.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{task.dateLabel}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {task.hours}h
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
