"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export type OnboardingStatus = "pending" | "approved" | "rejected";

export interface OnboardingApplication {
  id: string;
  fullName: string;
  email: string;
  university: string;
  degreeProgram: string;
  cvLink: string;
  status: OnboardingStatus;
  createdAt: string;
  updatedAt: string;
}

export const useOnboardingApplications = () => {
  return useQuery<OnboardingApplication[]>({
    queryKey: ["onboarding-applications"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding", { cache: "no-store" });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch onboarding applications",
        );
      }

      return response.json();
    },
  });
};

export const useUpdateOnboardingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; application: OnboardingApplication },
    Error,
    { id: string; status: OnboardingStatus }
  >({
    mutationFn: async ({ id, status }) => {
      const response = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to update onboarding status",
        );
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "approved"
          ? "Application approved"
          : "Application rejected",
      );
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update onboarding status");
    },
  });
};

// ---------------------------------------------------------------------------
// Fetch existing allocations (applicationId → projectId) from the DB
// Used to rehydrate the Kanban board state on page load
// ---------------------------------------------------------------------------

export interface ApplicationAllocation {
  applicationId: string;
  projectId: string;
}

export const useProjectApplicationAllocations = () => {
  return useQuery<ApplicationAllocation[]>({
    queryKey: ["onboarding-allocations"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding/assign", {
        cache: "no-store",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch onboarding allocations",
        );
      }
      return response.json();
    },
  });
};

export interface AssignMenteeResult {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  application: OnboardingApplication;
  allocation: { id: string; projectId: string; studentId: string } | null;
}

export const useAssignMenteeToProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AssignMenteeResult,
    Error,
    { applicationId: string; projectId: string }
  >({
    mutationFn: async ({ applicationId, projectId }) => {
      const response = await fetch("/api/onboarding/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to assign mentee to project",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign mentee to project");
    },
  });
};

export const useUnassignMentee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { applicationId: string; projectId: string }
  >({
    mutationFn: async ({ applicationId, projectId }) => {
      const response = await fetch("/api/onboarding/assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to remove mentee from project",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove mentee from project");
    },
  });
};
