"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import {
  Award,
  FileText,
  GraduationCap,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

dayjs.extend(isToday);

// ─── API Types ─────────────────────────────────────────────────────────────────

type BadgeItem = {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  awardedAt: string;
};

type ProjectItem = {
  id: string;
  name: string;
  description: string | null;
  batchNo: string | null;
  allocationStatus: string | null;
  assignedAt: string;
};

type MentorInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  projectAssigned: string;
} | null;

type Statistics = {
  totalActivities: number;
  approvedActivities: number;
  pendingActivities: number;
  rejectedActivities: number;
  totalHours: number;
  profileCompletion: number;
};

type ProfileApiData = {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    batchNo: string | null;
    createdAt: string;
  };
  projects: ProjectItem[];
  mentor: MentorInfo;
  badges: BadgeItem[];
  statistics: Statistics;
  recentActivities: {
    id: string;
    date: string;
    timeSpent: number;
    status: string;
    feedbackStatus: string | null;
    feedbackNotes: string | null;
  }[];
};

type Task = {
  id: string;
  date: string;
  createdAt: string;
  timeSpent: number;
  notes: string;
  technologies: string[];
  status: string;
  feedback: { status: string; feedbackNotes: string | null }[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function badgeIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("commit") || n.includes("first"))
    return <Trophy className="h-4 w-4" />;
  if (n.includes("solver") || n.includes("problem"))
    return <Sparkles className="h-4 w-4" />;
  if (n.includes("certif") || n.includes("log"))
    return <GraduationCap className="h-4 w-4" />;
  if (n.includes("top") || n.includes("contribut"))
    return <Star className="h-4 w-4" />;
  if (n.includes("award")) return <Award className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />;
}

