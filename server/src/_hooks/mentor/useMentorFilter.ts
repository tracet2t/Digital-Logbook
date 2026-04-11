import { useQuery } from "@tanstack/react-query";

interface Project {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  email?: string;
  [key: string]: any;
}

/**
 * Hook to fetch all projects for the current mentor
 */
export const useMentorProjects = () => {
  return useQuery({
    queryKey: ["mentorProjects"],
    queryFn: async () => {
      const response = await fetch(`/api/mentor/filter`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mentor projects");
      }

      return response.json() as Promise<Project[]>;
    },
  });
};

/**
 * Hook to fetch students assigned to a specific project
 * @param projectId - The ID of the project
 * @param enabled - Whether the query should run (defaults to true if projectId is provided)
 */
export const useProjectStudents = (
  projectId: string | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["projectStudents", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }

      const response = await fetch(
        `/api/mentor/filter?projectId=${encodeURIComponent(projectId)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project students");
      }

      return response.json() as Promise<Student[]>;
    },
    enabled: enabled && !!projectId,
  });
};

/**
 * Hook to fetch either projects or students based on projectId parameter
 * @param projectId - If provided, fetches students; if null, fetches projects
 */
export const useMentorFilterData = (projectId: string | null) => {
  return useQuery({
    queryKey: ["mentorFilter", projectId],
    queryFn: async () => {
      const url = new URL(
        projectId
          ? `/api/mentor/filter?projectId=${encodeURIComponent(projectId)}`
          : "/api/mentor/filter",
        typeof window !== "undefined" ? window.location.origin : "",
      );

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mentor filter data");
      }

      return response.json() as Promise<Project[] | Student[]>;
    },
  });
};
