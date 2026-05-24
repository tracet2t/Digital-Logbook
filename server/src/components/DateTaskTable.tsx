"use client";

import React, { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import moment from "moment";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPagination } from "@/components/admin";

// ─── Types ────────────────────────────────────────────────────────────────

export interface TaskTableEvent {
  id: string;
  title: string;
  timeSpent?: number;
  status: "pending" | "approved" | "rejected";
  start: Date;
  end: Date;
  createdAt: Date;
  studentId: string;
  notes?: string;
  technologies?: string[];
}

interface DateTaskTableProps {
  dateKey: string;
  events: TaskTableEvent[];
  onRowClick: (event: TaskTableEvent) => void;
  onAddTask: () => void;
  onClose: () => void;
  /** Whether to show the "Add Task" button. Defaults to true (student view). */
  showAddTask?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 5;

const STATUS_VARIANT: Record<
  string,
  "pending" | "completed" | "failed" | "wip"
> = {
  approved: "completed",
  rejected: "failed",
  pending: "wip",
};

// ─── Component ────────────────────────────────────────────────────────────

export default function DateTaskTable({
  dateKey,
  events,
  onRowClick,
  onAddTask,
  onClose,
  showAddTask = true,
}: DateTaskTableProps) {
  const [page, setPage] = useState(1);

  // Reset pagination when date changes
  useEffect(() => {
    setPage(1);
  }, [dateKey]);

  const totalPages = Math.max(1, Math.ceil(events.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = events.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
        <div>
          <p className="text-lg font-semibold text-slate-800">
            Tasks for {moment(dateKey).format("MMMM D, YYYY")}
          </p>
          <p className="text-xs text-slate-500">{events.length} tasks</p>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Table */}
      <div
        className="max-h-[55vh] overflow-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600">
                Task
              </th>
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600 w-20">
                Hours
              </th>
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600 w-36">
                Submitted Time
              </th>
              <th className="text-left py-2.5 px-5 font-semibold text-slate-600 w-28">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((event) => (
              <tr
                key={event.id}
                className="border-b border-slate-100 hover:bg-indigo-50 cursor-pointer transition-colors"
                onClick={() => onRowClick(event)}
              >
                <td className="py-2.5 px-5 text-slate-700 font-medium max-w-[160px] truncate">
                  {event.title}
                </td>
                <td className="py-2.5 px-5 text-slate-600">
                  {event.timeSpent ?? "-"}h
                </td>
                <td className="py-2.5 px-5 text-slate-500 text-xs whitespace-nowrap">
                  {moment(event.createdAt).format("MMM D, h:mm A")}
                </td>
                <td className="py-2.5 px-5">
                  <Badge variant={STATUS_VARIANT[event.status] ?? "wip"}>
                    {event.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-slate-400 text-sm"
                >
                  No tasks for this date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
        {events.length > 0 ? (
          <AdminPagination
            page={safePage}
            totalPages={totalPages}
            total={events.length}
            itemsPerPage={ITEMS_PER_PAGE}
            itemLabel="tasks"
            onPageChange={setPage}
          />
        ) : (
          <div />
        )}
        {showAddTask && (
          <Button size="sm" onClick={onAddTask}>
            <Plus className="mr-1 h-4 w-4" /> Add Task
          </Button>
        )}
      </div>
    </div>
  );
}
