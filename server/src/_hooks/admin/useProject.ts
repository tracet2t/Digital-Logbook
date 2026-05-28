"use client";

import { useQuery } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Project {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  batchNo: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    assignments: number;
    mentors: number;
  };
}

// ── Hooks ──────────────────────────────────────────────────────────────────────

/**
 * Fetch all projects with student/mentor counts
 * Used for: project selection dropdowns, bulk invitation project mapping
 */
export const useGetAllProjects = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/project");
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch a single project with full details
 * @param id - Project ID (null/undefined to disable query)
 */
export const useGetProject = (id: string | null) => {
  return useQuery<Project>({
    queryKey: ["projects", id],
    queryFn: async () => {
      const res = await fetch(`/api/project?id=${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch project");
      }
      return res.json();
    },
    enabled: !!id,
  });
};
