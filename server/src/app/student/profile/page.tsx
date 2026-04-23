import {
  FileBadge2,
  FileText,
  GraduationCap,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Student Profile",
  description: "Student profile page with achievements, tasks, and timeline",
};

export default function MenteeProfileUIPage() {
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
                  <AvatarImage
                    src="https://i.pravatar.cc/160?img=12"
                    alt="Alex Sterling"
                    className="h-full w-full object-cover object-center"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-500 text-lg font-bold text-white">
                    AS
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name / email / badges / meta */}
              <div className="flex flex-1 flex-col gap-4 md:gap-5">
                {/* Row 1: name+email + badge+button */}
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                  <div>
                    <h1 className="font-inter text-2xl font-extrabold leading-8 tracking-[-0.025em] text-[#0F172A] uppercase">
                      ALEX STERLING
                    </h1>
                    <p className="font-inter text-base font-medium leading-6 text-[#64748B]">
                      alex.sterling@logbook.org
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="rounded-full border border-[#22C55E] bg-[#DCFCE7] px-3 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-black uppercase">
                      Active Mentee
                    </Badge>
                    <Button
                      variant="outline"
                      className="h-auto rounded-md border-[#000053] bg-white px-4 py-1.5 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-[#000053] uppercase hover:bg-white"
                    >
                      Share Profile
                    </Button>
                  </div>
                </div>

                {/* Row 2: Batch / Projects / Mentor */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Batch Info
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                      Q3 ARCHIVAL-2024
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Assigned Projects
                    </p>
                    <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                      Digital Heritage v2, Legacy Indexing
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                      Mentor
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#000053] font-inter text-[8px] font-bold text-white">
                        SC
                      </span>
                      <p className="font-inter text-sm font-semibold leading-5 text-[#334155]">
                        Dr. Sarah Chen
                      </p>
                    </div>
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
              <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:items-center md:gap-8">
                {[
                  {
                    icon: <FileBadge2 className="h-4 w-4" />,
                    label: "FIRST COMMIT",
                    iconColor: "text-[#000053]",
                  },
                  {
                    icon: <Sparkles className="h-4 w-4" />,
                    label: "PROBLEM SOLVER",
                    iconColor: "text-[#f97316]",
                  },
                  {
                    icon: <GraduationCap className="h-4 w-4" />,
                    label: "CERTIFIED LOG",
                    iconColor: "text-[#0d9488]",
                  },
                  {
                    icon: <ShieldAlert className="h-4 w-4" />,
                    label: "TOP CONTRIBUTOR",
                    iconColor: "text-[#eab308]",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E5E5E5] bg-[#F8FAFC]">
                      <span className={item.iconColor}>{item.icon}</span>
                    </span>
                    <p className="font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#475569] uppercase">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── MAIN GRID: Status | Comment | Tasks ─────────── */}
            {/*
              Mobile  : stacked (1 col)
              lg      : 2 col  — [Status+Comment] | [Tasks]
              xl      : 3 col  — [Status] | [Comment] | [Tasks]
            */}
            <section className="border-b border-[#E5E5E5] py-7 lg:py-8">
              {/* Row 1: Status Indicators + Mentor Comment */}
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
                      The status was updated by Dr. Chen following the last
                      sprint review.
                    </p>
                  </div>
                </div>

                {/* Col 2: Mentor Comment */}
                <div className="flex flex-col">
                  <h3 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                    Latest Mentor Comment
                  </h3>
                  <p className="max-w-[55ch] font-inter text-sm font-medium leading-[22.75px] text-[#475569]">
                    &ldquo;Alex&apos;s work has been consistent, but we&apos;ve
                    noticed a slight dip in documentation detail over the last
                    two sprints. A yellow warning has been issued as a reminder
                    to maintain the high standards of reporting established
                    earlier in the project.&rdquo;
                  </p>
                  <p className="mt-4 font-inter text-[10px] font-bold leading-[15px] text-[#0F172A] uppercase">
                    — DR. SARAH CHEN
                  </p>
                </div>
              </div>

              {/* Row 2: Latest Tasks — full width */}
              <div className="mt-8 border-t border-[#E5E5E5] pt-8">
                <h2 className="mb-5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.15em] text-[#94A3B8] uppercase">
                  Latest Tasks
                </h2>
                <div className="flex flex-col">
                  {[
                    {
                      icon: "check-navy",
                      title: "Historical Data Set v4.2 Uploaded",
                      description:
                        "Complete scrub and indexing of all 2024 archive entries with full mapping schema.",
                      tags: ["PYTHON", "SQL", "AWS S3"],
                      time: "TODAY, 2:40 PM",
                      approver: "Dr. Sarah Chen",
                      approverBadgeClass: "bg-slate-400 text-white",
                      approverInitials: "SC",
                      isLast: false,
                    },
                    {
                      icon: "check-green",
                      title: "Preliminary Index Validation",
                      description:
                        "Core architecture validated for the legacy indexing engine. Metadata schema finalized.",
                      tags: ["POSTGRESQL", "REDIS"],
                      time: "OCT 12, 2024",
                      approver: "Marcus Thorne",
                      approverBadgeClass: "bg-[#000053] text-white",
                      approverInitials: "MT",
                      isLast: false,
                    },
                    {
                      icon: "dots",
                      title: "Performance Review Archive",
                      description:
                        "Archival process for sprint 05 feedback loops and mentor interaction logs.",
                      tags: ["JSON", "ELASTICSEARCH"],
                      time: "OCT 01, 2024",
                      approver: "Dr. Sarah Chen",
                      approverBadgeClass: "bg-slate-400 text-white",
                      approverInitials: "SC",
                      isLast: true,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      {/* Timeline dot + connector */}
                      <div className="relative flex w-8 flex-shrink-0 flex-col items-center">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full border",
                            item.icon === "check-navy" &&
                              "border-[#E5E5E5] bg-[#F8FAFC]",
                            item.icon === "check-green" &&
                              "border-[#BBF7D0] bg-[#F0FDF4]",
                            item.icon === "dots" &&
                              "border-[#E5E5E5] bg-[#F8FAFC]",
                          )}
                        >
                          {item.icon === "check-navy" && (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path
                                d="M7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.3125 0 9.08125 0.11875 9.80625 0.35625C10.5312 0.59375 11.2 0.925 11.8125 1.35L10.725 2.45625C10.25 2.15625 9.74375 1.92188 9.20625 1.75312C8.66875 1.58437 8.1 1.5 7.5 1.5C5.8375 1.5 4.42188 2.08437 3.25312 3.25312C2.08437 4.42188 1.5 5.8375 1.5 7.5C1.5 9.1625 2.08437 10.5781 3.25312 11.7469C4.42188 12.9156 5.8375 13.5 7.5 13.5C9.1625 13.5 10.5781 12.9156 11.7469 11.7469C12.9156 10.5781 13.5 9.1625 13.5 7.5C13.5 7.275 13.4875 7.05 13.4625 6.825C13.4375 6.6 13.4 6.38125 13.35 6.16875L14.5688 4.95C14.7063 5.35 14.8125 5.7625 14.8875 6.1875C14.9625 6.6125 15 7.05 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM6.45 10.95L3.2625 7.7625L4.3125 6.7125L6.45 8.85L13.95 1.33125L15 2.38125L6.45 10.95Z"
                                fill="#000053"
                              />
                            </svg>
                          )}
                          {item.icon === "check-green" && (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path
                                d="M6.45 10.95L11.7375 5.6625L10.6875 4.6125L6.45 8.85L4.3125 6.7125L3.2625 7.7625L6.45 10.95ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM7.5 13.5C9.175 13.5 10.5938 12.9188 11.7563 11.7563C12.9188 10.5938 13.5 9.175 13.5 7.5C13.5 5.825 12.9188 4.40625 11.7563 3.24375C10.5938 2.08125 9.175 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9188 5.825 13.5 7.5 13.5Z"
                                fill="#22C55E"
                              />
                            </svg>
                          )}
                          {item.icon === "dots" && (
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path
                                d="M3.75 8.625C4.0625 8.625 4.32812 8.51562 4.54688 8.29688C4.76562 8.07812 4.875 7.8125 4.875 7.5C4.875 7.1875 4.76562 6.92188 4.54688 6.70312C4.32812 6.48438 4.0625 6.375 3.75 6.375C3.4375 6.375 3.17188 6.48438 2.95312 6.70312C2.73438 6.92188 2.625 7.1875 2.625 7.5C2.625 7.8125 2.73438 8.07812 2.95312 8.29688C3.17188 8.51562 3.4375 8.625 3.75 8.625ZM7.5 8.625C7.8125 8.625 8.07812 8.51562 8.29688 8.29688C8.51562 8.07812 8.625 7.8125 8.625 7.5C8.625 7.1875 8.51562 6.92188 8.29688 6.70312C8.07812 6.48438 7.8125 6.375 7.5 6.375C7.1875 6.375 6.92188 6.48438 6.70312 6.70312C6.48438 6.92188 6.375 7.1875 6.375 7.5C6.375 7.8125 6.48438 8.07812 6.70312 8.29688C6.92188 8.51562 7.1875 8.625 7.5 8.625ZM11.25 8.625C11.5625 8.625 11.8281 8.51562 12.0469 8.29688C12.2656 8.07812 12.375 7.8125 12.375 7.5C12.375 7.1875 12.2656 6.92188 12.0469 6.70312C11.8281 6.48438 11.5625 6.375 11.25 6.375C10.9375 6.375 10.6719 6.48438 10.4531 6.70312C10.2344 6.92188 10.125 7.1875 10.125 7.5C10.125 7.8125 10.2344 8.07812 10.4531 8.29688C10.6719 8.51562 10.9375 8.625 11.25 8.625ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM7.5 13.5C9.175 13.5 10.5938 12.9188 11.7563 11.7563C12.9188 10.5938 13.5 9.175 13.5 7.5C13.5 5.825 12.9188 4.40625 11.7563 3.24375C10.5938 2.08125 9.175 1.5 7.5 1.5C5.825 1.5 4.40625 2.08125 3.24375 3.24375C2.08125 4.40625 1.5 5.825 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9188 5.825 13.5 7.5 13.5Z"
                                fill="#94A3B8"
                              />
                            </svg>
                          )}
                        </div>
                        {!item.isLast && (
                          <div
                            className="w-px flex-1 bg-[#E5E5E5]"
                            style={{ minHeight: "5rem" }}
                          />
                        )}
                      </div>

                      {/* Task content */}
                      <div className="flex flex-1 flex-col gap-1 pb-8">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-inter text-sm font-bold leading-5 text-[#0F172A]">
                            {item.title}
                          </h3>
                          <p className="flex-shrink-0 font-inter text-[10px] font-bold leading-[15px] tracking-[0.1em] text-[#94A3B8] uppercase">
                            {item.time}
                          </p>
                        </div>
                        <p className="font-inter text-[11px] leading-[16.5px] text-[#64748B]">
                          {item.description}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-[#E5E5E5] bg-[#F8FAFC] px-2 py-0.5 font-inter text-[9px] font-bold leading-[13.5px] tracking-[-0.025em] text-[#64748B] uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="flex flex-col items-end">
                              <p className="font-inter text-[9px] font-bold leading-[13.5px] text-[#94A3B8] uppercase">
                                Approved By
                              </p>
                              <p className="font-inter text-[10px] font-bold leading-[15px] text-[#0F172A]">
                                {item.approver}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full font-inter text-[9px] font-bold",
                                item.approverBadgeClass,
                              )}
                            >
                              {item.approverInitials}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* end Latest Tasks */}
            </section>

            {/* Generate button */}
            <section className="flex justify-center py-7 lg:py-8">
              <Button className="rounded-lg bg-[#000053] px-8 py-3.5 font-inter text-[11px] font-bold leading-[16.5px] tracking-[0.1em] text-white uppercase shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] hover:bg-[#000053]/90">
                <FileText className="mr-3 h-4 w-4" />
                Generate PDF Full Profile Report
              </Button>
            </section>
          </div>
          {/* end body */}
        </div>
      </div>
    </main>
  );
}
