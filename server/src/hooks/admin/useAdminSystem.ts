"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ResetPasswordInput {
  userId: string;
  newPassword: string;
}

interface BulkUploadInput {
  file: File;
  userType: "student" | "mentor" | "admin";
}

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await fetch(`/api/users/${data.userId}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: data.newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useBulkUploadUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BulkUploadInput) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("userType", data.userType);

      const response = await fetch("/api/users/bulk-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload users");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
