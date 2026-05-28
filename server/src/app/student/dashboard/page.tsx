"use client";

import { useState } from "react";

import { useMenteeDashboard } from "@/_hooks/mentee";
import { useIsMobile } from "@/_hooks/use-mobile";
import { CheckCircle2, Clock, Eye, ListChecks } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminPagination,
  AdminStatusBadge,
  PageHeader,
  TableActionMenu,
  TableStateRows,
} from "@/components/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityStatus = "APPROVED" | "PENDING" | "REJECTED";

type ActivityRow = {
  taskName: string;
  feedback: string;
  date: string;
  hours: number;
  status: ActivityStatus;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 7;

const ANALYTICS_META = [
  {
    label: "TOTAL HOURS LOGGED",
    icon: <Clock className="h-6 w-6 text-[#000053]" />,
  },
  {
    label: "TASKS COMPLETED",
    icon: <ListChecks className="h-6 w-6 text-[#000053]" />,
  },
  {
    label: "PENDING APPROVALS",
    icon: <CheckCircle2 className="h-6 w-6 text-[#000053]" />,
  },
];

// ─── Activity Details ─────────────────────────────────────────────────────────

function ActivityDetailsContent({ activity }: { activity: ActivityRow }) {
  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-[#e3ebf8] bg-[#f8fafe] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">
            Date
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#0A0A0A]">
            {activity.date}
          </p>
        </div>
        <div className="rounded-lg border border-[#e3ebf8] bg-[#f8fafe] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">
            Hours Logged
          </p>
          <p className="mt-1 text-[15px] font-semibold text-[#0A0A0A]">
            {activity.hours} hrs
          </p>
        </div>
      </div>
      <div className="rounded-lg border border-[#e3ebf8] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">
          Task Name
        </p>
        <p className="mt-2 text-[15px] text-[#0A0A0A] leading-relaxed">
          {activity.taskName}
        </p>
      </div>
      <div className="rounded-lg border border-[#e3ebf8] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">
          Feedback
        </p>
        <p className="mt-2 text-[15px] text-[#0A0A0A] leading-relaxed">
          {activity.status === "PENDING" ? "-" : activity.feedback}
        </p>
      </div>
      <div className="rounded-lg border border-[#e3ebf8] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#737373]">
          Status
        </p>
        <div className="mt-2">
          <AdminStatusBadge status={activity.status.toLowerCase()} />
        </div>
      </div>
    </div>
  );
}

function ActivityDetailsViewer({
  activity,
  open,
  onOpenChange,
}: {
  activity: ActivityRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();

  if (!activity) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[85vh] overflow-y-auto rounded-t-2xl border-[#e3ebf8]"
        >
          <SheetHeader>
            <SheetTitle>Activity Details</SheetTitle>
            <SheetDescription>
              Complete information for the selected activity log.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ActivityDetailsContent activity={activity} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg border-[#e3ebf8] p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Activity Details</DialogTitle>
          <DialogDescription>
            Complete information for the selected activity log.
          </DialogDescription>
        </DialogHeader>
        <ActivityDetailsContent activity={activity} />
        <div className="flex justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentDashboardPage() {
  const [page, setPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityRow | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data, isLoading, error } = useMenteeDashboard(page, PAGE_SIZE);

  const totalPages = data?.pagination.totalPages ?? 1;
  const totalActivities = data?.pagination.totalItems ?? 0;
  const activities: ActivityRow[] = data?.activities ?? [];

  const analytics = [
    { ...ANALYTICS_META[0], value: data?.stats.totalHoursLogged ?? 0 },
    { ...ANALYTICS_META[1], value: data?.stats.tasksCompleted ?? 0 },
    { ...ANALYTICS_META[2], value: data?.stats.pendingApprovals ?? 0 },
  ];

  const openDetails = (item: ActivityRow) => {
    setSelectedActivity(item);
    setIsDetailsOpen(true);
  };

  const closeDetails = (open: boolean) => {
    setIsDetailsOpen(open);
    if (!open) setSelectedActivity(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#f0f1f7] p-3 sm:p-4 md:p-6">
      <Card className="w-full bg-white border border-[#e3e6ef] rounded-2xl shadow-sm p-4 sm:p-6 md:p-8">
        {/* Header */}
        <PageHeader title="Mentee Dashboard" subtitle="Analytics Overview" />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 mt-5 mb-6">
          {analytics.map((item) => (
            <Card
              key={item.label}
              className="flex flex-col justify-between p-4 sm:p-5 bg-white border border-[#e3ebf8] shadow-sm rounded-xl"
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373]">
                  {item.label}
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <span className="text-3xl sm:text-4xl font-bold text-[#000053] leading-none">
                  {item.value}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Activity Feed */}
        <Card className="p-0 border-[#e3ebf8] shadow-sm rounded-xl md:rounded-2xl w-full overflow-x-auto">
          <div className="px-4 sm:px-6 pt-5 pb-3">
            <h2 className="text-[17px] sm:text-[18px] font-bold text-[#0A0A0A] leading-tight">
              Activity Feed
            </h2>
            <p className="text-[12px] sm:text-[13px] text-[#737373] mt-1">
              A detailed log of your work submissions and current status.
            </p>
          </div>

          <CardContent className="p-0">
            {/* Desktop / tablet table */}
            <div className="hidden md:block w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-[#e3ebf8]">
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10 pl-6">
                      Task Name
                    </TableHead>
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">
                      Date
                    </TableHead>
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">
                      Hours
                    </TableHead>
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">
                      Status
                    </TableHead>
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10">
                      Feedback
                    </TableHead>
                    <TableHead className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#737373] h-10 text-right pr-6">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableStateRows
                    colSpan={6}
                    loading={isLoading}
                    error={error?.message}
                    empty={!isLoading && activities.length === 0}
                    loadingMessage="Loading activities..."
                    emptyMessage="No activities found."
                  />
                  {!isLoading &&
                    activities.map((item, idx) => (
                      <TableRow
                        key={idx}
                        className="border-b border-[#e3ebf8] hover:bg-[#f5f7fb] transition-colors cursor-pointer"
                        onClick={() => openDetails(item)}
                      >
                        <TableCell className="font-semibold text-[15px] text-[#0A0A0A] pl-6">
                          {item.taskName}
                        </TableCell>
                        <TableCell className="text-[15px] text-[#737373]">
                          {item.date}
                        </TableCell>
                        <TableCell className="text-[15px] font-bold text-[#000053]">
                          {item.hours} hrs
                        </TableCell>
                        <TableCell>
                          <AdminStatusBadge
                            status={item.status.toLowerCase()}
                          />
                        </TableCell>
                        <TableCell className="text-[15px] text-[#0A0A0A]">
                          {item.status === "PENDING" ? "-" : item.feedback}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <TableActionMenu
                            ariaLabel={`Actions for activity on ${item.date}`}
                            items={[
                              {
                                label: "View",
                                icon: (
                                  <Eye className="h-4 w-4 text-[#000053]" />
                                ),
                                onSelect: () => openDetails(item),
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden px-3 pb-3 space-y-3">
              {isLoading ? (
                [...Array(PAGE_SIZE)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#e3ebf8] bg-white p-3"
                  >
                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  </div>
                ))
              ) : activities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#d4dceb] bg-white p-4 text-sm text-[#737373] text-center">
                  No activities found.
                </div>
              ) : (
                activities.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#e3ebf8] bg-white p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[14px] font-semibold text-[#0A0A0A] leading-snug">
                        {item.taskName}
                      </p>
                      <TableActionMenu
                        ariaLabel={`Actions for activity on ${item.date}`}
                        items={[
                          {
                            label: "View",
                            icon: <Eye className="h-4 w-4 text-[#000053]" />,
                            onSelect: () => openDetails(item),
                          },
                        ]}
                      />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#737373]">
                          Date
                        </p>
                        <p className="mt-1 text-[13px] text-[#0A0A0A]">
                          {item.date}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#737373]">
                          Hours
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[#000053]">
                          {item.hours} hrs
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <AdminStatusBadge status={item.status.toLowerCase()} />
                    </div>
                    <div className="mt-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#737373]">
                        Feedback
                      </p>
                      <p className="mt-1 text-[13px] text-[#0A0A0A]">
                        {item.status === "PENDING" ? "-" : item.feedback}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <AdminPagination
              page={page}
              totalPages={totalPages}
              total={totalActivities}
              itemsPerPage={PAGE_SIZE}
              itemLabel="activities"
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </Card>

      {/* Activity Details Viewer */}
      <ActivityDetailsViewer
        activity={selectedActivity}
        open={isDetailsOpen}
        onOpenChange={closeDetails}
      />
    </div>
  );
}
