import { ChevronRight, FileBadge2, GraduationCap, ScrollText, ShieldAlert, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Student Profile",
  description: "Student profile page with achievements, tasks, and timeline",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-l-4 border-blue-400 pl-4">
      <h2 className="text-sm font-black uppercase tracking-[0.28em] text-slate-900">
        {children}
      </h2>
    </div>
  );
}

export default function MenteeProfileUIPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-3 py-5 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border-2 border-blue-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] overflow-hidden">
          <section className="border-b border-dashed border-blue-300 bg-[#f3f5f8]">
            <div className="h-20 w-full bg-[#02066f] sm:h-24" />

            <div className="px-4 pb-6 sm:px-6 lg:px-8">
              <div className="-mt-10 grid items-center gap-4 sm:-mt-9 md:grid-cols-[auto,minmax(0,1fr)] md:gap-5">
                <div className="relative mx-auto sm:mx-0">
                  <Avatar className="h-20 w-20 ring-4 ring-[#e9edf2] shadow-lg sm:h-24 sm:w-24 md:h-28 md:w-28">
                    <AvatarImage
                      src="https://i.pravatar.cc/160?img=12"
                      alt="Alex Sterling"
                      className="h-full w-full object-cover object-center grayscale"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-500 text-2xl font-bold text-white">
                      AS
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-[#f3f5f8] bg-emerald-500" />
                </div>

                <div className="min-w-0 pt-6 text-center sm:pt-8 md:pt-14 md:text-left">
                  <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
                    <h1 className="text-[1.45rem] font-black leading-none tracking-[-0.02em] text-slate-900 sm:text-[1.7rem] md:text-[2.05rem]">
                      ALEX STERLING
                    </h1>

                    <Badge className="relative z-20 h-6 shrink-0 rounded-full border border-[#02066f] bg-white px-3 text-[0.55rem] font-extrabold uppercase tracking-[0.18em] text-[#02066f] shadow-sm hover:bg-slate-50">
                      Active Mentee
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm font-medium leading-none text-slate-500 sm:text-base md:text-lg">
                    alex.sterling@logbook.org
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-300" />

              <div className="mt-5 grid gap-6 text-center md:grid-cols-3 md:gap-8 md:text-left">
                <div>
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-slate-400">
                    Batch Info
                  </p>
                  <p className="mt-1.5 text-base font-black leading-tight text-slate-900 sm:text-lg md:text-[1.15rem]">
                    Q3 ARCHIVAL-2024
                  </p>
                </div>
                <div>
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-slate-400">
                    Assigned Projects
                  </p>
                  <p className="mt-1.5 text-base font-black leading-tight text-slate-900 sm:text-lg md:text-[1.15rem]">
                    Digital Heritage v2, Legacy Indexing
                  </p>
                </div>
                <div>
                  <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-slate-400">
                    Mentor
                  </p>
                  <p className="mt-1.5 text-base font-black leading-tight text-slate-900 sm:text-lg md:text-[1.15rem]">
                    Dr. Sarah Chen
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-6 p-3 sm:p-6 lg:p-8">
            <section>
              <SectionLabel>Achievements</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    icon: <FileBadge2 className="h-6 w-6" />,
                    label: "FIRST COMMIT",
                    bgColor: "bg-blue-900",
                    iconColor: "text-white",
                  },
                  {
                    icon: <ShieldAlert className="h-6 w-6" />,
                    label: "PROBLEM SOLVER",
                    bgColor: "bg-rose-200",
                    iconColor: "text-rose-600",
                  },
                  {
                    icon: <GraduationCap className="h-6 w-6" />,
                    label: "CERTIFIED LOG",
                    bgColor: "bg-cyan-200",
                    iconColor: "text-cyan-600",
                  },
                  {
                    icon: <Sparkles className="h-6 w-6" />,
                    label: "TOP CONTRIBUTOR",
                    bgColor: "bg-yellow-300",
                    iconColor: "text-yellow-600",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                  >
                    <div className={cn("flex h-20 w-20 items-center justify-center rounded-full", item.bgColor)}>
                      <div className={item.iconColor}>
                        {item.icon}
                      </div>
                    </div>
                    <p className="text-center text-xs font-black uppercase tracking-[0.25em] text-slate-900">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-3 border-l-4 border-blue-400 pl-4">
                <h2 className="text-sm font-black uppercase tracking-[0.28em] text-slate-900">
                  Completed Tasks
                </h2>
              </div>
              
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-50">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-white">
                      <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.22em] text-slate-500 sm:px-6 sm:py-4">
                        Task Detail
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500 sm:px-6 sm:py-4">
                        Deadline
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.22em] text-slate-500 sm:px-6 sm:py-4">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.22em] text-slate-500 sm:px-6 sm:py-4">
                        
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        title: "Metadata Scrubbing: Heritage Vol 1",
                        subtitle: "Log Entry #202",
                        deadline: "Oct 12, 2024",
                        status: "IN PROGRESS",
                        statusColor: "border-cyan-500 text-cyan-600 bg-cyan-50",
                      },
                      {
                        title: "Database Schema Mapping",
                        subtitle: "Blueprint Phase",
                        deadline: "Oct 15, 2024",
                        status: "PENDING REVIEW",
                        statusColor: "border-red-500 text-red-600 bg-red-50",
                      },
                    ].map((task, idx) => (
                      <tr key={idx} className="border-b border-slate-200 bg-white transition hover:bg-slate-50">
                        <td className="px-4 py-4 sm:px-6 sm:py-5">
                          <p className="font-bold text-slate-900">{task.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{task.subtitle}</p>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-slate-600 sm:px-6 sm:py-5">
                          {task.deadline}
                        </td>
                        <td className="px-4 py-4 text-center sm:px-6 sm:py-5">
                          <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]", task.statusColor)}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right sm:px-6 sm:py-5">
                          <ChevronRight className="inline h-5 w-5 text-slate-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="border-t-4 border-blue-300 pt-6">
              <div className="mb-6 grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
                {/* Status Indicators Column */}
                <div className="space-y-2">
                  <h2 className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-slate-900">
                    Status Indicators
                  </h2>
                  <div className="space-y-2">
                    {[
                      { label: "LOW", color: "border-l-4 border-yellow-400 bg-yellow-50" },
                      { label: "MEDIUM", color: "border-l-4 border-orange-400 bg-orange-50" },
                      { label: "SEVERE", color: "border-l-4 border-rose-400 bg-rose-50" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={cn("flex items-center gap-3 rounded-lg px-4 py-3", item.color)}
                      >
                        <div className={cn(
                          "h-3 w-3 rounded-full",
                          item.label === "LOW" ? "bg-yellow-500" :
                          item.label === "MEDIUM" ? "bg-orange-500" :
                          "bg-rose-500"
                        )} />
                        <p className={cn(
                          "text-xs font-bold uppercase tracking-[0.2em]",
                          item.label === "LOW" ? "text-yellow-700" :
                          item.label === "MEDIUM" ? "text-orange-700" :
                          "text-rose-700"
                        )}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latest Mentor Comment Column */}
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Latest Mentor Comment
                  </h3>
                  <div className="flex gap-3">
                    <ScrollText className="h-5 w-5 shrink-0 text-slate-300 mt-1" />
                    <div>
                      <p className="text-sm leading-6 italic text-slate-600">
                        &quot;Alex&apos;s work has been consistent, but we&apos;ve noticed a slight dip in documentation detail over the last two sprints. A yellow warning has been issued as a reminder to maintain the high standards of reporting established earlier in the project.&quot;
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                          SC
                        </div>
                        <p className="text-sm font-bold text-slate-900">Dr. Sarah Chen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t-4 border-blue-300 pt-6">
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-sm font-black uppercase tracking-[0.28em] text-slate-900">
                  Project Milestone Timeline
                </h2>
              </div>
              
              <div className="relative pl-8 sm:pl-10">
                {/* Vertical line */}
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-gradient-to-b from-blue-900 via-emerald-500 to-slate-300" />

                <div className="space-y-8">
                  {[
                    {
                      label: "TASK SUBMISSION",
                      labelColor: "text-blue-900",
                      dotColor: "bg-blue-900",
                      title: "Historical Data Set v4.2 Uploaded",
                      description: "324 entries indexed with full relational mapping.",
                      time: "2h ago",
                    },
                    {
                      label: "APPROVAL",
                      labelColor: "text-emerald-600",
                      dotColor: "bg-emerald-500",
                      title: "Preliminary Index Validated",
                      description: "Mentor Sarah Chen approved the core structure.",
                      time: "Yesterday",
                    },
                    {
                      label: "FEEDBACK LOOP",
                      labelColor: "text-slate-400",
                      dotColor: "bg-slate-300",
                      title: "Performance Review Complete",
                      description: "Detailed notes added to performance archive.",
                      time: "Oct 01",
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Dot */}
                      <div className={cn("absolute -left-11 top-1 h-5 w-5 rounded-full border-4 border-white sm:-left-12", item.dotColor)} />
                      
                      {/* Content */}
                      <div className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="flex-1">
                          <p className={cn("text-xs font-bold uppercase tracking-[0.24em]", item.labelColor)}>
                            {item.label}
                          </p>
                          <h3 className="mt-2 text-base font-bold text-slate-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>
                        <div className="min-w-fit text-left sm:text-right">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex justify-center pt-2">
              <Button className="h-11 w-full rounded-xl bg-blue-900 px-7 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(30,58,138,0.35)] hover:bg-blue-950 sm:w-auto">
                Generate Full Profile Report
              </Button>
            </section>
          </div>
        </div>

        <p className="mt-4 text-center text-[0.68rem] font-semibold uppercase tracking-[0.38em] text-slate-400">
          Standalone shadcn mentee profile showcase
        </p>
      </div>
    </main>
  );
}
