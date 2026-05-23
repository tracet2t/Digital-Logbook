"use client";

import { useQuery } from "@tanstack/react-query";

export interface MonitorUserCardData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "mentor" | "superAdmin";
  isActive: boolean;
  batchNo: string | null;
  createdAt: string;
  assignedProjects: string[];
  taskStatus: "pending" | "reviewed" | "missed" | null;
}

export const useAdminMonitorUsers = () =>
  useQuery<MonitorUserCardData[], Error>({
    queryKey: ["admin-monitor-users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/monitor/users", {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to load users");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
