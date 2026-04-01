import {
  Check,
  Clock3,
  Dot,
  FileText,
  Mail,
  User,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  ActivitySummary,
  RecentActivity,
  formatHours,
  nameToInitials,
} from "./menteeProfileView.helpers";

export function MenteeHeader({ mentorName: _mentorName }: { mentorName: string }) {
  return (
    <header className="flex flex-wrap gap-4 items-center px-4 py-4 md:px-8">
      <p className="text-sm font-semibold tracking-[0.16em] text-[#03255f]">
        MENTOR PORTAL
      </p>
    </header>
  );
}

export function MenteeIdentityCard({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-[#fbfcfe] shadow-none">
      <CardContent className="flex h-full flex-col items-center p-5 text-center">
        <Avatar className="h-20 w-20 border-2 border-[#e0e8f7] bg-gradient-to-b from-[#ffd9c9] to-[#e9f1ff]">
          <AvatarFallback className="bg-transparent text-lg font-semibold text-[#173d73]">
            {nameToInitials(displayName || "NA")}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-xl font-semibold text-[#0d223f]">{displayName}</h2>

        <div className="mt-6 h-px w-full bg-[#ebeff7]" />

        <div className="mt-4 w-full rounded-xl bg-white px-3 py-2 text-left">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#7f8ca5]">
            Primary Contact
          </p>
          <div className="mt-1 flex items-center gap-2 text-sm text-[#223553]">
            <Mail className="h-4 w-4 text-[#5f79a5]" />
            <span className="truncate">{email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssignmentCard({
  projectName,
  summaryStatus,
  totalWorkingHours,
  onAccept,
  onReject,
  disabled,
}: {
  projectName: string;
  summaryStatus: string;
  totalWorkingHours: number;
  onAccept: () => void;
  onReject: () => void;
  disabled: boolean;
}) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr,auto] md:items-start">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#7e8ea8]">
              Assigned Unit
            </p>
            <h3 className="mt-1 text-xl font-semibold break-words text-[#0f2543] md:text-2xl">
              Project: {projectName}
            </h3>
          </div>

          <div className="flex items-start md:justify-end">
            <Badge className="rounded-full border border-[#cae6d2] bg-[#edfaf1] px-3 py-1 text-xs font-semibold text-[#1b8d43]">
              {summaryStatus}
            </Badge>
          </div>
        </div>

        <div className="rounded-xl border border-[#e6ecf8] bg-[#f5f8fd] px-4 py-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#607296]">
            <Clock3 className="h-3.5 w-3.5" />
            Time Allocation
          </div>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-3xl font-bold text-[#0f2543]">
              {formatHours(totalWorkingHours)}
            </p>
            <p className="pb-1 text-sm text-[#607296]">Working Hours</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-10 flex-1 rounded-md bg-[#000053] text-white hover:bg-[#23236c]"
            onClick={onAccept}
            disabled={disabled}
          >
            <Check className="mr-1.5 h-4 w-4" />
            Accept
          </Button>
          <Button
            type="button"
            className="h-10 flex-1 rounded-md bg-[#000053] text-white hover:bg-[#23236c]"
            onClick={onReject}
            disabled={disabled}
          >
            <X className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RecentActivityCard({
  recentActivities,
}: {
  recentActivities: RecentActivity[];
}) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d8ea8]">
          Recent Activity Log
        </p>

        <div className="mt-4 max-h-52 overflow-y-auto space-y-3 pr-1">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-[#edf1f8] bg-[#fbfdff] px-3 py-2.5"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="truncate text-sm font-medium text-[#21334f]">{activity.title}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-[#6c7f9f]">
                    <span>{activity.date}</span>
                    <Dot className="h-4 w-4" />
                    <span className="capitalize">{activity.status}</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#0f2543]">
                  {activity.hours}h
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6c7f9f]">No recent activities to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function MentorTeamCard({ mentorTeam }: { mentorTeam: string[] }) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d8ea8]">
          Mentor Team
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {mentorTeam.length > 0 ? (
            mentorTeam.map((name) => (
              <Badge
                key={name}
                variant="default"
                className="rounded-full border border-[#dce7fa] bg-[#f4f8ff] px-2.5 py-1 text-xs font-medium text-[#24406d]"
              >
                <User className="mr-1 h-3.5 w-3.5" />
                {name}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-[#6c7f9f]">No mentors found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickDocumentationCard({ docs }: { docs: string[] }) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d8ea8]">
          Quick Documentation
        </p>
        <div className="mt-4 space-y-2">
          {docs.map((doc) => (
            <div
              key={doc}
              className="flex items-center gap-2 rounded-lg border border-[#edf1f8] bg-[#fbfdff] px-3 py-2 text-sm text-[#23406d]"
            >
              <FileText className="h-4 w-4" />
              <span className="truncate">{doc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryStatsCard({
  activitySummary,
  lastFeedbackDate,
}: {
  activitySummary?: ActivitySummary;
  lastFeedbackDate: string;
}) {
  return (
    <Card className="rounded-xl border-[#e6ecf8] bg-white shadow-sm">
      <CardContent className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatusStat
          label="Submitted"
          value={activitySummary?.totalSubmitted ?? 0}
          tone="submitted"
        />
        <StatusStat
          label="Approved"
          value={activitySummary?.totalApproved ?? 0}
          tone="approved"
        />
        <StatusStat
          label="Pending"
          value={activitySummary?.totalPending ?? 0}
          tone="pending"
        />
        <StatusStat label="Last Feedback" value={lastFeedbackDate} tone="neutral" />
      </CardContent>
    </Card>
  );
}

function StatusStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "approved" | "submitted" | "pending" | "neutral";
}) {
  const styleMap: Record<typeof tone, string> = {
    approved: "border-[#cae6d2] bg-[#f3fbf6] text-[#17693a]",
    submitted: "border-[#cfe0fb] bg-[#f2f7ff] text-[#173f78]",
    pending: "border-[#f9e0b3] bg-[#fff8eb] text-[#8b5e08]",
    neutral: "border-[#e3e8f2] bg-[#f8fafd] text-[#4a5f82]",
  };

  return (
    <div className={`rounded-lg border px-3 py-3 ${styleMap[tone]}`}>
      <p className="text-xs uppercase tracking-[0.12em]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
