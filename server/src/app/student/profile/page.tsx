"use client";

import dayjs from "dayjs";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import "@/styles/activityHeatmap.css";

import { useMenteeProfilePage } from "@/_hooks/mentee/useMenteeProfilePage";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenerateProfileReport } from "@/components/mentee/GenerateProfileReport";
import { ProfileSkeleton } from "@/components/mentee/ProfileSkeleton";
import { StatusIndicator } from "@/components/mentee/StatusIndicator";
import { TaskTimeline } from "@/components/mentee/TaskTimeline";

import { ShareProfileDialog } from "./_components/ShareProfileDialog";
import { badgeIcon, getInitials, ICON_COLORS } from "./_constants";

export default function MenteeProfilePage() {
  const {
    profileData,
    tasks,
    isLoading,
    error,
    warningSeverity,
    heatmapData,
    getHeatmapColorClass,
  } = useMenteeProfilePage();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white px-2 py-4 text-slate-900 sm:px-4 md:px-5 lg:px-6">
        <div className="w-full">
          <ProfileSkeleton />
        </div>
      </main>
    );
  }

  if (error || !profileData) {
    return (
      <main className="min-h-screen bg-white px-2 py-4 text-slate-900 sm:px-4 md:px-5 lg:px-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-red-500">
            {error ?? "Profile not found."}
          </p>
        </div>
      </main>
    );
  }

  const { profile, projects, mentor, badges } = profileData;
  const projectNames = projects.map((p) => p.name).join(", ") || "—";

  return (
    <main className="min-h-screen bg-white px-2 py-4 text-slate-900 sm:px-4 md:px-5 lg:px-6">
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b border-[#E5E5E5] px-5 py-6 md:px-8 md:py-7 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
              <div className="flex-shrink-0">
                <Avatar className="h-20 w-20 rounded-full border border-slate-200 shadow-sm">
                  <AvatarFallback className="bg-[#000053] text-lg font-bold text-white">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-1 flex-col gap-4 md:gap-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                  <div>
                    <h1 className="font-inter text-2xl font-extrabold leading-8 tracking-[-0.025em] text-[#0F172A] uppercase">
                      {profile.fullName.toUpperCase()}
                    </h1>
                    <p className="font-inter text-base font-medium leading-6 text-[#64748B]">
                      {profile.email}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      className={cn(
                        "rounded-full border px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase",
                        profile.isActive
                          ? "border-[#22C55E] bg-[#DCFCE7]"
                          : "border-slate-300 bg-slate-100",
                      )}
                    >
                      {profile.isActive ? "Active Mentee" : "Inactive"}
                    </Badge>
                    <ShareProfileDialog />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Batch Info
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                      {profile.batchNo ?? "—"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Assigned Projects
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                      {projectNames}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Mentor
                    </p>
                    {mentor ? (
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#000053] font-inter text-[8px] font-bold text-white">
                          {getInitials(mentor.fullName)}
                        </span>
                        <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                          {mentor.fullName}
                        </p>
                      </div>
                    ) : (
                      <p className="font-inter text-sm font-semibold leading-5 text-[#94A3B8]">
                        Not assigned
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="px-5 md:px-8 lg:px-10">
            {/* Achievements & Badges */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <div className="flex flex-col gap-4">
                <h2 className="font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                  Achievements &amp; Badges
                </h2>
                {badges.length === 0 ? (
                  <p className="font-inter text-[11px] text-[#94A3B8]">
                    No badges earned yet.
                  </p>
                ) : (
                  <div className="flex w-full flex-wrap items-center justify-center gap-8">
                    {badges.map((b, idx) => (
                      <div
                        key={b.id}
                        className="flex flex-col items-center gap-2"
                      >
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8FAFC]">
                          <span
                            className={ICON_COLORS[idx % ICON_COLORS.length]}
                          >
                            {badgeIcon(b.name)}
                          </span>
                        </span>
                        <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#475569] uppercase">
                          {b.name}
                        </p>
                      </div>
                    ))}
                    {warningSeverity && (
                      <>
                        <div className="mx-4 h-14 w-px self-center bg-[#E5E5E5]" />
                        <StatusIndicator severity={warningSeverity} />
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Activity Overview – Heat Map */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                Activity Overview (Last 6 Months)
              </h2>
              <div className="overflow-x-auto overflow-y-hidden">
                <div className="min-w-[480px] max-w-full">
                  <CalendarHeatmap
                    startDate={dayjs().subtract(6, "month").toDate()}
                    endDate={dayjs().toDate()}
                    values={heatmapData}
                    classForValue={getHeatmapColorClass}
                    showWeekdayLabels
                    titleForValue={(value: any) => {
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
                  Total Approved Tasks:{" "}
                  {heatmapData.reduce((sum, d) => sum + d.count, 0)}
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

            {/* Latest Tasks */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                Latest Tasks
              </h2>
              <TaskTimeline tasks={tasks} />
            </section>

            {/* Generate PDF */}
            <section className="flex justify-center py-7 lg:py-8">
              <GenerateProfileReport
                profileData={profileData}
                tasks={tasks}
                warningSeverity={warningSeverity}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
