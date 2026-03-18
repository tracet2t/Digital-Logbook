"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

interface InvitationRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "mentor" | "superAdmin";
  projectId?: string;
}

interface InvitationResponse {
  message: string;
  invitation: {
    id: string;
    email: string;
    role: string;
    token: string;
    createdAt: string;
    expiresAt: string;
  };
}

export const useInvitation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<InvitationResponse, Error, InvitationRequest>({
    mutationFn: async (data) => {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send invitation");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send invitation");
    },
  });

  return mutation;
};
