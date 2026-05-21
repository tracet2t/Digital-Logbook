/**
 * @file Hook that owns all state and data-fetching logic for the shared profile page.
 * Uses TanStack Query for server-state management.
 */

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import dayjs from "dayjs";
import { useParams } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SharedProfileData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    batchNo: string | null;
  };
  projects: {
    id: string;
    name: string;
    description: string | null;
    batchNo: string | null;
    allocationStatus: string | null;
  }[];
  badges: {
    id: string;
    name: string;
    description: string | null;
    iconUrl: string | null;
    awardedAt: string;
  }[];
  statistics: {
    totalActivities: number;
    approvedActivities: number;
    pendingActivities: number;
    rejectedActivities: number;
    totalHours: number;
  };
  recentActivities: {
    id: string;
    date: string;
    timeSpent: number;
    status: string;
    feedbackStatus: string | null;
    feedbackNotes: string | null;
  }[];
}

export interface HeatmapValue {
  date: string;
  count: number;
}

/** Return type of useSharedProfilePage */
export interface UseSharedProfilePageReturn {
  profileData: SharedProfileData | null;
  isLoading: boolean;
  error: string | null;
  heatmapData: HeatmapValue[];
  token: string;
}

// ── Query Key ──────────────────────────────────────────────────────────────────

/** Query key factory for the shared profile endpoint */
const sharedProfileKeys = {
  detail: (token: string) => ["shared-profile", token] as const,
};

// ── Query Function ─────────────────────────────────────────────────────────────

/**
 * Fetches shared profile data from the public API by token.
 */
async function fetchSharedProfile(token: string): Promise<SharedProfileData> {
  const res = await fetch(`/api/shared-profile/${encodeURIComponent(token)}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load profile");
  }
  return json.data as SharedProfileData;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

/**
 * Central hook for the shared profile page.
 * Uses TanStack Query to manage fetch lifecycle, caching, and error handling.
 * Returns derived heatmap data and the route token.
 */
export function useSharedProfilePage(): UseSharedProfilePageReturn {
  const params = useParams();
  const token = (params?.token as string) ?? "";

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery<SharedProfileData, Error>({
    queryKey: sharedProfileKeys.detail(token),
    queryFn: () => fetchSharedProfile(token),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const heatmapData = useMemo(() => {
    if (!profileData) return [];
    const approved = profileData.recentActivities.filter((a) => {
      const raw = (a.feedbackStatus ?? a.status ?? "").toLowerCase();
      return raw === "accepted" || raw === "approved";
    });
    const byDate: Record<string, number> = {};
    approved.forEach((a) => {
      const key = dayjs(a.date).format("YYYY-MM-DD");
      byDate[key] = (byDate[key] || 0) + 1;
    });
    return Object.entries(byDate).map(([date, count]) => ({ date, count }));
  }, [profileData]);

  return {
    profileData: profileData ?? null,
    isLoading,
    error: error?.message ?? null,
    heatmapData,
    token,
  };
}
