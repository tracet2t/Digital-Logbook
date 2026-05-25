"use client";

import { useState } from "react";

import {
  useDeactivateShareLink,
  useGenerateShareLink,
  useMenteeShareLink,
} from "@/_hooks/mentee/useMenteeProfileShare";
import { Check, Copy, Link, RefreshCw, Share2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ShareProfileDialog
 *
 * Dialog that lets the mentee generate, view, copy, regenerate, or deactivate
 * a shareable profile link. Uses TanStack Query for data fetching and mutations.
 */
export function ShareProfileDialog() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Queries & Mutations ───────────────────────────────
  const { data: shareLink, isLoading, isError } = useMenteeShareLink();
  const generateMutation = useGenerateShareLink();
  const deactivateMutation = useDeactivateShareLink();

  // ── Handlers ──────────────────────────────────────────
  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: no clipboard access
    }
  };

  const handleGenerate = () => {
    generateMutation.mutate({ regenerate: false });
  };

  const handleRegenerate = () => {
    generateMutation.mutate({ regenerate: true });
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate();
  };

  // ── Render ────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto rounded-full border-[#000053] bg-white px-4 py-1 font-inter text-[10px] font-bold leading-[15px] tracking-[0.05em] text-[#000053] uppercase hover:bg-white"
        >
          <Share2 className="mr-1 h-3 w-3" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-inter text-base font-extrabold text-[#0F172A]">
            Share Your Profile
          </DialogTitle>
          <DialogDescription className="font-inter text-xs text-[#64748B]">
            Anyone with this link can view your public profile. No login
            required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Loading state */}
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-8 w-32" />
            </div>
          )}

          {/* Error fetching share link state */}
          {isError && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="font-inter text-xs font-medium text-red-700">
                Failed to load share link status.
              </p>
            </div>
          )}

          {/* No share link yet — show generate button */}
          {!isLoading && !isError && !shareLink && (
            <div className="space-y-3">
              <p className="font-inter text-xs text-[#64748B]">
                You haven&apos;t created a shareable link yet. Generate one to
                share your profile with others.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full gap-2 bg-[#000053] font-inter text-xs font-bold uppercase hover:bg-[#000053]/90"
              >
                {generateMutation.isPending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link className="h-3.5 w-3.5" />
                )}
                Generate Share Link
              </Button>
            </div>
          )}

          {/* Share link exists and is active */}
          {!isLoading && !isError && shareLink?.isActive && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={shareLink.shareUrl}
                  className="flex-1 font-inter text-xs text-[#334155]"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopyLink(shareLink.shareUrl)}
                  className="flex-shrink-0"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={generateMutation.isPending}
                  className="gap-1.5 font-inter text-[10px] font-bold uppercase"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${generateMutation.isPending ? "animate-spin" : ""}`}
                  />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeactivate}
                  disabled={deactivateMutation.isPending}
                  className="gap-1.5 font-inter text-[10px] font-bold uppercase text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                  Deactivate
                </Button>
              </div>

              <p className="font-inter text-[9px] text-[#94A3B8]">
                Regenerating creates a new link — the old one will stop working.
                Deactivating permanently disables the current link.
              </p>
            </>
          )}

          {/* Share link exists but is deactivated */}
          {!isLoading && !isError && shareLink && !shareLink.isActive && (
            <div className="space-y-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="font-inter text-xs font-medium text-amber-700">
                  Your share link is currently deactivated.
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="w-full gap-2 bg-[#000053] font-inter text-xs font-bold uppercase hover:bg-[#000053]/90"
              >
                {generateMutation.isPending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Link className="h-3.5 w-3.5" />
                )}
                Reactivate Share Link
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
