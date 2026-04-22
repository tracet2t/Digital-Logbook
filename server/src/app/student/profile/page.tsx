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
  const sectionDividerClass = "border-slate-200";
  const horizontalDividerClass = "h-px w-full bg-slate-200";
  const contentBleedClass = "-mx-5 sm:-mx-8 lg:-mx-10 px-5 sm:px-8 lg:px-10";

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-900 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.08)] sm:rounded-2xl">
          <section className={cn("border-b bg-white", sectionDividerClass)}>
            {/* Header separator line */}
            <div className={horizontalDividerClass} />

            <div className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-7">
              {/* Header with avatar, name, and buttons */}
              <div className="flex flex-col gap-5 sm:gap-6">
                {/* Main header row: Avatar + Name/Email + Buttons */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 items-start gap-4 sm:gap-5 lg:flex-1">
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-20 w-20 border border-slate-200 shadow-sm sm:h-24 sm:w-24 lg:h-28 lg:w-28">
                        <AvatarImage
                          src="https://i.pravatar.cc/160?img=12"
                          alt="Alex Sterling"
                          className="h-full w-full object-cover object-center"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-500 text-lg font-bold text-white sm:text-xl lg:text-2xl">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 sm:h-4 sm:w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <h1 className="text-xl font-extrabold leading-tight text-slate-900 sm:text-2xl lg:text-[2rem]">
                          ALEX STERLING
                        </h1>
                        <Pencil className="h-4 w-4 flex-shrink-0 text-slate-400 sm:h-5 sm:w-5" />
                      </div>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        alex.sterling@logbook.org
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
                    <Badge className="rounded-full border border-slate-300 bg-slate-50 px-2.5 py-1 text-center text-[0.7rem] font-bold uppercase tracking-[0.08em] text-slate-600 sm:px-3 sm:py-1.5 sm:text-[0.78rem]">
                      Active Mentee
                    </Badge>
                    <Button
                      variant="outline"
                      className="rounded-md border-slate-400 bg-white px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-slate-700 hover:border-slate-500 hover:bg-white sm:px-3 sm:py-1.5 sm:text-[0.78rem]">
                      Share Profile
                    </Button>
                  </div>
                </div>

                {/* Batch, Projects, Mentor info row */}
                <div className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-8">
                  <div>
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-slate-400 sm:text-[0.7rem] sm:tracking-[0.12em]">
                      Batch Info
                    </p>
                    <p className="mt-1 text-xs font-black text-slate-900 xs:text-sm sm:text-base">
                      Q3 ARCHIVAL-2024
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-slate-400 sm:text-[0.7rem] sm:tracking-[0.12em]">
                      Assigned Projects
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs font-black text-slate-900 xs:text-sm sm:text-base">
                      Digital Heritage v2, Legacy Indexing
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-slate-400 sm:text-[0.7rem] sm:tracking-[0.12em]">
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

          <div className="space-y-0 px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
            <section className="pb-6 lg:pb-8">
              <h2 className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-[0.8rem]">
                Achievements &amp; Badges
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                  <div key={item.label} className="flex min-h-11 items-center gap-3 rounded-md border border-slate-200 px-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-100">
                      <span className={item.iconColor}>{item.icon}</span>
                    </span>
                    <p className="text-[0.74rem] font-black uppercase tracking-[0.12em] text-slate-600 sm:text-[0.8rem]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className={cn("border-t py-6 lg:py-8", sectionDividerClass, contentBleedClass)}>
              <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
                <div>
                  <h2 className="mb-4 text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-400 sm:text-[0.8rem]">
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
                        <p className={cn("text-[0.72rem] font-bold uppercase tracking-[0.12em]", item.textClass)}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-[0.72rem] text-slate-500">
                    The status was updated by Dr. Chen following the last sprint review.
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-400 sm:text-[0.8rem]">
                    Latest Mentor Comment
                  </h3>
                  <p className="text-4xl leading-none text-slate-300">&ldquo;</p>
                  <p className="-mt-2 max-w-[38rem] text-[0.95rem] italic leading-7 text-slate-600 sm:text-[1rem] sm:leading-8">
                    Alex&apos;s work has been consistent, but we&apos;ve noticed a slight dip in documentation detail over the last two sprints. A yellow warning has been issued as a reminder to maintain the high standards of reporting established earlier in the project.
                  </p>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.06em] text-slate-800">
                    - Dr. Sarah Chen
                  </p>
                </div>
              </div>
            </section>

            <section className={cn("border-y py-6 lg:py-8", sectionDividerClass, contentBleedClass)}>
              <h2 className="text-[0.7rem] font-black uppercase tracking-[0.14em] text-slate-400 sm:text-[0.8rem]">
                Latest Tasks
              </h2>

              <div className="relative mt-5 pl-7 sm:mt-6 sm:pl-10">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />

                <div className="space-y-7">
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
                    <div key={item.title} className="relative grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-8">
                      <div className={cn("absolute left-[-1.75rem] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border text-[0.6rem] font-bold sm:left-[-2.1rem] sm:h-5 sm:w-5 sm:text-[0.7rem]", item.dotWrapClass, item.dotClass)}>
                        {item.dotSymbol}
                      </div>

                      <div>
                        <h3 className="text-base font-black leading-tight tracking-[-0.01em] text-slate-900 sm:text-lg md:text-[1.28rem]">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                          {item.description}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.06em] text-slate-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-left lg:min-w-[12rem] lg:text-right">
                        <p className="text-[0.62rem] font-black uppercase tracking-[0.12em] text-slate-400 sm:text-[0.68rem]">
                          {item.time}
                        </p>
                        <div className="mt-2 flex items-center justify-start gap-2 lg:justify-end">
                          <div>
                            <p className="text-[0.68rem] font-black text-slate-800 sm:text-[0.74rem]">
                              {item.approver}
                            </p>
                            <p className="text-[0.6rem] font-black uppercase tracking-[0.1em] text-slate-400 sm:text-[0.66rem]">
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

            <section className="flex justify-center pt-6">
              <Button className="h-10 w-full rounded-md bg-[#050b73] px-4 text-[0.64rem] font-black uppercase tracking-[0.12em] text-white shadow-[0_6px_16px_rgba(5,11,115,0.3)] hover:bg-[#040860] sm:w-auto sm:px-6 md:h-11 md:px-7 md:text-[0.68rem] md:tracking-[0.14em] md:shadow-[0_8px_18px_rgba(5,11,115,0.35)]">
                <FileText className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-3.5 sm:w-3.5" />
                Generate PDF Full Profile Report
              </Button>
            </section>
          </div>
        </div>

      </div>
    </main>
  );
}
