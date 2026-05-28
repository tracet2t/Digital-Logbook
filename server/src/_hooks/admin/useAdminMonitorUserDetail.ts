"use client";

import { useQuery } from "@tanstack/react-query";

export interface MonitorUserTask {
  id: string;
  taskName: string;
  date: string;
  hours: number;
  menteeName?: string;
}

export interface MonitorUserDetail {
  profile: {
    id: string;
    fullName: string;
    email: string;
    role: "student" | "mentor" | "superAdmin";
    isActive: boolean;
    batchNo: string | null;
    createdAt: string;
  };
  tasks: MonitorUserTask[];
}

export const useAdminMonitorUserDetail = (
  userId: string | null,
  enabled = true,
) =>
  useQuery<MonitorUserDetail, Error>({
    queryKey: ["admin-monitor-user-detail", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User id is required");
      }

      const response = await fetch(`/api/admin/monitor/users/${userId}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to load user detail");
      }

      return response.json();
    },
    enabled: enabled && Boolean(userId),
    staleTime: 1000 * 60,
    retry: 2,
  });
