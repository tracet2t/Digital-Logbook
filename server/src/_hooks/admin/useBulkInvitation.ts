"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ORPCError } from "@orpc/client";
import { toast } from "sonner";

import { orpcClient } from "@/lib/orpc";

interface BulkInvitationData {
  email: string;
  role: "student" | "mentor" | "superAdmin";
  firstName: string;
  lastName: string;
  projectId?: string;
}

interface BulkInvitationResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

export const useBulkSendInvitations = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BulkInvitationResult,
    ORPCError<string, unknown>,
    BulkInvitationData[]
  >({
    mutationFn: async (invitations) => {
      return await orpcClient.invitations.sendBulkInvitations({
        invitations,
      });
    },
    onSuccess: (result) => {
      // Refresh invitations list
      queryClient.invalidateQueries({ queryKey: ["invitations"] });

      // Show summary toast
      if (result.failed === 0) {
        toast.success(`Successfully sent ${result.success} invitations!`);
      } else if (result.success === 0) {
        toast.error(`Failed to send all invitations. Please check the errors.`);
      } else {
        toast.warning(
          `Sent ${result.success} invitations. ${result.failed} failed.`,
        );
      }
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to send bulk invitations. Please try again.",
      );
    },
  });

  return {
    sendBulkInvitations: async (
      invitations: BulkInvitationData[],
      onComplete?: (result: BulkInvitationResult) => void,
    ) => {
      const result = await mutation.mutateAsync(invitations);
      if (onComplete) {
        onComplete(result);
      }
      return result;
    },
    isLoading: mutation.isPending,
    progress: {
      current: 0,
      total: 0,
      percentage: 0,
    },
    cancelBulkSend: () => {
      // No-op: server-side processing is atomic
      // Kept for backwards compatibility with UI
    },
  };
};
