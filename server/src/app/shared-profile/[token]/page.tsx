/**
 * @file Shared profile page — slim orchestrator.
 *
 * Composes the hook and shared components to render a public,
 * shareable mentee profile view.
 */

"use client";

import { useSharedProfilePage } from "@/_hooks/useSharedProfilePage";

import { ProfileSkeleton } from "@/components/mentee/ProfileSkeleton";
import { ProfileBody } from "@/components/shared-profile/ProfileBody";
import { ProfileHeader } from "@/components/shared-profile/ProfileHeader";
import { ProfileStats } from "@/components/shared-profile/ProfileStats";

// ── Page Component ─────────────────────────────────────────────────────────────

/**
 * SharedProfilePage — public profile view accessed via a shareable link.
 */
export default function SharedProfilePage() {
  const { profileData, isLoading, error, heatmapData } = useSharedProfilePage();

  // ── Loading State ──
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-3xl">
          <ProfileSkeleton />
        </div>
      </main>
    );
  }

  // ── Error State ──
  if (error || !profileData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#0F172A]">
            Profile Not Available
          </h1>
          <p className="text-sm text-[#64748B]">
            {error ?? "Share link not found or has been deactivated."}
          </p>
        </div>
      </main>
    );
  }

  const { profile, projects, badges, statistics, recentActivities } =
    profileData;
  const projectNames = projects.map((p) => p.name).join(", ") || "—";

  return (
    <main className="min-h-screen bg-gray-50 text-slate-900">
      <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Branding header */}
        <div className="mb-4">
          <p className="font-inter text-[10px] font-bold tracking-[0.15em] text-[#64748B] uppercase">
            Shared Profile · Digital Logbook
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white shadow-sm">
          <ProfileHeader profile={profile} projectNames={projectNames} />
          <ProfileStats statistics={statistics} />
          <ProfileBody
            badges={badges}
            heatmapData={heatmapData}
            recentActivities={recentActivities}
          />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center font-inter text-[9px] text-[#94A3B8]">
          Powered by T2T Digital Logbook
        </p>
      </div>
    </main>
  );
}
