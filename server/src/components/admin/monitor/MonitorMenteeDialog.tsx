"use client";

import { useMemo, useState } from "react";

import dayjs from "dayjs";
import CalendarHeatmap, {
  type ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import "@/styles/activityHeatmap.css";

import { useAdminMonitorMenteeDetail } from "@/_hooks/admin/useAdminMonitorMenteeDetail";
import {
  getInitials,
  STATUS_CONFIG,
  type Task,
} from "@/app/student/profile/_constants";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskTimeline } from "@/components/mentee/TaskTimeline";

interface MonitorMenteeDialogProps {
  menteeId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const buildHeatmapData = (
  tasks: {
    date: string | Date;
    status: string;
    feedback?: { status: string }[];
  }[],
) => {
  const approvedTasks = tasks.filter((task) => {
    const rawStatus = (
      task.feedback?.[0]?.status ??
      task.status ??
      ""
    ).toLowerCase();
    return rawStatus === "accepted" || rawStatus === "approved";
  });

  const tasksByDate: Record<string, number> = {};
  approvedTasks.forEach((task) => {
    const dateKey = dayjs(task.date).format("YYYY-MM-DD");
    tasksByDate[dateKey] = (tasksByDate[dateKey] || 0) + 1;
  });

  return Object.entries(tasksByDate).map(([date, count]) => ({
    date,
    count,
  }));
};

const getHeatmapColorClass = (
  value: ReactCalendarHeatmapValue<string> | undefined,
) => {
  const count = value?.count ?? 0;

  if (count === 0) return "color-empty";
  if (count === 1) return "color-scale-3";
  if (count === 2) return "color-scale-5";
  return "color-scale-10";
};

export default function MonitorMenteeDialog({
  menteeId,
  open,
  onOpenChange,
}: MonitorMenteeDialogProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const { data, isLoading, error } = useAdminMonitorMenteeDetail(
    menteeId,
    open,
  );

  const heatmapData = useMemo(() => {
    if (!data?.tasks) return [];
    return buildHeatmapData(data.tasks);
  }, [data?.tasks]);

  const warningConfig = data?.warningSeverity
    ? STATUS_CONFIG[data.warningSeverity]
    : null;

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const resolveTaskStatus = (task: Task) => {
    const rawStatus = (
      task.feedback?.[0]?.status ??
      task.status ??
      ""
    ).toLowerCase();
    if (rawStatus === "accepted" || rawStatus === "approved") {
      return {
        label: "Approved",
        tone: "text-emerald-700",
        badge: "bg-emerald-100",
      };
    }
    if (rawStatus === "rejected") {
      return { label: "Rejected", tone: "text-red-700", badge: "bg-red-100" };
    }
    return { label: "Pending", tone: "text-amber-700", badge: "bg-amber-100" };
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[94vh] max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Mentee Overview</DialogTitle>
          </DialogHeader>

          {isLoading && (
            <div className="text-sm text-slate-500">
              Loading mentee details...
            </div>
          )}

          {error && (
            <div className="text-sm text-rose-600">{error.message}</div>
          )}

          {!isLoading && !error && data && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-semibold text-[#0a0f57]">
                    {getInitials(data.profile.fullName)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#0a0f57]">
                      {data.profile.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {data.profile.email}
                    </p>
                  </div>
                </div>
                {warningConfig ? (
                  <Badge
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.1em] ${warningConfig.bg} ${warningConfig.border} ${warningConfig.text}`}
                  >
                    {warningConfig.label} WARNING
                  </Badge>
                ) : (
                  <Badge className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold tracking-[0.1em] text-slate-500">
                    NO WARNINGS
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Total Hours
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#0a0f57]">
                    {data.statistics.totalHours}h
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Projects
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0a0f57]">
                    {data.projects.length > 0
                      ? data.projects.map((project) => project.name).join(", ")
                      : "No projects"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Mentor
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0a0f57]">
                    {data.mentor ? data.mentor.fullName : "Not assigned"}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Activity Heatmap (Last 6 Months)
                </p>
                <div className="overflow-x-auto overflow-y-hidden rounded-lg border border-slate-200 bg-white p-4">
                  <div className="min-w-[480px] max-w-full">
                    <CalendarHeatmap
                      startDate={dayjs().subtract(6, "month").toDate()}
                      endDate={dayjs().toDate()}
                      values={heatmapData}
                      classForValue={getHeatmapColorClass}
                      showWeekdayLabels
                      titleForValue={(
                        value?: ReactCalendarHeatmapValue<string>,
                      ) => {
                        if (!value?.date) return "No tasks";
                        const formattedDate = dayjs(value.date)
                          .format("DD MMM YYYY")
                          .toUpperCase();
                        const taskText = value.count === 1 ? "TASK" : "TASKS";
                        return `${formattedDate} · ${value.count} ${taskText}`;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Latest Tasks
                </p>
                <div className="max-h-[280px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
                  <TaskTimeline
                    tasks={data.tasks}
                    pageSize={3}
                    showPagination
                    onTaskSelect={handleTaskSelect}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={isTaskDialogOpen}
        onOpenChange={(isOpen) => {
          setIsTaskDialogOpen(isOpen);
          if (!isOpen) {
            setSelectedTask(null);
          }
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Date
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {dayjs(selectedTask.date).format("MMM DD, YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Hours
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedTask.timeSpent}h
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Status
                  </p>
                  {(() => {
                    const status = resolveTaskStatus(selectedTask);
                    return (
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${status.badge} ${status.tone}`}
                      >
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Notes
                </p>
                <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  {selectedTask.notes?.trim()
                    ? selectedTask.notes
                    : "No notes provided."}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Technologies
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {selectedTask.technologies.length > 0 ? (
                    selectedTask.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-slate-600"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">
                      No technologies listed.
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Latest Feedback
                </p>
                <p className="mt-1 rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  {selectedTask.feedback?.[0]?.feedbackNotes?.trim()
                    ? selectedTask.feedback[0].feedbackNotes
                    : "No feedback yet."}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
