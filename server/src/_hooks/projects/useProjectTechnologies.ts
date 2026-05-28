"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

// Fetch technologies for a project
export function useGetProjectTechnologies(projectId: string | null) {
  return useQuery({
    queryKey: ["project", projectId, "technologies"],
    queryFn: async () => {
      const res = await fetch(
        `/api/project/technologies?projectId=${projectId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch project technologies");
      return res.json();
    },
    enabled: !!projectId,
  });
}

// Fetch technologies for a specific student
export function useGetStudentTechnologies(studentId: string | null) {
  return useQuery({
    queryKey: ["student", studentId, "technologies"],
    queryFn: async () => {
      const res = await fetch(
        `/api/project/technologies?studentId=${studentId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch student technologies");
      return res.json();
    },
    enabled: !!studentId,
  });
}

// Assign or rate a technology for a student in a project
export function useUpsertStudentTechnology() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      studentId,
      name,
      rating,
    }: {
      projectId: string;
      studentId: string;
      name: string;
      rating?: number;
    }) => {
      const res = await fetch("/api/project/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, studentId, name, rating }),
      });
      if (!res.ok) throw new Error("Failed to save technology rating");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId, "technologies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId, "technologies"],
      });
      toast.success("Technology rating saved");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save technology rating",
      );
    },
  });
}

// Remove a technology from a student's profile in a project
export function useRemoveStudentTechnology() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      studentId,
      name,
    }: {
      projectId: string;
      studentId: string;
      name: string;
    }) => {
      const res = await fetch("/api/project/technologies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, studentId, name }),
      });
      if (!res.ok) throw new Error("Failed to remove technology");
      // res.json() may fail on 204 No Content, so we just return true
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId, "technologies"],
      });
      queryClient.invalidateQueries({
        queryKey: ["student", variables.studentId, "technologies"],
      });
      toast.success("Technology removed");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove technology",
      );
    },
  });
}
