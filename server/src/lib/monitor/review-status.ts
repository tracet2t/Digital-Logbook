import { addDays, startOfDay } from "@/lib/monitor/date-format";

export const MISSED_REVIEW_DAYS = 2;

type ReviewStatus = "reviewed" | "pending" | "missed";

type ReviewStatusInput = {
  status?: string | null;
  feedbackStatus?: string | null;
  createdAt: Date;
  now?: Date;
};

const hasReview = (status?: string | null, feedbackStatus?: string | null) => {
  const normalizedStatus = status?.toLowerCase() ?? "";
  const normalizedFeedback = feedbackStatus?.toLowerCase() ?? "";

  if (normalizedFeedback === "approved" || normalizedFeedback === "rejected") {
    return true;
  }

  return normalizedStatus === "accepted" || normalizedStatus === "rejected";
};

export const getMissedCutoff = (now: Date) =>
  addDays(startOfDay(now), -MISSED_REVIEW_DAYS);

export const getReviewStatus = ({
  status,
  feedbackStatus,
  createdAt,
  now = new Date(),
}: ReviewStatusInput): ReviewStatus => {
  if (hasReview(status, feedbackStatus)) {
    return "reviewed";
  }

  const missedCutoff = getMissedCutoff(now);
  return createdAt < missedCutoff ? "missed" : "pending";
};
