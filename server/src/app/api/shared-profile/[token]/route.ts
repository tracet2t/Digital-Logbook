import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/shared-profile/[token]
 * @param token - The unique share token from the URL path
 * @returns {Object} Full mentee profile (same shape as the authenticated endpoint)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } },
) {
  try {
    const { token } = params;

    // ─── VALIDATE SHARE TOKEN ─────────────────────────────
    const sharedProfile = await prisma.sharedProfile.findUnique({
      where: { token, isActive: true },
    });

    if (!sharedProfile) {
      return NextResponse.json(
        {
          success: false,
          message: "Share link not found or has been deactivated",
        },
        { status: 404 },
      );
    }

    // Check expiration
    if (sharedProfile.expiresAt && new Date() > sharedProfile.expiresAt) {
      return NextResponse.json(
        { success: false, message: "Share link has expired" },
        { status: 410 },
      );
    }

    // ─── FETCH PROFILE DATA ───────────────────────────────
    const profileData = await prisma.user.findUnique({
      where: { id: sharedProfile.studentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        batchNo: true,
        createdAt: true,
        projectAllocations: {
          select: {
            id: true,
            project: {
              select: {
                id: true,
                name: true,
                description: true,
                batchNo: true,
              },
            },
            timeAllocationStatus: true,
            assignedAt: true,
          },
        },
        badges: {
          select: {
            badge: {
              select: {
                id: true,
                name: true,
                description: true,
                iconUrl: true,
              },
            },
            awardedAt: true,
          },
        },
        activities: {
          select: {
            id: true,
            date: true,
            timeSpent: true,
            status: true,
            feedback: {
              select: {
                id: true,
                status: true,
                feedbackNotes: true,
              },
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!profileData) {
      return NextResponse.json(
        { success: false, message: "Mentee not found" },
        { status: 404 },
      );
    }

    // ─── FETCH MENTOR INFORMATION ──────────────────────────
    const mentorInfo = await prisma.projectMentor.findFirst({
      where: {
        project: {
          assignments: {
            some: { studentId: sharedProfile.studentId },
          },
        },
      },
      select: {
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    // ─── CALCULATE STATISTICS ─────────────────────────────
    // Uses same effective-status logic as TaskTimeline/getEffectiveStatus:
    // feedback[0]?.status takes priority, falls back to activity.status,
    // and normalises "approved" ↔ "accepted".
    const totalActivities = profileData.activities.length;

    let approvedActivities = 0;
    let pendingActivities = 0;
    let rejectedActivities = 0;

    for (const a of profileData.activities) {
      const fb = a.feedback[0]?.status?.toLowerCase();

      if (fb === "approved" || fb === "accepted" || a.status === "accepted") {
        approvedActivities++;
      } else if (fb === "rejected" || a.status === "rejected") {
        rejectedActivities++;
      } else {
        pendingActivities++;
      }
    }

    const totalHours = profileData.activities.reduce(
      (sum, a) => sum + (a.timeSpent || 0),
      0,
    );

    // ─── CONSTRUCT RESPONSE ────────────────────────────────
    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profileData.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          fullName: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          isActive: profileData.isActive,
          batchNo: profileData.batchNo,
        },
        projects: profileData.projectAllocations.map((a) => ({
          id: a.project.id,
          name: a.project.name,
          description: a.project.description,
          batchNo: a.project.batchNo,
          allocationStatus: a.timeAllocationStatus,
          assignedAt: a.assignedAt,
        })),
        mentor: mentorInfo
          ? {
              id: mentorInfo.mentor.id,
              firstName: mentorInfo.mentor.firstName,
              lastName: mentorInfo.mentor.lastName,
              fullName: `${mentorInfo.mentor.firstName} ${mentorInfo.mentor.lastName}`,
              projectAssigned: mentorInfo.project.name,
            }
          : null,
        badges: profileData.badges.map((ub) => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          iconUrl: ub.badge.iconUrl,
          awardedAt: ub.awardedAt,
        })),
        statistics: {
          totalActivities,
          approvedActivities,
          pendingActivities,
          rejectedActivities,
          totalHours: Math.round(totalHours * 100) / 100,
        },
        recentActivities: profileData.activities.map((a) => ({
          id: a.id,
          date: a.date,
          timeSpent: a.timeSpent,
          status: a.status,
          feedbackStatus: a.feedback[0]?.status ?? null,
          feedbackNotes: a.feedback[0]?.feedbackNotes ?? null,
        })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching shared profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
