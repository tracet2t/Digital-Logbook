"use client";

import { useQuery } from "@tanstack/react-query";

import type { Task, WarningSeverity } from "@/app/student/profile/_constants";

export interface AdminMenteeDetailResponse {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    batchNo: string | null;
    createdAt: string;
  };
  projects: {
    id: string;
    name: string;
    description: string | null;
    batchNo: string | null;
    allocationStatus: string;
    assignedAt: string;
  }[];
  mentor: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    projectAssigned: string;
  } | null;
  statistics: {
    totalHours: number;
  };
  tasks: Task[];
  warningSeverity: WarningSeverity | null;
}

export const useAdminMonitorMenteeDetail = (
  menteeId: string | null,
  enabled = true,
) =>
  useQuery<AdminMenteeDetailResponse, Error>({
    queryKey: ["admin-monitor-mentee-detail", menteeId],
    queryFn: async () => {
      if (!menteeId) {
        throw new Error("Mentee id is required");
      }

      const response = await fetch(`/api/admin/monitor/mentees/${menteeId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          errorPayload?.message ?? "Failed to load mentee detail",
        );
      }

      return response.json();
    },
    enabled: enabled && Boolean(menteeId),
    staleTime: 1000 * 60,
    retry: 2,
  });
