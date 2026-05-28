/**
 * React Query Hook for Mentee Profile API
 * Fetches secure mentee profile data with caching and error handling
 */

"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import {
  MenteeProfileData,
  MenteeProfileError,
  MenteeProfileResponse,
} from "@/types/menteeProfile";

const MENTEE_PROFILE_QUERY_KEY = ["mentee-profile"];

/**
 * Fetches mentee profile data from the secure API endpoint
 * @returns Promise with profile data or error
 */
async function fetchMenteeProfile(): Promise<MenteeProfileData> {
  const response = await fetch("/api/mentee/profile", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include HTTP-only cookies
  });

  if (!response.ok) {
    const errorData: MenteeProfileError = await response.json();
    throw new Error(
      errorData.message ||
        `Failed to fetch mentee profile (${response.status})`,
    );
  }

  const data = (await response.json()) as
    | MenteeProfileResponse
    | MenteeProfileError;

  if (!data.success) {
    const errorMessage =
      "message" in data ? data.message : "Failed to fetch mentee profile";

    throw new Error(errorMessage);
  }

  return (data as MenteeProfileResponse).data;
}

/**
 * Hook to fetch mentee profile with React Query
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useMenteeProfile();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error.message} />;
 *
 * return (
 *   <div>
 *     <h1>{data?.profile.fullName}</h1>
 *     <p>Email: {data?.profile.email}</p>
 *   </div>
 * );
 * ```
 */
export function useMenteeProfile(): UseQueryResult<MenteeProfileData, Error> {
  return useQuery({
    queryKey: MENTEE_PROFILE_QUERY_KEY,
    queryFn: fetchMenteeProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to refresh mentee profile data
 *
 * @example
 * ```tsx
 * const queryClient = useQueryClient();
 * const { refetch } = useMenteeProfile();
 *
 * const handleUpdate = async () => {
 *   await refetch();
 * };
 * ```
 */
export function useMenteeProfileRefresh() {
  const { refetch } = useQuery({
    queryKey: MENTEE_PROFILE_QUERY_KEY,
    queryFn: fetchMenteeProfile,
    enabled: false, // Don't auto-fetch
  });

  return { refetch };
}

/**
 * Hook to get specific profile section
 *
 * @example
 * ```tsx
 * const { data: statistics } = useMenteeProfile();
 * const stats = statistics?.statistics;
 * ```
 */
export function useMenteeProfileSection<K extends keyof MenteeProfileData>(
  section: K,
): UseQueryResult<MenteeProfileData[K] | undefined, Error> {
  return useQuery({
    queryKey: [...MENTEE_PROFILE_QUERY_KEY, section],
    queryFn: async () => {
      const profile = await fetchMenteeProfile();
      return profile[section];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
