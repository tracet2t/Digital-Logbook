"use client";

import { useAdminMonitorUserDetail } from "@/_hooks/admin/useAdminMonitorUserDetail";
import dayjs from "dayjs";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MonitorUserDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleStyles: Record<"student" | "mentor" | "superAdmin", string> = {
  student: "bg-emerald-50 text-emerald-700",
  mentor: "bg-indigo-50 text-indigo-700",
  superAdmin: "bg-slate-100 text-slate-600",
};

export default function MonitorUserDialog({
  userId,
  open,
  onOpenChange,
}: MonitorUserDialogProps) {
  const { data, isLoading, error } = useAdminMonitorUserDetail(userId, open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>User Overview</DialogTitle>
        </DialogHeader>

        {isLoading && <div className="text-sm text-slate-500">Loading...</div>}

        {error && <div className="text-sm text-rose-600">{error.message}</div>}

        {!isLoading && !error && data && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#0a0f57]">
                  {data.profile.fullName}
                </p>
                <p className="text-sm text-slate-500">{data.profile.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${roleStyles[data.profile.role]}`}
                >
                  {data.profile.role}
                </Badge>
                <Badge className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {data.profile.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Batch
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0a0f57]">
                  {data.profile.batchNo ?? "-"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Joined
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0a0f57]">
                  {dayjs(data.profile.createdAt).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Submitted Tasks
                </p>
                <p className="mt-1 text-sm font-semibold text-[#0a0f57]">
                  {data.tasks.length}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Submitted Tasks
              </p>
              {data.tasks.length === 0 ? (
                <p className="text-sm text-slate-500">No submissions yet.</p>
              ) : (
                <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                  {data.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-[#f8fafc] px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#0a0f57]">
                          {task.taskName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {dayjs(task.date).format("MMM D, YYYY")}
                          {task.menteeName ? ` • ${task.menteeName}` : ""}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {task.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
