/**
 * @file ProfileBody — badges, activity heatmap, and recent activities sections.
 */

"use client";

import dayjs from "dayjs";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import "@/styles/activityHeatmap.css";

interface BadgeItem {
  id: string;
  name: string;
}

interface ActivityItem {
  id: string;
  date: string;
  timeSpent: number;
  status: string;
  feedbackStatus: string | null;
  feedbackNotes: string | null;
}

interface ProfileBodyProps {
  badges: BadgeItem[];
  heatmapData: { date: string; count: number }[];
  recentActivities: ActivityItem[];
}

/**
 * Normalises status for consistent display.
 */
function getStatusInfo(
  feedbackStatus: string | null,
  status: string,
): { text: string; colorClass: string } {
  const raw = (feedbackStatus ?? status ?? "").toLowerCase();
  if (raw === "accepted" || raw === "approved") {
    return {
      text: "Approved",
      colorClass: "bg-emerald-100 text-emerald-700",
    };
  }
  if (raw === "rejected") {
    return {
      text: "Rejected",
      colorClass: "bg-red-100 text-red-700",
    };
  }
  return {
    text: "Pending",
    colorClass: "bg-amber-100 text-amber-700",
  };
}

/**
 * Maps a heatmap value to a CSS colour class.
 */
function getHeatmapColorClass(value: { count: number } | null): string {
  if (!value || value.count === 0) return "color-empty";
  if (value.count === 1) return "color-scale-3";
  if (value.count === 2) return "color-scale-5";
  return "color-scale-10";
}

/**
 * Combined body content — badges, activity heatmap, and recent activities list.
 */
export function ProfileBody({
  badges,
  heatmapData,
  recentActivities,
}: ProfileBodyProps) {
  const totalApproved = heatmapData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="px-4">
      {/* ── Badges ── */}
      <section className="border-b border-[#E5E5E5] py-5">
        <h2 className="mb-4 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
          Badges &amp; Achievements
        </h2>
        {badges.length === 0 ? (
          <p className="font-inter text-[11px] text-[#94A3B8]">
            No badges earned yet.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((b) => (
              <div key={b.id} className="flex flex-col items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] text-[#000053]">
                  <span className="text-lg font-bold">{b.name.charAt(0)}</span>
                </span>
                <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#475569] uppercase">
                  {b.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Activity Heatmap ── */}
      <section className="border-b border-[#E5E5E5] py-5">
        <h2 className="mb-4 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
          Activity Overview (Last 6 Months)
        </h2>
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4">
          <div className="min-w-[480px] max-w-full">
            <CalendarHeatmap
              startDate={dayjs().subtract(6, "month").toDate()}
              endDate={dayjs().toDate()}
              values={heatmapData}
              classForValue={getHeatmapColorClass}
              showWeekdayLabels
              titleForValue={(
                value: { date: string; count: number } | null,
              ) => {
                if (!value || !value.date) return "No tasks";
                const formattedDate = dayjs(value.date)
                  .format("DD MMM YYYY")
                  .toUpperCase();
                const taskText = value.count === 1 ? "TASK" : "TASKS";
                return `${formattedDate} · ${value.count} ${taskText}`;
              }}
            />
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
          <p className="font-inter text-[9px] font-semibold text-[#64748B]">
            Total Approved Tasks: {totalApproved}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="font-inter text-[8px] font-medium text-[#94A3B8] uppercase">
              Less
            </span>
            <div className="flex gap-0.5">
              <span className="h-2.5 w-2.5 rounded bg-[#A5B4FC]" />
              <span className="h-2.5 w-2.5 rounded bg-[#6366F1]" />
              <span className="h-2.5 w-2.5 rounded bg-[#000053]" />
            </div>
            <span className="font-inter text-[8px] font-medium text-[#94A3B8] uppercase">
              More
            </span>
          </div>
        </div>
      </section>

      {/* ── Recent Activities ── */}
      <section className="py-5">
        <h2 className="mb-4 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
          Recent Activities
        </h2>
        {recentActivities.length === 0 ? (
          <p className="font-inter text-[11px] text-[#94A3B8]">
            No activities logged yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((activity) => {
              const statusInfo = getStatusInfo(
                activity.feedbackStatus,
                activity.status,
              );
              return (
                <div
                  key={activity.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-[#E5E5E5] px-3 py-2.5 gap-2 sm:gap-0"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-inter text-xs font-semibold text-[#334155]">
                      {dayjs(activity.date).format("DD MMM YYYY")}
                    </p>
                    {activity.feedbackNotes && (
                      <p className="font-inter text-[10px] text-[#64748B] truncate">
                        {activity.feedbackNotes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-inter text-[10px] font-semibold text-[#64748B]">
                      {activity.timeSpent}h
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] uppercase whitespace-nowrap ${statusInfo.colorClass}`}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
