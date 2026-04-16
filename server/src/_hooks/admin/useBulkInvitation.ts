"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

interface BulkInvitationData {
  email: string;
  role: "student" | "mentor" | "superAdmin";
  firstName?: string;
  lastName?: string;
  projectId?: string;
}

interface BulkInvitationResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

interface BulkInvitationProgress {
  current: number;
  total: number;
  percentage: number;
}

export const useBulkSendInvitations = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<BulkInvitationProgress>({
    current: 0,
    total: 0,
    percentage: 0,
  });

  const sendBulkInvitations = async (
    invitations: BulkInvitationData[],
    onComplete?: (result: BulkInvitationResult) => void,
  ) => {
    setIsLoading(true);
    const total = invitations.length;
    let current = 0;
    const result: BulkInvitationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    setProgress({ current: 0, total, percentage: 0 });

    // Send invitations sequentially to avoid overwhelming the server
    for (let i = 0; i < invitations.length; i++) {
      const invitation = invitations[i];

      try {
        const res = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(invitation),
        });

        if (!res.ok) {
          const errorData = await res.json();
          result.failed++;
          result.errors.push({
            row: i + 1,
            email: invitation.email,
            error: errorData.message || "Failed to send invitation",
          });
        } else {
          result.success++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          email: invitation.email,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      current++;
      setProgress({
        current,
        total,
        percentage: Math.round((current / total) * 100),
      });
    }

    // Refresh invitations list
    queryClient.invalidateQueries({ queryKey: ["invitations"] });

    setIsLoading(false);

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

    if (onComplete) {
      onComplete(result);
    }

    return result;
  };

  return {
    sendBulkInvitations,
    isLoading,
    progress,
  };
};
