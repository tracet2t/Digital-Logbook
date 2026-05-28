"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

// ============ Types ============

interface CreateProjectRequest {
  name: string;
  description?: string;
  domain: string;
  batchNo?: string;
}

interface CreateProjectResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    description: string | null;
    domain: string;
    batchNo: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface AssignToProjectRequest {
  projectId: string;
  studentId?: string;
  mentorId?: string;
}

interface AssignToProjectResponse {
  success: boolean;
  message: string;
}

interface RemoveFromProjectRequest {
  projectId: string;
  studentId?: string;
  mentorId?: string;
}

interface RemoveFromProjectResponse {
  success: boolean;
  message: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  batchNo: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  projectOrder?: number;
  studentCount?: number;
  mentorCount?: number;
}

interface ProjectWithDetails extends Project {
  students?: Array<any>;
  mentors?: Array<any>;
}

// ============ Create Project Hook ============

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateProjectResponse,
    Error,
    CreateProjectRequest
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Project created successfully!");
      // Invalidate project list queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create project");
    },
  });

  return mutation;
};

// ============ Update Project Order Hook ============

export const useUpdateProjectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { order: string[] }>({
    mutationFn: async ({ order }) => {
      const res = await fetch("/api/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update project order");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ============ Assign to Project Hook ============

export const useAssignToProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    AssignToProjectResponse,
    Error,
    AssignToProjectRequest
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign to project");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      const assignType = variables.studentId ? "Mentee" : "Mentor";
      toast.success(`${assignType} assigned successfully!`);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign to project");
    },
  });

  return mutation;
};

// ============ Remove from Project Hook ============

export const useRemoveFromProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    RemoveFromProjectResponse,
    Error,
    RemoveFromProjectRequest
  >({
    mutationFn: async (data) => {
      const res = await fetch("/api/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove from project");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      const removeType = variables.studentId ? "Mentee" : "Mentor";
      toast.success(`${removeType} removed successfully!`);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove from project");
    },
  });

  return mutation;
};

// ============ Get All Projects Hook ============

export const useGetProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/project");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch projects");
      }

      return res.json();
    },
  });
};

// ============ Get Single Project Hook ============

export const useGetProject = (projectId: string | null) => {
  return useQuery<ProjectWithDetails, Error>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/project?id=${projectId}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch project");
      }

      return res.json();
    },
    enabled: !!projectId, // Only run query if projectId is provided
  });
};

// ============ Get Project Students Hook ============

export const useGetProjectStudents = (projectId: string | null) => {
  return useQuery<any[], Error>({
    queryKey: ["project", projectId, "students"],
    queryFn: async () => {
      const res = await fetch(`/api/project?id=${projectId}&view=students`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch students");
      }

      return res.json();
    },
    enabled: !!projectId,
  });
};

// ============ Get Project Mentors Hook ============

export const useGetProjectMentors = (projectId: string | null) => {
  return useQuery<any[], Error>({
    queryKey: ["project", projectId, "mentors"],
    queryFn: async () => {
      const res = await fetch(`/api/project?id=${projectId}&view=mentors`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch mentors");
      }

      return res.json();
    },
    enabled: !!projectId,
  });
};
