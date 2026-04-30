"use client";

import { useEffect, useState } from "react";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import {
  Award,
  Eye,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useGenerateMenteePDF } from "@/components/reports/useGenerateMenteePDF";

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

function getTaskStatus(task: Task) {
  const rawStatus = (task.feedback[0]?.status ?? task.status ?? "").toLowerCase();

  if (rawStatus === "accepted" || rawStatus === "approved") {
    return "approved";
  }

  if (rawStatus === "rejected") {
    return "rejected";
  }

  return "pending";
}

function getBadgeTierTooltip(badge: BadgeItem, index: number) {
  const tier = index + 1;
  const description = badge.description?.trim();

  if (description) {
    return `Tier ${tier}: ${description}`;
  }

  return `Tier ${tier}: This badge represents the ${tier} level of progress on the mentee journey.`;
}

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
      <div className="px-5 py-7 space-y-6 md:px-8 lg:px-10">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function MenteeProfilePage() {
  const [profileData, setProfileData] = useState<ProfileApiData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isExporting, generatePDF } = useGenerateMenteePDF();

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
  const projectNames = projects.map((project) => project.name).join(", ") || "—";
  const approvedTasks = tasks.filter((task) => getTaskStatus(task) === "approved");

  const latestFeedback = tasks.find(
    (task) =>
      task.feedback[0]?.feedbackNotes && task.feedback[0].feedbackNotes.trim() !== "",
  );

  return (
    <main className="min-h-screen bg-white px-2 py-4 text-slate-900 sm:px-4 md:px-5 lg:px-6">
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
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
                        profile.isActive ? "border-[#22C55E] bg-[#DCFCE7]" : "border-slate-300 bg-slate-100",
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

          <div className="px-5 md:px-8 lg:px-10">
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10 xl:gap-12">
                <div className="flex flex-col">
                  <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                    Status Indicators
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        label: "LOW",
                        rowClass: "border-[#FEF08A] bg-[rgba(254,252,232,0.80)]",
                        dotClass: "bg-[#FACC15]",
                        textClass: "text-[#A16207]",
                      },
                      {
                        label: "MEDIUM",
                        rowClass: "border-[#FFEDD5] bg-[rgba(255,247,237,0.50)] opacity-60",
                        dotClass: "bg-[#FDBA74]",
                        textClass: "text-[#FB923C]",
                      },
                      {
                        label: "SEVERE",
                        rowClass: "border-[#FEE2E2] bg-[rgba(254,242,242,0.50)] opacity-60",
                        dotClass: "bg-[#FCA5A5]",
                        textClass: "text-[#F87171]",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cn("flex items-center gap-3 rounded-lg border p-3", item.rowClass)}
                      >
                        <span className={cn("h-2.5 w-2.5 flex-shrink-0 rounded-full", item.dotClass)} />
                        <p className={cn("font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] uppercase", item.textClass)}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-[#E5E5E5] pt-4">
                    <p className="font-inter text-[11px] leading-[17.88px] text-[#64748B]">
                      The status was updated by{mentor ? ` ${mentor.fullName}` : " your mentor"} following the last sprint review.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                    Earned Badges
                  </h2>
                  {badges.length === 0 ? (
                    <p className="font-inter text-[11px] text-[#94A3B8]">
                      No badges earned yet.
                    </p>
                  ) : (
                    <TooltipProvider delayDuration={150}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {badges.map((badge, index) => (
                          <div
                            key={badge.id}
                            className="flex items-start justify-between gap-3 rounded-lg border border-[#E5E5E5] bg-[#F8FAFC] p-3"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-white">
                                <span className={ICON_COLORS[index % ICON_COLORS.length]}>
                                  {badgeIcon(badge.name)}
                                </span>
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#475569] uppercase">
                                  {badge.name}
                                </p>
                                <p className="mt-0.5 font-inter text-[9px] font-bold leading-[13.5px] tracking-[0.08em] text-[#94A3B8] uppercase">
                                  Tier {index + 1}
                                </p>
                              </div>
                            </div>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#D9E2F2] bg-white text-[#000053] transition hover:bg-[#EEF3FF]"
                                  aria-label={`View badge tier details for ${badge.name}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[220px] text-center">
                                {getBadgeTierTooltip(badge, index)}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className="mt-8 border-t border-[#E5E5E5] pt-8">
                <h3 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                  Latest Mentor Feedback
                </h3>
                {latestFeedback?.feedback[0]?.feedbackNotes ? (
                  <>
                    <p className="max-w-[55ch] font-inter text-sm font-medium leading-[22.75px] text-[#475569]">
                      &ldquo;{latestFeedback.feedback[0].feedbackNotes}&rdquo;
                    </p>
                    <p className="mt-4 font-inter text-[10px] font-bold leading-[15px] text-[#0F172A] uppercase">
                      {mentor ? `— ${mentor.fullName.toUpperCase()}` : "— MENTOR"}
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

              <div className="mt-8 border-t border-[#E5E5E5] pt-8">
                <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                  Latest Tasks
                </h2>
                {approvedTasks.length === 0 ? (
                  <p className="font-inter text-[11px] text-[#94A3B8]">
                    No approved tasks logged yet.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-[#E5E5E5]">
                        <thead className="bg-[#F8FAFC]">
                          <tr>
                            <th className="px-4 py-3 text-left font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                              Task
                            </th>
                            <th className="px-4 py-3 text-left font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                              Technologies
                            </th>
                            <th className="px-4 py-3 text-left font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                              Hours
                            </th>
                            <th className="px-4 py-3 text-left font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E5] bg-white">
                          {approvedTasks.map((task) => {
                            const title = task.notes
                              ? task.notes.slice(0, 80) + (task.notes.length > 80 ? "…" : "")
                              : `Activity — ${dayjs(task.date).format("DD MMM YYYY")}`;
                            const submittedAt = dayjs(task.createdAt ?? task.date);
                            const dateLabel = submittedAt.isToday()
                              ? `Today, ${submittedAt.format("h:mm A")}`
                              : submittedAt.format("DD MMM YYYY, h:mm A");

                            return (
                              <tr key={task.id} className="align-top">
                                <td className="whitespace-nowrap px-4 py-4 font-inter text-[11px] font-medium leading-[16.5px] text-[#64748B]">
                                  {dateLabel}
                                </td>
                                <td className="px-4 py-4">
                                  <p className="max-w-[26rem] font-inter text-sm font-bold leading-5 text-[#0F172A]">
                                    {title}
                                  </p>
                                  {task.notes && task.notes.length > 80 ? (
                                    <p className="mt-1 max-w-[26rem] font-inter text-[11px] leading-[16.5px] text-[#64748B]">
                                      {task.notes.slice(80, 200)}
                                    </p>
                                  ) : null}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex flex-wrap gap-1.5">
                                    {task.technologies.length > 0 ? (
                                      task.technologies.map((tech) => (
                                        <span
                                          key={tech}
                                          className="rounded-md border border-[#E5E5E5] bg-[#F8FAFC] px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] tracking-[-0.025em] text-[#64748B] uppercase"
                                        >
                                          {tech}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="font-inter text-[11px] text-[#94A3B8]">
                                        No technologies listed
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 font-inter text-[11px] font-semibold leading-[16.5px] text-[#0F172A]">
                                  {task.timeSpent}h
                                </td>
                                <td className="whitespace-nowrap px-4 py-4">
                                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] uppercase text-emerald-700">
                                    Approved
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="flex justify-center py-7 lg:py-8">
              <Button
                className="rounded-lg bg-[#000053] px-8 py-3.5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.1em] text-white uppercase shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] hover:bg-[#000053]/90"
                onClick={() => {
                  void generatePDF(profile.id);
                }}
                disabled={isExporting}
              >
                <FileText className="mr-3 h-4 w-4" />
                {isExporting ? "Generating PDF..." : "Generate PDF Full Profile Report"}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
