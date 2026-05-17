"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

export type OnboardingStatus = "pending" | "approved" | "rejected" | "inactive";
export type InvitationStatus = "Active" | "Pending" | "Expired";

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
  invitationStatus?: InvitationStatus;
  invitationExpiresAt?: string;
}

export const useOnboardingApplications = () => {
  return useQuery<OnboardingApplication[]>({
    queryKey: ["onboarding-applications"],
    queryFn: async () => {
      const [applicationsRes, invitationsRes] = await Promise.all([
        fetch("/api/onboarding", { cache: "no-store" }),
        fetch("/api/invitations", { cache: "no-store" }),
      ]);

      if (!applicationsRes.ok) {
        const errorData = await applicationsRes.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch onboarding applications",
        );
      }

      const applications = await applicationsRes.json();

      // Fetch invitations to get status information
      let invitationsByEmail: Record<
        string,
        { accepted: boolean; expiresAt: string }
      > = {};

      if (invitationsRes.ok) {
        const invitations = await invitationsRes.json();
        if (Array.isArray(invitations)) {
          invitationsByEmail = invitations.reduce(
            (acc, inv) => {
              acc[inv.email] = {
                accepted: inv.status === "Accepted",
                expiresAt: inv.expiresAt,
              };
              return acc;
            },
            {} as Record<string, { accepted: boolean; expiresAt: string }>,
          );
        }
      }

      // Enhance applications with invitation status
      return applications.map((app: OnboardingApplication) => {
        const invitationData = invitationsByEmail[app.email];
        if (invitationData) {
          const invitationStatus: InvitationStatus = invitationData.accepted
            ? "Active"
            : new Date() > new Date(invitationData.expiresAt)
              ? "Expired"
              : "Pending";

          return {
            ...app,
            invitationStatus,
            invitationExpiresAt: invitationData.expiresAt,
          };
        }
        return app;
      });
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
  assignedAt: string;
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
  invitationSent: boolean;
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
    onSuccess: (data) => {
      if (data.invitationSent) {
        toast.success("Mentee assigned to project. Invitation email sent.");
      } else {
        toast.success("Mentee assigned to project.");
      }
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
      toast.success("Mentee set to inactive.");
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove mentee from project");
    },
  });
};

export const useUnassignedMentors = () => {
  return useQuery<OnboardingApplication[]>({
    queryKey: ["mentors"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding/mentors", {
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch mentors");
      }

      return response.json();
    },
  });
};

// ---------------------------------------------------------------------------
// Mentor allocation hooks
// ---------------------------------------------------------------------------

export interface MentorAllocation {
  mentorId: string;
  projectId: string;
  assignedAt: string;
}

export const useMentorAllocations = () => {
  return useQuery<MentorAllocation[]>({
    queryKey: ["mentor-allocations"],
    queryFn: async () => {
      const response = await fetch("/api/onboarding/mentors/assign", {
        cache: "no-store",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to fetch mentor allocations",
        );
      }
      return response.json();
    },
  });
};

export const useAssignMentorToProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string; data: unknown },
    Error,
    { mentorId: string; projectId: string }
  >({
    mutationFn: async ({ mentorId, projectId }) => {
      const response = await fetch("/api/onboarding/mentors/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to assign mentor to project",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Mentor assigned to project.");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to assign mentor to project");
    },
  });
};

export const useUnassignMentor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { mentorId: string; projectId: string }
  >({
    mutationFn: async ({ mentorId, projectId }) => {
      const response = await fetch("/api/onboarding/mentors/assign", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || "Failed to remove mentor from project",
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Mentor removed from project.");
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["mentor-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove mentor from project");
    },
  });
};
