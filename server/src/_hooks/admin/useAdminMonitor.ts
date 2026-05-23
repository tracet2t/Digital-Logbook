"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export type MonitorMentorStatus = "onTrack" | "behind" | "critical";
export type MonitorMenteeStatus = "reviewed" | "pending" | "missed";

export interface MonitorStats {
  mentors: { value: number; delta: number };
  mentees: { value: number; delta: number };
  submissionsToday: { value: number; delta: number };
  missedReviews: { value: number };
  completionRate: { value: number; delta: number };
}

export interface MonitorMenteeRow {
  id: string;
  name: string;
  status: MonitorMenteeStatus;
  dateLabel: string;
}

export interface MonitorMentorCard {
  id: string;
  name: string;
  projectLabel: string;
  totalMentees: number;
  status: MonitorMentorStatus;
  reviewProgress: { reviewed: number; total: number; percentage: number };
  missedCount: number;
  mentees: MonitorMenteeRow[];
}

export interface MonitorResponse {
  stats: MonitorStats;
  mentors: MonitorMentorCard[];
}

interface ReminderPayload {
  mentorId: string;
}

export const useAdminMonitor = () =>
  useQuery<MonitorResponse, Error>({
    queryKey: ["admin-monitor"],
    queryFn: async () => {
      const response = await fetch("/api/admin/monitor", { cache: "no-store" });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to load monitor data");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });

export const useAdminMonitorReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mentorId }: ReminderPayload) => {
      const response = await fetch("/api/notifications/review-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to send reminder");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Reminder sent");
      queryClient.invalidateQueries({ queryKey: ["admin-monitor"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send reminder");
    },
  });
};
