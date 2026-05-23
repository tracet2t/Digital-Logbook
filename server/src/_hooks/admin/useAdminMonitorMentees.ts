"use client";

import { useQuery } from "@tanstack/react-query";

export interface MonitorMenteeTask {
  id: string;
  name: string;
  dateLabel: string;
  hours: number;
}

export interface MonitorMenteeCardData {
  id: string;
  name: string;
  totalHours: number;
  tasks: MonitorMenteeTask[];
  taskStatus: "pending" | "reviewed" | "missed" | null;
}

interface MonitorMenteeResponse {
  mentees: MonitorMenteeCardData[];
}

export const useAdminMonitorMentees = () =>
  useQuery<MonitorMenteeResponse, Error>({
    queryKey: ["admin-monitor-mentees"],
    queryFn: async () => {
      const response = await fetch("/api/admin/monitor/mentees", {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          errorPayload?.message ?? "Failed to load mentee monitor data",
        );
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 2,
    retry: 2,
  });
