"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { WarningCategory } from "@prisma/client";
import { toast } from "sonner";

type WarningStatusItem = {
  id: string;
  studentId: string;
  comment: string;
  warningType: WarningCategory | null;
};

interface CreateWarningPayload {
  studentId: string;
  comment: string;
  warningType?: WarningCategory | null;
}

interface CreateWarningResponse {
  id: string;
  studentId: string;
  comment: string;
  warningType: WarningCategory | null;
}

/**
 * Hook to fetch warnings for a specific student
 */
export const useWarningStatusList = (studentId?: string | null) => {
  return useQuery({
    queryKey: ["warning-status", studentId],
    queryFn: async () => {
      const response = await fetch(
        `/api/warningStatus?studentId=${encodeURIComponent(studentId ?? "")}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch warning statuses");
      }

      return (await response.json()) as WarningStatusItem[];
    },
    enabled: Boolean(studentId),
  });
};

/**
 * Hook to create a new warning for a student
 */
export const useCreateWarning = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateWarningResponse, Error, CreateWarningPayload>({
    mutationFn: async (payload) => {
      const response = await fetch("/api/warningStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(errorPayload?.message ?? "Failed to create warning");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate the warning list query for this student
      queryClient.invalidateQueries({
        queryKey: ["warning-status", data.studentId],
      });

      toast.success("Warning created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create warning");
    },
  });
};
