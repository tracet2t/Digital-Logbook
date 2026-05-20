"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

// interface GetInvitationResponse {
//   valid: boolean;
//   email?: string;
//   role?: string;
//   message?: string;
// }

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

export const useRecentInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const res = await fetch("/api/invitations");
      if (!res.ok) throw new Error("Failed to fetch invitations");
      return res.json();
    },
  });
};

export const useExpireInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "Expired" }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to expire invitation");
      }
    },
    onSuccess: () => {
      toast.success("Invitation marked as expired.");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to expire invitation");
    },
  });
};

export const useChangeInvitationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { id: string; status: "Accepted" | "Pending" | "Expired" }
  >({
    mutationFn: async ({ id, status }) => {
      const res = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Failed to update invitation status",
        );
      }
    },
    onSuccess: () => {
      toast.success("Invitation status updated.");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update invitation status");
    },
  });
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`/api/invitations?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete invitation");
      }
    },
    onSuccess: () => {
      toast.success("Invitation and user data deleted.");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete invitation");
    },
  });
};

export const useValidateInvitation = (token: string) => {
  return useQuery({
    queryKey: ["invitation", token],
    queryFn: async () => {
      const res = await fetch(`/api/invitations?token=${token}`);
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    },
    enabled: !!token,
  });
};

export const useGetInvitation = (token: string | null) => {
  const query = useQuery<InvitationResponse, Error>({
    queryKey: ["invitation", token],
    queryFn: async () => {
      if (!token) throw new Error("Token is required");

      const res = await fetch(`/api/invitations?token=${token}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Failed to fetch invitation");
        throw new Error(errorData.message || "Failed to fetch invitation");
      }

      return res.json();
    },
    enabled: !!token, // Only runs when token exists
  });

  return query;
};
