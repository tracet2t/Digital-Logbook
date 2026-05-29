"use client";

import { useQuery } from "@tanstack/react-query";

export interface MonitorMentorTask {
  id: string;
  taskName: string;
  date: string;
  hours: number;
  menteeName: string;
}

export interface MonitorMentorDetailResponse {
  profile: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  };
  projects: string[];
  menteeCount: number;
  tasks: MonitorMentorTask[];
}

export const useAdminMonitorMentorDetail = (
  mentorId: string | null,
  enabled = true,
) =>
  useQuery<MonitorMentorDetailResponse, Error>({
    queryKey: ["admin-monitor-mentor-detail", mentorId],
    queryFn: async () => {
      if (!mentorId) {
        throw new Error("Mentor id is required");
      }

      const response = await fetch(`/api/admin/monitor/mentors/${mentorId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          errorPayload?.message ?? "Failed to load mentor detail",
        );
      }

      return response.json();
    },
    enabled: enabled && Boolean(mentorId),
    staleTime: 1000 * 60,
    retry: 2,
  });
