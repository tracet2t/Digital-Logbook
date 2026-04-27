import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";

/**
 * GET /api/mentee/profile
 * 
 * Secure endpoint to retrieve comprehensive mentee profile data with role-based access control.
 * Returns: user profile, assigned projects, mentor information, activity statistics, badges
 * 
 * Authentication: Required (JWT token in HTTP-only cookie)
 * Authorization: student role only
 */
export async function GET(req: NextRequest) {
  try {
    // ─── AUTHENTICATION ────────────────────────────────────
    const session = await getSession();

    if (!session?.isAuthenticated()) {
      return NextResponse.json(
        { 
          success: false,
          message: "Unauthorized - Please login to access profile" 
        },
        { status: 401 }
      );
    }

    // ─── AUTHORIZATION (Role-Based Access Control) ────────
    const role = session.getRole();
    if (role !== "student") {
      return NextResponse.json(
        { 
          success: false,
          message: "Forbidden - Only students can access this endpoint" 
        },
        { status: 403 }
      );
    }

    const menteeId = session.getId();
    if (!menteeId) {
      return NextResponse.json(
        { 
          success: false,
          message: "User ID not found in session" 
        },
        { status: 401 }
      );
    }

    // ─── FETCH PROFILE DATA ────────────────────────────────
    const profileData = await prisma.user.findUnique({
      where: { id: menteeId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isFirstTimeLogin: true,
        batchNo: true,
        createdAt: true,
        updatedAt: true,
        // Project allocations with mentor information
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
        // Badges/achievements
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
        // Recent activities summary
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
          take: 5, // Last 5 activities
        },
      },
    });

    if (!profileData) {
      return NextResponse.json(
        { 
          success: false,
          message: "Mentee profile not found" 
        },
        { status: 404 }
      );
    }

    // ─── FETCH MENTOR INFORMATION ──────────────────────────
    const mentorInfo = await prisma.projectMentor.findFirst({
      where: {
        project: {
          assignments: {
            some: { studentId: menteeId },
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
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // ─── CALCULATE STATISTICS ─────────────────────────────
    const totalActivities = profileData.activities.length;
    const approvedActivities = profileData.activities.filter(
      (a) => a.feedback?.status === "approved"
    ).length;
    const pendingActivities = profileData.activities.filter(
      (a) => a.status === "pending"
    ).length;
    
    const totalHours = profileData.activities.reduce(
      (sum, activity) => sum + (activity.timeSpent || 0),
      0
    );

    // ─── CONSTRUCT RESPONSE ────────────────────────────────
    const response = {
      success: true,
      data: {
        // Profile information
        profile: {
          id: profileData.id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          fullName: `${profileData.firstName} ${profileData.lastName}`,
          role: profileData.role,
          isActive: profileData.isActive,
          isFirstTimeLogin: profileData.isFirstTimeLogin,
          batchNo: profileData.batchNo,
          createdAt: profileData.createdAt,
          updatedAt: profileData.updatedAt,
        },
        
        // Assigned projects
        projects: profileData.projectAllocations.map((allocation) => ({
          id: allocation.project.id,
          name: allocation.project.name,
          description: allocation.project.description,
          batchNo: allocation.project.batchNo,
          allocationStatus: allocation.timeAllocationStatus,
          assignedAt: allocation.assignedAt,
        })),
        
        // Mentor information
        mentor: mentorInfo
          ? {
              id: mentorInfo.mentor.id,
              firstName: mentorInfo.mentor.firstName,
              lastName: mentorInfo.mentor.lastName,
              email: mentorInfo.mentor.email,
              fullName: `${mentorInfo.mentor.firstName} ${mentorInfo.mentor.lastName}`,
              projectAssigned: mentorInfo.project.name,
            }
          : null,
        
        // Badges and achievements
        badges: profileData.badges.map((ub) => ({
          id: ub.badge.id,
          name: ub.badge.name,
          description: ub.badge.description,
          iconUrl: ub.badge.iconUrl,
          awardedAt: ub.awardedAt,
        })),
        
        // Activity statistics
        statistics: {
          totalActivities,
          approvedActivities,
          pendingActivities,
          rejectedActivities: profileData.activities.filter(
            (a) => a.feedback?.status === "rejected"
          ).length,
          totalHours: Math.round(totalHours * 100) / 100,
          profileCompletion: calculateProfileCompletion(profileData),
        },
        
        // Recent activities
        recentActivities: profileData.activities.map((activity) => ({
          id: activity.id,
          date: activity.date,
          timeSpent: activity.timeSpent,
          status: activity.status,
          feedbackStatus: activity.feedback?.status || null,
          feedbackNotes: activity.feedback?.feedbackNotes || null,
        })),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching mentee profile:", error);

    return NextResponse.json(
      { 
        success: false,
        message: "Internal server error while fetching profile data",
        ...(process.env.NODE_ENV === "development" && { error: String(error) }),
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate profile completion percentage based on filled fields
 */
function calculateProfileCompletion(profileData: any): number {
  let completed = 0;
  let total = 0;

  // Required fields
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "batchNo",
  ];

  requiredFields.forEach((field) => {
    total++;
    if (profileData[field]) completed++;
  });

  // Optional but valuable fields
  if (profileData.projectAllocations?.length > 0) completed++;
  if (profileData.badges?.length > 0) completed++;
  if (profileData.activities?.length > 0) completed++;

  total += 3;

  return Math.round((completed / total) * 100);
}
