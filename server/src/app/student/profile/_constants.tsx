/**
 * _constants.tsx
 * Shared types, constants, and pure helper functions for the Mentee Profile page.
 */

import {
  Award,
  GraduationCap,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

// ─── API Types ─────────────────────────────────────────────────────────────────

export type BadgeItem = {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  awardedAt: string;
};

export type ProjectItem = {
  id: string;
  name: string;
  description: string | null;
  batchNo: string | null;
  allocationStatus: string | null;
  assignedAt: string;
};

export type MentorInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  projectAssigned: string;
} | null;

export type Statistics = {
  totalActivities: number;
  approvedActivities: number;
  pendingActivities: number;
  rejectedActivities: number;
  totalHours: number;
  profileCompletion: number;
};

export type ProfileApiData = {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    isActive: boolean;
    batchNo: string | null;
    createdAt: string;
  };
  projects: ProjectItem[];
  mentor: MentorInfo;
  badges: BadgeItem[];
  statistics: Statistics;
  recentActivities: {
    id: string;
    date: string;
    timeSpent: number;
    status: string;
    feedbackStatus: string | null;
    feedbackNotes: string | null;
  }[];
};

export type Task = {
  id: string;
  date: string;
  createdAt: string;
  timeSpent: number;
  notes: string;
  technologies: string[];
  status: string;
  feedback: { status: string; feedbackNotes: string | null }[];
};

/** Severity matching MenteeAvatar warning ring: low=yellow, medium=orange, high=red */
export type WarningSeverity = "low" | "medium" | "high";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Icon color cycle for earned badges */
export const ICON_COLORS = [
  "text-[#000053]",
  "text-[#f97316]",
  "text-[#0d9488]",
  "text-[#eab308]",
  "text-[#8b5cf6]",
  "text-[#ef4444]",
];

/** Severity → visual config. Mirrors MenteeAvatar RING_CLASS colors. */
export const STATUS_CONFIG: Record<
  WarningSeverity,
  {
    dot: string;
    text: string;
    border: string;
    bg: string;
    label: string;
    tooltip: string;
  }
> = {
  low: {
    dot: "bg-yellow-400",
    text: "text-[#A16207]",
    border: "border-[#FEF08A]",
    bg: "bg-[#FEFCE8]",
    label: "LOW",
    tooltip: "Low activity — requires attention",
  },
  medium: {
    dot: "bg-orange-400",
    text: "text-orange-700",
    border: "border-orange-200",
    bg: "bg-orange-50",
    label: "MEDIUM",
    tooltip: "Medium severity — mentor review recommended",
  },
  high: {
    dot: "bg-red-500",
    text: "text-red-700",
    border: "border-red-200",
    bg: "bg-red-50",
    label: "HIGH",
    tooltip: "High severity — immediate attention required",
  },
};

/** Severity resolution order (highest wins) */
export const SEVERITY_ORDER: (WarningSeverity | null)[] = [
  "high",
  "medium",
  "low",
  null,
];

// ─── Pure Helpers ──────────────────────────────────────────────────────────────

/** Returns up-to-2-character uppercase initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Returns a Lucide icon element matching the badge name */
export function badgeIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("commit") || n.includes("first"))
    return <Trophy className="h-4 w-4" />;
  if (n.includes("solver") || n.includes("problem"))
    return <Sparkles className="h-4 w-4" />;
  if (n.includes("certif") || n.includes("log"))
    return <GraduationCap className="h-4 w-4" />;
  if (n.includes("top") || n.includes("contribut"))
    return <Star className="h-4 w-4" />;
  if (n.includes("award")) return <Award className="h-4 w-4" />;
  return <Zap className="h-4 w-4" />;
}

/** Resolves the highest-severity warning type from a list */
export function getHighestSeverity(
  warnings: { warningType: WarningSeverity | null }[],
): WarningSeverity | null {
  for (const level of SEVERITY_ORDER) {
    if (warnings.some((w) => w.warningType === level)) return level;
  }
  return null;
}
