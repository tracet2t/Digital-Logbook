/**
 * Mentee Profile API Types
 * Types for the secure mentee profile endpoint response
 */

export interface MenteeProfileResponse {
  success: boolean;
  data: MenteeProfileData;
  timestamp: string;
}

export interface MenteeProfileData {
  profile: MenteeProfile;
  projects: ProjectInfo[];
  mentor: MentorInfo | null;
  badges: BadgeInfo[];
  statistics: ActivityStatistics;
  recentActivities: ActivityInfo[];
}

export interface MenteeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  role: "student" | "mentor" | "superAdmin";
  isActive: boolean;
  isFirstTimeLogin: boolean;
  batchNo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectInfo {
  id: string;
  name: string;
  description: string | null;
  batchNo: string | null;
  allocationStatus: "inReview" | "accepted" | "rejected";
  assignedAt: Date;
}

export interface MentorInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName: string;
  projectAssigned: string;
}

export interface BadgeInfo {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  awardedAt: Date;
}

export interface ActivityStatistics {
  totalActivities: number;
  approvedActivities: number;
  pendingActivities: number;
  rejectedActivities: number;
  totalHours: number;
  profileCompletion: number;
}

export interface ActivityInfo {
  id: string;
  date: Date;
  timeSpent: number | null;
  status: string;
  feedbackStatus: string | null;
  feedbackNotes: string | null;
}

export interface MenteeProfileError {
  success: false;
  message: string;
  error?: string;
}
