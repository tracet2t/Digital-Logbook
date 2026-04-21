import { FileBadge2, FileText, GraduationCap, Pencil, ShieldAlert, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Student Profile",
  description: "Student profile page with achievements, tasks, and timeline",
};

export default function MenteeProfileUIPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-2 py-4 text-slate-900 xs:px-3 sm:px-6 sm:py-8 lg:px-10 xl:px-14 2xl:px-20">
      <div className="mx-auto w-full max-w-[96rem]">
        <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          <section className="border-b border-slate-200 bg-white">
            {/* Blue top bar */}
            <div className="h-1.5 w-full bg-blue-400 sm:h-2" />

            <div className="px-3 py-4 xs:px-4 sm:px-6 sm:py-5 lg:px-8 xl:px-10 2xl:px-12">
              {/* Header with avatar, name, and buttons */}
              <div className="flex flex-col gap-4 xs:gap-5 sm:gap-6">
                {/* Main header row: Avatar + Name/Email + Buttons */}
                <div className="flex flex-wrap items-start gap-3 xs:gap-4 sm:gap-5 justify-between">
                  <div className="flex items-start gap-3 xs:gap-4 sm:gap-5 flex-1">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-20 w-20 border border-slate-200 shadow-sm xs:h-24 xs:w-24 sm:h-28 sm:w-28 md:h-[7rem] md:w-[7rem]">
                        <AvatarImage
                          src="https://i.pravatar.cc/160?img=12"
                          alt="Alex Sterling"
                          className="h-full w-full object-cover object-center"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-500 text-lg font-bold text-white xs:text-xl sm:text-2xl md:text-3xl">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 xs:h-4 xs:w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 xs:gap-2">
                        <h1 className="text-lg font-bold leading-tight text-slate-900 xs:text-xl sm:text-2xl sm:font-extrabold md:text-3xl">
                          ALEX STERLING
                        </h1>
                        <Pencil className="h-3.5 w-3.5 flex-shrink-0 text-slate-400 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 xs:mt-1 xs:text-sm sm:text-base">
                        alex.sterling@logbook.org
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row flex-wrap items-center gap-2 flex-shrink-0 sm:justify-end">
                    <Badge className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-center text-[0.42rem] font-bold uppercase tracking-[0.1em] text-slate-600 xs:px-2.5 xs:py-1 xs:text-[0.45rem] sm:px-3 sm:py-1.5 sm:text-[0.5rem]">
                      Active Mentee
                    </Badge>
                    <Button
                      variant="outline"
                      className="rounded-md border-slate-400 bg-white px-2 py-0.5 text-[0.42rem] font-bold uppercase tracking-[0.08em] text-slate-700 hover:bg-white hover:border-slate-500 xs:px-2.5 xs:py-1 xs:text-[0.45rem] sm:px-3 sm:py-1.5 sm:text-[0.5rem]">
                      Share Profile
                    </Button>
                  </div>
                </div>

                {/* Batch, Projects, Mentor info row */}
                <div className="grid grid-cols-3 gap-2 pt-3 xs:gap-4 xs:pt-4 sm:gap-6 lg:gap-8">
                  <div>
                    <p className="text-[0.45rem] font-black uppercase tracking-[0.12em] text-slate-400 xs:text-[0.5rem] xs:tracking-[0.16em] sm:text-[0.55rem] sm:tracking-[0.18em]">
                      Batch Info
                    </p>
                    <p className="mt-1 text-xs font-black text-slate-900 xs:text-sm sm:text-base">
                      Q3 ARCHIVAL-2024
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.45rem] font-black uppercase tracking-[0.12em] text-slate-400 xs:text-[0.5rem] xs:tracking-[0.16em] sm:text-[0.55rem] sm:tracking-[0.18em]">
                      Assigned Projects
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-black text-slate-900 xs:text-sm sm:text-base">
                      Digital Heritage v2, Legacy Indexing
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.45rem] font-black uppercase tracking-[0.12em] text-slate-400 xs:text-[0.5rem] xs:tracking-[0.16em] sm:text-[0.55rem] sm:tracking-[0.18em]">
                      Mentor
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 xs:gap-2">
                      <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#0a1a68] text-[0.4rem] font-bold uppercase text-white xs:h-5 xs:w-5 xs:text-[0.45rem] sm:h-6 sm:w-6 sm:text-[0.5rem]">
                        sc
                      </span>
                      <p className="text-xs font-black text-slate-900 xs:text-sm sm:text-base">
                        Dr. Sarah Chen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-4 p-2 xs:space-y-6 xs:p-3 sm:p-6 lg:p-8 xl:p-10 2xl:p-12">
            <section>
              <h2 className="text-[0.64rem] font-black uppercase tracking-[0.24em] text-slate-400">
                Achievements &amp; Badges
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 xs:gap-x-6 sm:gap-x-8 lg:gap-x-10">
                {[
                  {
                    icon: <FileBadge2 className="h-3.5 w-3.5" />,
                    label: "FIRST COMMIT",
                    iconColor: "text-[#0f1f74]",
                  },
                  {
                    icon: <Sparkles className="h-3.5 w-3.5" />,
                    label: "PROBLEM SOLVER",
                    iconColor: "text-[#f97316]",
                  },
                  {
                    icon: <GraduationCap className="h-3.5 w-3.5" />,
                    label: "CERTIFIED LOG",
                    iconColor: "text-[#0ea5a8]",
                  },
                  {
                    icon: <ShieldAlert className="h-3.5 w-3.5" />,
                    label: "TOP CONTRIBUTOR",
                    iconColor: "text-[#eab308]",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-100">
                      <span className={item.iconColor}>{item.icon}</span>
                    </span>
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-600">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-200 pt-4 xs:pt-6">
              <div className="mb-4 grid gap-4 xs:mb-6 xs:gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8 xl:gap-10">
                <div>
                  <h2 className="mb-3 text-[0.56rem] font-black uppercase tracking-[0.2em] text-slate-400 xs:mb-5 xs:text-[0.64rem] xs:tracking-[0.24em]">
                    Status Indicators
                  </h2>

                  <div className="space-y-2.5">
                    {[
                      {
                        label: "LOW",
                        rowClass: "border-yellow-300 bg-yellow-50/40",
                        dotClass: "bg-yellow-400",
                        textClass: "text-yellow-700",
                      },
                      {
                        label: "MEDIUM",
                        rowClass: "border-orange-200 bg-orange-50/30",
                        dotClass: "bg-orange-300",
                        textClass: "text-orange-400",
                      },
                      {
                        label: "SEVERE",
                        rowClass: "border-rose-200 bg-rose-50/30",
                        dotClass: "bg-rose-300",
                        textClass: "text-rose-400",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "flex h-8 items-center gap-3 rounded-md border px-3",
                          item.rowClass,
                        )}
                      >
                        <span className={cn("h-2.5 w-2.5 rounded-full", item.dotClass)} />
                        <p className={cn("text-[0.62rem] font-bold uppercase tracking-[0.16em]", item.textClass)}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-6 text-[0.72rem] text-slate-500">
                    The status was updated by Dr. Chen following the last sprint review.
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-[0.56rem] font-black uppercase tracking-[0.2em] text-slate-400 xs:mb-5 xs:text-[0.64rem] xs:tracking-[0.24em]">
                    Latest Mentor Comment
                  </h3>
                  <p className="text-4xl leading-none text-slate-300">&ldquo;</p>
                  <p className="-mt-2 max-w-[38rem] text-[1.03rem] italic leading-8 text-slate-600">
                    Alex&apos;s work has been consistent, but we&apos;ve noticed a slight dip in documentation detail over the last two sprints. A yellow warning has been issued as a reminder to maintain the high standards of reporting established earlier in the project.
                  </p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.06em] text-slate-800">
                    - Dr. Sarah Chen
                  </p>
                </div>
              </div>
            </section>

            <section className="border-y border-slate-200 py-4 xs:py-6 lg:py-7">
              <h2 className="text-[0.56rem] font-black uppercase tracking-[0.2em] text-slate-400 xs:text-[0.64rem] xs:tracking-[0.24em]">
                Latest Tasks
              </h2>

              <div className="relative mt-4 pl-6 xs:mt-6 xs:pl-8 sm:pl-10">
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-200" />

                <div className="space-y-8">
                  {[
                    {
                      dotWrapClass: "border-slate-300 bg-slate-100",
                      dotClass: "text-[#1f2d84]",
                      dotSymbol: "✓",
                      title: "Historical Data Set v4.2 Uploaded",
                      description: "Complete scrub and indexing of all 2024 archive entries with full mapping schema.",
                      tags: ["PYTHON", "SQL", "AWS S3"],
                      time: "Today, 2:40 PM",
                      approver: "Dr. Sarah Chen",
                      approverBadgeClass: "bg-slate-400 text-white",
                      approverInitials: "SC",
                    },
                    {
                      dotWrapClass: "border-emerald-200 bg-emerald-50",
                      dotClass: "text-emerald-600",
                      dotSymbol: "✓",
                      title: "Preliminary Index Validation",
                      description: "Core architecture validated for the legacy indexing engine. Metadata schema finalized.",
                      tags: ["POSTGRESQL", "REDIS"],
                      time: "Oct 12, 2024",
                      approver: "Marcus Thorne",
                      approverBadgeClass: "bg-[#0a1a68] text-white",
                      approverInitials: "MT",
                    },
                    {
                      dotWrapClass: "border-slate-300 bg-slate-100",
                      dotClass: "text-slate-400",
                      dotSymbol: "-",
                      title: "Performance Review Archive",
                      description: "Archival process for sprint 05 feedback loops and mentor interaction logs.",
                      tags: ["JSON", "ELASTICSEARCH"],
                      time: "Oct 01, 2024",
                      approver: "Dr. Sarah Chen",
                      approverBadgeClass: "bg-slate-400 text-white",
                      approverInitials: "SC",
                    },
                  ].map((item) => (
                    <div key={item.title} className="relative grid gap-3 xs:gap-4 md:grid-cols-[1fr_auto] md:items-start md:gap-6 lg:gap-8">
                      <div className={cn("absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full border text-[0.6rem] font-bold xs:-left-8 xs:h-5 xs:w-5 xs:text-[0.7rem]", item.dotWrapClass, item.dotClass)}>
                        {item.dotSymbol}
                      </div>

                      <div>
                        <h3 className="text-base font-black leading-tight tracking-[-0.01em] text-slate-900 xs:text-lg sm:text-[1.37rem] md:text-[1.42rem]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 xs:mt-1.5 xs:text-sm">
                          {item.description}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.08em] text-slate-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-left md:text-right md:min-w-[12rem]">
                        <p className="text-[0.5rem] font-black uppercase tracking-[0.18em] text-slate-400 xs:text-[0.58rem] xs:tracking-[0.2em]">
                          {item.time}
                        </p>
                        <div className="mt-1 flex items-center justify-start gap-1.5 xs:mt-2 xs:gap-2 md:justify-end">
                          <div>
                            <p className="text-[0.55rem] font-black text-slate-800 xs:text-[0.62rem]">
                              {item.approver}
                            </p>
                            <p className="text-[0.45rem] font-black uppercase tracking-[0.14em] text-slate-400 xs:text-[0.52rem] xs:tracking-[0.16em]">
                              Approved By
                            </p>
                          </div>
                          <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-[0.55rem] font-bold", item.approverBadgeClass)}>
                            {item.approverInitials}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex justify-center pt-3 xs:pt-4 sm:pt-6">
              <Button className="h-9 w-full rounded-md bg-[#050b73] px-4 text-[0.55rem] font-black uppercase tracking-[0.14em] text-white shadow-[0_6px_16px_rgba(5,11,115,0.3)] hover:bg-[#040860] xs:h-10 xs:px-5 xs:text-[0.6rem] sm:h-11 sm:px-7 sm:text-[0.64rem] sm:tracking-[0.16em] sm:shadow-[0_8px_18px_rgba(5,11,115,0.35)] sm:w-auto">
                <FileText className="mr-1.5 h-3 w-3 xs:mr-2 xs:h-3.5 xs:w-3.5" />
                Generate PDF Full Profile Report
              </Button>
            </section>
          </div>
        </div>

      </div>
    </main>
  );
}
