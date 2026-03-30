"use client";

import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  totalMentees: number;
  projects: number;
  totalWorkingHours: number;
  averageWorkingHours: number;
}

export interface RecentMentee {
  initials: string;
  name: string;
  project: string;
  lastActivity: string;
  status: "ACCEPTED" | "PENDING" | "REJECTED";
}

export interface MentorDashboardData {
  stats: DashboardStats;
  recentlyActiveMentees: RecentMentee[];
}

/**
 * Fetch mentor dashboard data including stats and recently active mentees
 * Uses TanStack Query for caching and state management
 */
export const useMentorDashboard = () => {
  return useQuery<MentorDashboardData, Error>({
    queryKey: ["mentor-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/mentor/dashboard");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to fetch mentor dashboard data"
        );
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};
