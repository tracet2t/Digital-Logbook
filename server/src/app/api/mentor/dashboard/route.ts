import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getSession from "@/server_actions/getSession";

export const GET = async (_req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();
    if (!mentorId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 401 }
      );
    }

    // Fetch mentor's assigned projects
    const mentorProjects = await prisma.projectMentor.findMany({
      where: { mentorId },
      include: { project: true },
    });

    const projectCount = mentorProjects.length;
    const projectIds = mentorProjects.map((p) => p.project.id);

    // Fetch total mentees (students assigned to mentor's projects)
    const mentees = await prisma.projectAllocation.findMany({
      where: { projectId: { in: projectIds.length > 0 ? projectIds : undefined } },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      distinct: ["studentId"],
    });

    const menteeCount = mentees.length;

    const studentIds = mentees.map((m) => m.student.id);

    // Fetch student activities for working hours calculation
    const studentActivities = await prisma.activity.findMany({
      where: { studentId: { in: studentIds.length > 0 ? studentIds : undefined } },
      select: {
        studentId: true,
        timeSpent: true,
        status: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    let totalWorkingHours = 0;
    
    // Only sum hours for students whose project allocation has been actively accepted by the mentor
    const acceptedStudentIds = new Set(
      mentees
        // @ts-ignore - Prisma type generation issue
        .filter((m) => m.timeAllocationStatus === "accepted")
        .map((m) => m.student.id)
    );

    for (const a of studentActivities) {
      let activityStatus = a.status ?? "pending";
      if (a.feedback && a.feedback.length > 0) {
        activityStatus = a.feedback[0].status as any;
      }
      
      const normalizedStatus = activityStatus === "accepted" ? "approved" : activityStatus;
      
      if (normalizedStatus === "approved" && acceptedStudentIds.has(a.studentId)) {
        totalWorkingHours += a.timeSpent;
      }
    }

    // timeSpent is already in hours
    // totalWorkingHours = Math.round(totalWorkingHours);

    const averageWorkingHours =
      menteeCount > 0
        ? Math.round((totalWorkingHours / menteeCount) * 10) / 10
        : 0;

    // Fetch recently active mentees with latest activity
    const recentlyActiveMentees = await prisma.projectAllocation.findMany({
      where: { projectId: { in: projectIds.length > 0 ? projectIds : undefined } },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { assignedAt: "desc" },
      take: 5,
    });

    // Get latest activity for each mentee
    const recentMenteesWithActivity = await Promise.all(
      recentlyActiveMentees.map(async (allocation) => {
        const latestActivity = await prisma.activity.findFirst({
          where: { studentId: allocation.student.id },
          orderBy: { date: "desc" },
          include: {
            feedback: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });

        const initials =
          allocation.student.firstName.charAt(0) +
          allocation.student.lastName.charAt(0);
        const name =
          `${allocation.student.firstName} ${allocation.student.lastName}`;

        // Calculate time since last activity
        let lastActivityText = "Never";
        if (latestActivity) {
          const now = new Date();
          const lastDate = new Date(latestActivity.date);
          const diffMs = now.getTime() - lastDate.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMins < 60) {
            lastActivityText = `${diffMins} mins ago`;
          } else if (diffHours < 24) {
            lastActivityText = `${diffHours} hours ago`;
          } else if (diffDays === 1) {
            lastActivityText = "Yesterday";
          } else if (diffDays < 7) {
            lastActivityText = `${diffDays} days ago`;
          } else {
            lastActivityText = lastDate.toLocaleDateString();
          }
        }

        // Map activity status to dashboard status  
        let dashboardStatus: "ACCEPTED" | "PENDING" | "REJECTED" = "PENDING";
        if (latestActivity) {
          let activityState = latestActivity.status ?? "pending";
          // Override with highest-priority status from feedback if it exists
          if (latestActivity.feedback && latestActivity.feedback.length > 0) {
            activityState = latestActivity.feedback[0].status as any;
          }

          const statusMap: Record<string, "ACCEPTED" | "PENDING" | "REJECTED"> = {
            accepted: "ACCEPTED",
            approved: "ACCEPTED",
            pending: "PENDING",
            rejected: "REJECTED",
          };
          // @ts-ignore - Prisma type generation issue with status field
          dashboardStatus = statusMap[activityState] ?? "PENDING";
        }

        return {
          initials,
          name,
          project: allocation.project.name,
          lastActivity: lastActivityText,
          status: dashboardStatus,
        };
      })
    );

    return NextResponse.json({
      stats: {
        totalMentees: menteeCount,
        projects: projectCount,
        totalWorkingHours: Math.round(totalWorkingHours * 10) / 10,
        averageWorkingHours,
      },
      recentlyActiveMentees: recentMenteesWithActivity,
    });
  } catch (error) {
    console.error("Error fetching mentor dashboard data:", error);
    return NextResponse.json(
      { message: "Error fetching mentor dashboard data" },
      { status: 500 }
    );
  }
};
