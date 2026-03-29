export type ProjectOption = {
  id: string;
  name: string;
};

export type StudentOption = {
  id: string;
  name: string;
};

export type MentorStudent = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type ActivitySummary = {
  totalSubmitted: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  approvalRate: number;
};

export type FeedbackRecord = {
  id: string;
  activityDate: string;
  status: "approved" | "rejected" | "pending";
  feedbackNotes: string | null;
  mentorName: string;
};

export type StudentActivity = {
  id: string;
  date: string;
  notes: string;
  timeSpent?: number;
  feedback?: Array<{
    status?: "approved" | "rejected" | "pending";
  }>;
};

export type AssignmentDecision = "inReview" | "accepted" | "rejected";

export type RecentActivity = {
  id: string;
  title: string;
  date: string;
  status: "approved" | "rejected" | "pending";
};

export const QUICK_DOCUMENTS = [
  "ONBOARDING_PLAN_2024.PDF",
  "TEAM_ACTIVITY_GUIDELINE.PDF",
  "MENTOR_FEEDBACK_TEMPLATE.PDF",
];

export function nameToInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatDate(value?: string) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatHours(hours: number) {
  return `${hours}h`;
}

export function getLatestFeedbackStatus(
  feedback: StudentActivity["feedback"],
): "approved" | "rejected" | "pending" {
  if (!feedback || feedback.length === 0) return "pending";
  return feedback[feedback.length - 1]?.status ?? "pending";
}

export function getSummaryStatus(decision: AssignmentDecision) {
  if (decision === "accepted") return "Accepted";
  if (decision === "rejected") return "Rejected";
  return "In Review";
}
