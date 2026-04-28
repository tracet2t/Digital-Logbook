"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ORPCError } from "@orpc/client";
import { toast } from "sonner";

import { orpcClient } from "@/lib/orpc";

// Infer types from the oRPC router
type CreateApplicationInput = {
  fullName: string;
  email: string;
  university: string;
  degreeProgram: string;
  cvLink: string;
};

type Application = {
  id: string;
  fullName: string;
  email: string;
  university: string;
  degreeProgram: string;
  cvLink: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
};

type CreateApplicationResponse = {
  message: string;
  application: Application;
};

/**
 * Hook for creating a new onboarding application
 * Uses oRPC for type-safe API calls with TanStack Query
 */
export const useOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateApplicationResponse,
    unknown,
    CreateApplicationInput
  >({
    mutationFn: async (data) => {
      // Call the oRPC procedure - fully type-safe at runtime!
      const result = await orpcClient.onboarding.createApplication(data);
      return result;
    },
    onSuccess: () => {
      toast.success("Onboarding submitted successfully.");
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
    },
    onError: (error: unknown) => {
      const errorToastStyle = {
        background: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#b91c1c",
      };

      if (error instanceof ORPCError) {
        toast.error(
          error.message || "Failed to submit onboarding, please try again.",
          {
            style: errorToastStyle,
          },
        );
      } else {
        toast.error("Failed to submit onboarding, please try again.", {
          style: errorToastStyle,
        });
      }
    },
  });
};

/**
 * Hook for fetching all onboarding applications
 */
export const useGetAllApplications = () => {
  return useQuery({
    queryKey: ["onboarding-applications"],
    queryFn: async () => {
      const result = await orpcClient.onboarding.getAllApplications();
      return result;
    },
  });
};

/**
 * Hook for fetching application summary counts
 */
export const useApplicationSummary = () => {
  return useQuery({
    queryKey: ["onboarding-summary"],
    queryFn: async () => {
      const result = await orpcClient.onboarding.getApplicationSummary();
      return result;
    },
  });
};

/**
 * Hook for fetching applications by status
 */
export const useApplicationsByStatus = (
  status: "pending" | "approved" | "rejected",
) => {
  return useQuery({
    queryKey: ["onboarding-applications", status],
    queryFn: async () => {
      const result = await orpcClient.onboarding.getApplicationsByStatus({
        status,
      });
      return result;
    },
  });
};

/**
 * Hook for fetching a single application by ID
 */
export const useApplicationById = (id: string) => {
  return useQuery({
    queryKey: ["onboarding-application", id],
    queryFn: async () => {
      const result = await orpcClient.onboarding.getApplicationById({ id });
      return result;
    },
    enabled: !!id, // Only run query if ID is provided
  });
};

/**
 * Hook for searching applications
 */
export const useSearchApplications = (search: string) => {
  return useQuery({
    queryKey: ["onboarding-applications", "search", search],
    queryFn: async () => {
      const result = await orpcClient.onboarding.searchApplications({ search });
      return result;
    },
    enabled: !!search && search.length > 0,
  });
};

/**
 * Hook for updating application status (Super Admin only)
 */
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      status: "pending" | "approved" | "rejected";
    }) => {
      const result = await orpcClient.onboarding.updateApplicationStatus(data);
      return result;
    },
    onSuccess: () => {
      toast.success("Application status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["onboarding-applications"] });
    },
    onError: (error: unknown) => {
      if (error instanceof ORPCError) {
        toast.error(error.message || "Failed to update application status");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};

// isDefinedError only works when the error comes from a safe()
// call with full type inference. In TanStack
// Query's onError, the error is unknown, so it can't narrow.
// The correct approach here is instanceof ORPCError:
