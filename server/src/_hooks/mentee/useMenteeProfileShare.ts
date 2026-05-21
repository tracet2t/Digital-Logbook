"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────

/** Response shape from the share link endpoints */
interface ShareLinkData {
  token: string;
  shareUrl: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string | null;
}

interface ShareLinkResponse {
  success: boolean;
  data: ShareLinkData | null;
  message?: string;
}

// ── Query Keys ─────────────────────────────────────────────────────────────────

const SHARE_LINK_KEY = ["mentee-share-link"] as const;

// ── Hooks ──────────────────────────────────────────────────────────────────────

/**
 * useMenteeShareLink
 * Fetches the current share link for the authenticated mentee.
 */
export const useMenteeShareLink = () => {
  return useQuery<ShareLinkData | null, Error>({
    queryKey: SHARE_LINK_KEY,
    queryFn: async (): Promise<ShareLinkData | null> => {
      const res = await fetch("/api/mentee/profile/share");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to fetch share link");
      }
      const json: ShareLinkResponse = await res.json();
      return json.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * useGenerateShareLink
 */
export const useGenerateShareLink = () => {
  const queryClient = useQueryClient();

  return useMutation<ShareLinkData, Error, { regenerate?: boolean }>({
    mutationFn: async (opts): Promise<ShareLinkData> => {
      const res = await fetch("/api/mentee/profile/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate: opts?.regenerate ?? false }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to generate share link");
      }
      const json: ShareLinkResponse = await res.json();
      if (!json.data) throw new Error("No share link returned");
      return json.data;
    },
    onSuccess: (data) => {
      // Invalidate the share link cache so the UI reflects the new token
      queryClient.invalidateQueries({ queryKey: SHARE_LINK_KEY });
      // Copy the shareable URL to clipboard for convenience
      navigator.clipboard.writeText(data.shareUrl).catch(() => {});
      toast.success("Share link copied to clipboard!");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};

/**
 * useDeactivateShareLink
 *
 * Deactivates the current share link so it can no longer be accessed publicly.
 */
export const useDeactivateShareLink = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      const res = await fetch("/api/mentee/profile/share", {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to deactivate share link");
      }
    },
    onSuccess: () => {
      // Invalidate so the UI returns to the "no link" state
      queryClient.invalidateQueries({ queryKey: SHARE_LINK_KEY });
      toast.success("Share link deactivated");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};