const ICON_COLORS = [
  "text-[#000053]",
  "text-[#f97316]",
  "text-[#0d9488]",
  "text-[#eab308]",
  "text-[#8b5cf6]",
  "text-[#ef4444]",
];

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
      <div className="border-b border-[#E5E5E5] px-5 py-6 md:px-8 md:py-7 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
          <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
            <div className="grid grid-cols-3 gap-4 pt-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 md:px-8 lg:px-10 py-7 space-y-6">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Task Timeline Dot ────────────────────────────────────────────────────────

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
  // pending / default
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MenteeProfilePage() {
  const [profileData, setProfileData] = useState<ProfileApiData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, tasksRes] = await Promise.all([
          fetch("/api/mentee/profile"),
          fetch("/api/student/tasks"),
        ]);

        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profileJson = await profileRes.json();
        setProfileData(profileJson.data as ProfileApiData);

        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json();
          if (Array.isArray(tasksJson)) {
            const sorted = [...tasksJson].sort((a, b) => {
              const timeA = new Date(a.createdAt ?? a.date).getTime();
              const timeB = new Date(b.createdAt ?? b.date).getTime();
              return timeB - timeA;
            });
            setTasks(sorted.slice(0, 5));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

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

  // Most recent task with a feedback note
  const latestFeedback = tasks.find(
    (t) =>
      t.feedback[0]?.feedbackNotes && t.feedback[0].feedbackNotes.trim() !== "",
  );

  return (
    <main className="min-h-screen bg-white px-2 py-4 text-slate-900 sm:px-4 md:px-5 lg:px-6">
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
          {/* ── HEADER ─────────────────────────────────────────── */}
          <div className="border-b border-[#E5E5E5] px-5 py-6 md:px-8 md:py-7 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-20 w-20 rounded-full border border-slate-200 shadow-sm">
                  <AvatarFallback className="bg-[#000053] text-lg font-bold text-white">
                    {getInitials(profile.fullName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name / email / badge */}
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
                    <Button
                      variant="outline"
                      className="h-auto rounded-full border-[#000053] bg-white px-4 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-[#000053] uppercase hover:bg-white"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      Share Profile
                    </Button>
                  </div>
                </div>

                {/* Batch / Projects / Mentor */}
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

          {/* ── BODY ───────────────────────────────────────────── */}
          <div className="px-5 md:px-8 lg:px-10">
            {/* Achievements — full width */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                Achievements &amp; Badges
              </h2>
              {badges.length === 0 ? (
                <p className="font-inter text-[11px] text-[#94A3B8]">
                  No badges earned yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:items-center md:gap-8">
                  {badges.map((b, idx) => (
                    <div key={b.id} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8FAFC]">
                        <span className={ICON_COLORS[idx % ICON_COLORS.length]}>
                          {badgeIcon(b.name)}
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

            {/* ── Status Indicators + Mentor Feedback ─────────── */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10 xl:gap-12">
                {/* Col 1: Status Indicators */}
                <div className="flex flex-col">
                  <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                    Status Indicators
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        label: "LOW",
                        rowClass:
                          "border-[#FEF08A] bg-[rgba(254,252,232,0.80)]",
                        dotClass: "bg-[#FACC15]",
                        textClass: "text-[#A16207]",
                      },
                      {
                        label: "MEDIUM",
                        rowClass:
                          "border-[#FFEDD5] bg-[rgba(255,247,237,0.50)] opacity-60",
                        dotClass: "bg-[#FDBA74]",
                        textClass: "text-[#FB923C]",
                      },
                      {
                        label: "SEVERE",
                        rowClass:
                          "border-[#FEE2E2] bg-[rgba(254,242,242,0.50)] opacity-60",
                        dotClass: "bg-[#FCA5A5]",
                        textClass: "text-[#F87171]",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3",
                          item.rowClass,
                        )}
                      >
                        <span
                          className={cn(
                            "h-2.5 w-2.5 flex-shrink-0 rounded-full",
                            item.dotClass,
                          )}
                        />
                        <p
                          className={cn(
                            "font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] uppercase",
                            item.textClass,
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-[#E5E5E5] pt-4">
                    <p className="font-inter text-[11px] leading-[17.88px] text-[#64748B]">
                      The status was updated by
                      {mentor ? ` ${mentor.fullName}` : " your mentor"}{" "}
                      following the last sprint review.
                    </p>
                  </div>
                </div>

                {/* Col 2: Latest Mentor Feedback */}
                <div className="flex flex-col">
                  <h3 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                    Latest Mentor Feedback
                  </h3>
                  {latestFeedback?.feedback[0]?.feedbackNotes ? (
                    <>
                      <p className="max-w-[55ch] font-inter text-sm font-medium leading-[22.75px] text-[#475569]">
                        &ldquo;{latestFeedback.feedback[0].feedbackNotes}&rdquo;
                      </p>
                      <p className="mt-4 font-inter text-[10px] font-bold leading-[15px] text-[#0F172A] uppercase">
                        {mentor
                          ? `— ${mentor.fullName.toUpperCase()}`
                          : "— MENTOR"}
                        {" · "}
                        {dayjs(latestFeedback.date).format("DD MMM YYYY")}
                      </p>
                    </>
                  ) : (
                    <p className="font-inter text-[11px] text-[#94A3B8]">
                      No mentor feedback recorded yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Latest Tasks — full width */}
              <div className="mt-8 border-t border-[#E5E5E5] pt-8">
                <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                  Latest Tasks
                </h2>
                {tasks.length === 0 ? (
                  <p className="font-inter text-[11px] text-[#94A3B8]">
                    No tasks logged yet.
                  </p>
                ) : (
                  <div className="flex flex-col">
                    {tasks.map((task, idx) => {
                      const isLast = idx === tasks.length - 1;
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
                        ? task.notes.slice(0, 80) +
                          (task.notes.length > 80 ? "…" : "")
                        : `Activity — ${dayjs(task.date).format("DD MMM YYYY")}`;
                      const description =
                        task.notes && task.notes.length > 80
                          ? task.notes.slice(80, 200)
                          : (task.feedback[0]?.feedbackNotes ?? "");
                      const submittedAt = dayjs(task.createdAt ?? task.date);
                      const timeLabel = submittedAt.isToday()
                        ? `TODAY, ${submittedAt.format("h:mm A")}`
                        : submittedAt
                            .format("MMM DD, YYYY · h:mm A")
                            .toUpperCase();

                      return (
                        <div key={task.id} className="flex items-start gap-4">
                          {/* Timeline dot + connector */}
                          <div className="relative flex w-8 flex-shrink-0 flex-col items-center">
                            <TaskDot status={effectiveStatus} />
                            {!isLast && (
                              <div
                                className="w-px flex-1 bg-[#E5E5E5]"
                                style={{ minHeight: "5rem" }}
                              />
                            )}
                          </div>

                          {/* Content */}
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
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Generate button */}
            <section className="flex justify-center py-7 lg:py-8">
              <Button className="rounded-lg bg-[#000053] px-8 py-3.5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.1em] text-white uppercase shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] hover:bg-[#000053]/90">
                <FileText className="mr-3 h-4 w-4" />
                Generate PDF Full Profile Report
              </Button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
