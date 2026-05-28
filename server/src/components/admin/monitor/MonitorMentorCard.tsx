import type { MonitorMentorCard } from "@/_hooks/admin/useAdminMonitor";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MonitorMentorCardProps {
  mentor: MonitorMentorCard;
  onRemind: (mentorId: string) => void;
  isReminding?: boolean;
  onSelect?: (mentorId: string) => void;
  onMenteeSelect?: (menteeId: string) => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function MonitorMentorCard({
  mentor,
  onRemind,
  isReminding = false,
  onSelect,
  onMenteeSelect,
}: MonitorMentorCardProps) {
  const remaining =
    mentor.reviewProgress.total - mentor.reviewProgress.reviewed;
  const canRemind = remaining > 0;

  const handleSelect = () => {
    onSelect?.(mentor.id);
  };

  const handleMenteeSelect = (menteeId: string) => {
    onMenteeSelect?.(menteeId);
  };

  return (
    <Card className="rounded-2xl border border-[#e4e7ed] bg-white p-4 transition-shadow hover:shadow-md">
      <div
        className="flex items-start justify-between cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={handleSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleSelect();
          }
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f0fe] text-sm font-semibold text-[#0a0f57]">
            {getInitials(mentor.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0a0f57]">
              {mentor.name}
            </p>
            <p className="text-xs text-slate-500">
              {mentor.projectLabel} - {mentor.totalMentees} mentees
            </p>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
          Mentor
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Mentees
        </p>
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {mentor.mentees.map((mentee) => (
            <div
              key={mentee.id}
              className="flex items-center justify-between rounded-lg border border-slate-100 bg-[#f8fafc] px-3 py-2 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                handleMenteeSelect(mentee.id);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.stopPropagation();
                  handleMenteeSelect(mentee.id);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#0a0f57]">
                  {getInitials(mentee.name)}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#0a0f57]">
                    {mentee.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {mentee.dateLabel}
                  </p>
                </div>
              </div>
              {mentee.status !== "reviewed" ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Pending
                </span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Reviewed
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>
          {mentor.reviewProgress.reviewed} reviewed - {remaining} remaining
        </span>
        {canRemind ? (
          <Button
            variant="outline"
            size="sm"
            className="h-7 border-[#0a0f57] text-[#0a0f57]"
            disabled={isReminding}
            onClick={(event) => {
              event.stopPropagation();
              onRemind(mentor.id);
            }}
          >
            {isReminding ? "Sending" : "Remind"}
          </Button>
        ) : (
          <span className="font-semibold text-emerald-600">All clear</span>
        )}
      </div>
    </Card>
  );
}
