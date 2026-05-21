"use client";

import { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import CalendarHeatmap from "react-calendar-heatmap";

import "react-calendar-heatmap/dist/styles.css";
import "@/styles/activityHeatmap.css";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SharedProfileData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    batchNo: string | null;
  };
  projects: {
    id: string;
    name: string;
    description: string | null;
    batchNo: string | null;
    allocationStatus: string | null;
  }[];
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    projectAssigned: string;
  } | null;
  badges: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    awardedAt: string;
  }[];
  statistics: {
    totalActivities: number;
    approvedActivities: number;
    pendingActivities: number;
    rejectedActivities: number;
    totalHours: number;
  };
  recentActivities: {
    id: string;
    date: string;
    timeSpent: number;
    status: string;
    feedbackStatus: string | null;
    feedbackNotes: string | null;
  }[];
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

/**
 * Returns up-to-2-character uppercase initials from a full name
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/*
 * Normalises "approved" → "accepted" for consistent display.
 */
function getEffectiveStatus(
  feedbackStatus: string | null,
  status: string,
): {
  text: string;
  variant: "default" | "secondary" | "outline";
  colorClass: string;
} {
  const raw = (feedbackStatus ?? status ?? "").toLowerCase();

  if (raw === "accepted" || raw === "approved") {
    return {
      text: "Approved",
      variant: "default",
      colorClass: "bg-emerald-100 text-emerald-700",
    };
  }
  if (raw === "rejected") {
    return {
      text: "Rejected",
      variant: "outline",
      colorClass: "bg-red-100 text-red-700",
    };
  }
  return {
    text: "Pending",
    variant: "secondary",
    colorClass: "bg-amber-100 text-amber-700",
  };
}

// ── Page Component ─────────────────────────────────────────────────────────────

/**
 * SharedProfilePage
 */
export default function SharedProfilePage() {
  const params = useParams();
  const token = params?.token as string;

  const [profileData, setProfileData] = useState<SharedProfileData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/shared-profile/${encodeURIComponent(token)}`,
        );
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load profile");
        }
        setProfileData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  // ── Heatmap: approved/accepted activities aggregated by date ──
  // NOTE: useMemo must be called before any early return (Rules of Hooks).
  const heatmapData = useMemo(() => {
    if (!profileData) return [];
    const approved = profileData.recentActivities.filter((a) => {
      const raw = (a.feedbackStatus ?? a.status ?? "").toLowerCase();
      return raw === "accepted" || raw === "approved";
    });
    const byDate: Record<string, number> = {};
    approved.forEach((a) => {
      const key = dayjs(a.date).format("YYYY-MM-DD");
      byDate[key] = (byDate[key] || 0) + 1;
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  }, [profileData]);

  function getHeatmapColorClass(value: { count: number } | null): string {
    if (!value || value.count === 0) return "color-empty";
    if (value.count === 1) return "color-scale-3";
    if (value.count === 2) return "color-scale-5";
    return "color-scale-10";
  }

  // ── Loading State ─────────────────────────────────────
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Error State ───────────────────────────────────────
  if (error || !profileData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#0F172A]">
            Profile Not Available
          </h1>
          <p className="mb-6 text-sm text-[#64748B]">
            {error ?? "This share link may be invalid or has been deactivated."}
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Go to Digital Logbook</Link>
          </Button>
        </div>
      </main>
    );
  }

  const { profile, projects, badges, statistics, recentActivities } =
    profileData;
  const projectNames = projects.map((p) => p.name).join(", ") || "—";

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Branding header */}
        <div className="mb-4">
          <p className="font-inter text-[10px] font-bold tracking-[0.15em] text-[#64748B] uppercase">
            Shared Profile · Digital Logbook
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
          {/* HEADER */}
          <div className="border-b border-[#E5E5E5] px-4 py-5">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border border-slate-200 shadow-sm">
                <AvatarFallback className="bg-[#000053] text-base sm:text-lg font-bold text-white">
                  {getInitials(profile.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="text-center sm:text-left">
                    <h1 className="font-inter text-xl sm:text-2xl font-extrabold leading-7 tracking-[-0.025em] text-[#0F172A] uppercase break-words">
                      {profile.fullName.toUpperCase()}
                    </h1>
                    <p className="font-inter text-sm font-medium leading-5 text-[#64748B] break-all">
                      {profile.email}
                    </p>
                  </div>
                  <Badge
                    className={
                      profile.isActive
                        ? "self-center sm:self-start rounded-full border border-[#22C55E] bg-[#DCFCE7] px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase"
                        : "self-center sm:self-start rounded-full border border-slate-300 bg-slate-100 px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase"
                    }
                  >
                    {profile.isActive ? "Active Mentee" : "Inactive"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Batch Info
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                      {profile.batchNo ?? "—"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Assigned Projects
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155] truncate">
                      {projectNames}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="px-4">
            {/* Statistics */}
            <section className="border-b border-[#E5E5E5] py-5">
              <h2 className="mb-4 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                Activity Statistics
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3 text-center">
                  <p className="font-inter text-xl sm:text-2xl font-extrabold text-[#000053]">
                    {statistics.totalActivities}
                  </p>
                  <p className="font-inter text-[8px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
                    Total Tasks
                  </p>
                </div>
                <div className="rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3 text-center">
                  <p className="font-inter text-xl sm:text-2xl font-extrabold text-[#22C55E]">
                    {statistics.approvedActivities}
                  </p>
                  <p className="font-inter text-[8px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
                    Approved
                  </p>
                </div>
                <div className="rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3 text-center">
                  <p className="font-inter text-xl sm:text-2xl font-extrabold text-[#EAB308]">
                    {statistics.pendingActivities}
                  </p>
                  <p className="font-inter text-[8px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
                    Pending
                  </p>
                </div>
                <div className="rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3 text-center">
                  <p className="font-inter text-xl sm:text-2xl font-extrabold text-[#EF4444]">
                    {statistics.rejectedActivities}
                  </p>
                  <p className="font-inter text-[8px] font-bold tracking-[0.1em] text-[#64748B] uppercase">
                    Rejected
                  </p>
                </div>
              </div>
            </section>

            {/* Badges */}
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
                    <div
                      key={b.id}
                      className="flex flex-col items-center gap-2"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] text-[#000053]">
                        <span className="text-lg font-bold">
                          {b.name.charAt(0)}
                        </span>
                      </span>
                      <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#475569] uppercase">
                        {b.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Activity Overview – Heat Map */}
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

            {/* Recent Activities */}
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
                  {recentActivities.map((activity) => (
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
                        {(() => {
                          const statusInfo = getEffectiveStatus(
                            activity.feedbackStatus,
                            activity.status,
                          );
                          return (
                            <span
                              className={`rounded-md px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] uppercase whitespace-nowrap ${statusInfo.colorClass}`}
                            >
                              {statusInfo.text}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center font-inter text-[9px] text-[#94A3B8]">
          Powered by T2T Digital Logbook
        </p>
      </div>
    </main>
  );
}
