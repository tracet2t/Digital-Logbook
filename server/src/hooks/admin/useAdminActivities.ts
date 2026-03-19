"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateActivityInput {
  id: string;
  studentId: string;
  timeSpent?: number;
  notes?: string;
}

interface ApproveActivityInput {
  activityId: string;
  status: "approved" | "rejected";
  feedbackNotes?: string;
}

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateActivityInput) => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/activity/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      const response = await fetch(`/api/activity/${activityId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useApproveActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ApproveActivityInput) => {
      const response = await fetch(`/api/activity/${data.activityId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: data.status,
          feedbackNotes: data.feedbackNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve/reject activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};
