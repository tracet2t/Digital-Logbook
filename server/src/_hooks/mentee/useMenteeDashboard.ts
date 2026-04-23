"use client";

import { useQuery } from "@tanstack/react-query";

export type MenteeDashboardStatus = "APPROVED" | "PENDING" | "REJECTED";

export interface MenteeDashboardStats {
  totalHoursLogged: number;
  tasksCompleted: number;
  pendingApprovals: number;
}

export interface MenteeDashboardActivity {
  taskName: string;
  feedback: string;
  date: string;
  hours: number;
  status: MenteeDashboardStatus;
}

export interface MenteeDashboardPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface MenteeDashboardResponse {
  stats: MenteeDashboardStats;
  activities: MenteeDashboardActivity[];
  pagination: MenteeDashboardPagination;
}

export const useMenteeDashboard = (page: number, pageSize: number) => {
  return useQuery<MenteeDashboardResponse, Error>({
    queryKey: ["mentee-dashboard", page, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/mentee/dashboard?page=${page}&pageSize=${pageSize}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch mentee dashboard data",
        );
      }

      return res.json();
    },
    staleTime: 1000 * 60,
    retry: 2,
  });
};
