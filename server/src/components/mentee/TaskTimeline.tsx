"use client";

/**
 * TaskTimeline.tsx
 * Vertical timeline of the student's recent tasks,
 * each with a status dot, title, timestamp, tech tags, and approval badge.
 */
import { useEffect, useState } from "react";

import { type Task } from "@/app/student/profile/_constants";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";

import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

dayjs.extend(isToday);

// ─── Task Dot ─────────────────────────────────────────────────────────────────

function TaskDot({ status }: { status: string }) {
  if (status === "accepted") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#BBF7D0] bg-[#F0FDF4]">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M6.45 10.95L11.7375 5.6625L10.6875 4.6125L6.45 8.85L4.3125 6.7125L3.2625 7.7625L6.45 10.95ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM7.5 13.5C9.175 13.5 10.5938 12.9188 11.7563 11.7563C12.9188 10.5938 13.5 9.175 13.5 7.5C13.5 5.825 12.9188 4.40625 11.7563 3.24375C10.5938 2.08125 9.175 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9188 5.825 13.5 7.5 13.5Z"
            fill="#22C55E"
          />
        </svg>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#FEE2E2] bg-[#FFF5F5]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5"
            stroke="#F87171"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#F8FAFC]">
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M3.75 8.625C4.0625 8.625 4.32812 8.51562 4.54688 8.29688C4.76562 8.07812 4.875 7.8125 4.875 7.5C4.875 7.1875 4.76562 6.92188 4.54688 6.70312C4.32812 6.48438 4.0625 6.375 3.75 6.375C3.4375 6.375 3.17188 6.48438 2.95312 6.70312C2.73438 6.92188 2.625 7.1875 2.625 7.5C2.625 7.8125 2.73438 8.07812 2.95312 8.29688C3.17188 8.51562 3.4375 8.625 3.75 8.625ZM7.5 8.625C7.8125 8.625 8.07812 8.51562 8.29688 8.29688C8.51562 8.07812 8.625 7.8125 8.625 7.5C8.625 7.1875 8.51562 6.92188 8.29688 6.70312C8.07812 6.48438 7.8125 6.375 7.5 6.375C7.1875 6.375 6.92188 6.48438 6.70312 6.70312C6.48438 6.92188 6.375 7.1875 6.375 7.5C6.375 7.8125 6.48438 8.07812 6.70312 8.29688C6.92188 8.51562 7.1875 8.625 7.5 8.625ZM11.25 8.625C11.5625 8.625 11.8281 8.51562 12.0469 8.29688C12.2656 8.07812 12.375 7.8125 12.375 7.5C12.375 7.1875 12.2656 6.92188 12.0469 6.70312C11.8281 6.48438 11.5625 6.375 11.25 6.375C10.9375 6.375 10.6719 6.48438 10.4531 6.70312C10.2344 6.92188 10.125 7.1875 10.125 7.5C10.125 7.8125 10.2344 8.07812 10.4531 8.29688C10.6719 8.51562 10.9375 8.625 11.25 8.625Z"
          fill="#94A3B8"
        />
      </svg>
    </div>
  );
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

type TaskRowProps = {
  task: Task;
  isLast: boolean;
};

function TaskRow({ task, isLast }: TaskRowProps) {
  const rawStatus = (
    task.feedback[0]?.status ??
    task.status ??
    ""
  ).toLowerCase();
  const effectiveStatus =
    rawStatus === "accepted" || rawStatus === "approved"
      ? "accepted"
      : rawStatus === "rejected"
        ? "rejected"
        : "pending";

  const title = task.notes
    ? task.notes.slice(0, 80) + (task.notes.length > 80 ? "…" : "")
    : `Activity — ${dayjs(task.date).format("DD MMM YYYY")}`;

  const description =
    task.notes && task.notes.length > 80
      ? task.notes.slice(80, 200)
      : (task.feedback[0]?.feedbackNotes ?? "");

  const submittedAt = dayjs(task.createdAt ?? task.date);
  const timeLabel = submittedAt.isToday()
    ? `TODAY, ${submittedAt.format("h:mm A")}`
    : submittedAt.format("MMM DD, YYYY · h:mm A").toUpperCase();

  return (
    <div className="flex items-start gap-4">
      <div className="relative flex w-8 flex-shrink-0 flex-col items-center">
        <TaskDot status={effectiveStatus} />
        {!isLast && (
          <div
            className="w-px flex-1 bg-[#E5E5E5]"
            style={{ minHeight: "5rem" }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pb-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-inter text-sm font-bold leading-5 text-[#0F172A]">
            {title}
          </h3>
          <p className="flex-shrink-0 font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
            {timeLabel}
          </p>
        </div>
        {description && (
          <p className="font-inter text-[11px] leading-[16.5px] text-[#64748B]">
            {description}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {task.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-[#E5E5E5] bg-[#F8FAFC] px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] tracking-[-0.025em] text-[#64748B] uppercase"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] uppercase",
              effectiveStatus === "accepted"
                ? "bg-emerald-100 text-emerald-700"
                : effectiveStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700",
            )}
          >
            {effectiveStatus === "accepted"
              ? "Approved"
              : effectiveStatus === "rejected"
                ? "Rejected"
                : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Public Export ────────────────────────────────────────────────────────────

type Props = {
  tasks: Task[];
  pageSize?: number;
  showPagination?: boolean;
  onTaskSelect?: (task: Task) => void;
};

const buildPageItems = (totalPages: number, currentPage: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);
  return items;
};

/** Renders recent tasks as a vertical timeline */
export function TaskTimeline({
  tasks,
  pageSize = 5,
  showPagination = false,
  onTaskSelect,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const pageTasks = tasks.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setPage(1);
  }, [pageSize, tasks]);

  useEffect(() => {
    if (page !== safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  if (tasks.length === 0) {
    return (
      <p className="font-inter text-[11px] text-[#94A3B8]">
        No tasks logged yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        {pageTasks.map((task, idx) => {
          const row = (
            <TaskRow task={task} isLast={idx === pageTasks.length - 1} />
          );

          if (!onTaskSelect) {
            return <div key={task.id}>{row}</div>;
          }

          return (
            <button
              key={task.id}
              type="button"
              onClick={() => onTaskSelect(task)}
              className="rounded-lg text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#000053]/40"
            >
              {row}
            </button>
          );
        })}
      </div>
      {showPagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="default"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
              />
            </PaginationItem>
            {buildPageItems(totalPages, safePage).map((item, idx) => (
              <PaginationItem key={`${item}-${idx}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    size="default"
                    isActive={item === safePage}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size="default"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={safePage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
