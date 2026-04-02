"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

interface AllocationResponse {
  message: string;
  data: {
    id: string;
    projectId: string;
    studentId: string;
    status: string;
    totalWorkingHours: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface UseMenteeTimeAllocationProps {
  projectId: string | null;
  studentId: string | null;
  onAllocationChange?: () => void;
  refetchTimeAllocation?: () => Promise<any>;
}

export const useMenteeTimeAllocation = ({
  projectId,
  studentId,
  onAllocationChange,
  refetchTimeAllocation,
}: UseMenteeTimeAllocationProps) => {
  const queryClient = useQueryClient();

  return useMutation<AllocationResponse, Error, string>({
    mutationFn: async (status: string) => {
      const response = await fetch("/api/mentor/mentees/time-allocation", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          studentId,
          status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      return response.json();
    },
    onSuccess: () => {
      refetchTimeAllocation?.();
      queryClient.invalidateQueries({
        queryKey: ["time-allocation", projectId, studentId],
      });
      queryClient.invalidateQueries({ queryKey: ["mentor-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["mentees"] });
      queryClient.invalidateQueries({
        queryKey: ["mentor-students-directory"],
      });
      onAllocationChange?.();

      toast.success("Allocation updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },

    //for moement comment out the model close
    //     // Close dialog after brief delay to show toast
    //     // setTimeout(() => {
    //     //   onClose?.();
    //     // }, 500);
  });
};
