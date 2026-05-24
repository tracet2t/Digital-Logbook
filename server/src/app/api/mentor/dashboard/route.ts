import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";

function formatLastActivity(date: Date | null): string {
  if (!date) return "Never";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  if (diffMs < 0) return "Just now";

  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) return "Just now";

  const diffMins = Math.floor(diffSeconds / 60);
  if (diffMins < 60) {
    return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const startOfThatDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const diffDays = Math.floor((startOfToday - startOfThatDay) / 86400000);

  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

    if (projectIds.length === 0) {
      return NextResponse.json({
        stats: {
          totalMentees: 0,
          projects: projectCount,
          totalWorkingHours: 0,
          averageWorkingHours: 0,
        },
        recentlyActiveMentees: [],
      });
    }

    // Fetch total mentees (students assigned to mentor's projects)
    const mentees = await prisma.projectAllocation.findMany({
      where: { projectId: { in: projectIds } },
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
      distinct: ["studentId"],
    });

    const menteeCount = mentees.length;

    const studentIds = mentees.map((m) => m.student.id);

    // Fetch student activities for working hours calculation
    const studentActivities = await prisma.activity.findMany({
      where: { studentId: { in: studentIds } },
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
    // Recently active mentees should be based on most recently submitted task.
    // We compute lastSubmittedAt per student using Activity.createdAt and sort.
    const lastSubmittedByStudent = await prisma.activity.groupBy({
      by: ["studentId"],
      where: { studentId: { in: studentIds } },
      _max: { createdAt: true },
    });

    const lastSubmittedMap = new Map<string, Date>();
    for (const row of lastSubmittedByStudent) {
      if (row._max.createdAt) {
        lastSubmittedMap.set(row.studentId, row._max.createdAt);
      }
    }

    const menteesSortedBySubmission = [...mentees].sort((a, b) => {
      const aTime = lastSubmittedMap.get(a.student.id)?.getTime() ?? -1;
      const bTime = lastSubmittedMap.get(b.student.id)?.getTime() ?? -1;
      return bTime - aTime;
    });

    const topRecentlyActive = menteesSortedBySubmission.slice(0, 5);

    const recentMenteesWithActivity = await Promise.all(
      topRecentlyActive.map(async (allocation) => {
        const latestSubmittedActivity = await prisma.activity.findFirst({
          where: { studentId: allocation.student.id },
          orderBy: { createdAt: "desc" },
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
        const name = `${allocation.student.firstName} ${allocation.student.lastName}`;

        const lastSubmittedAt = lastSubmittedMap.get(allocation.student.id) ?? null;
        const lastActivityText = formatLastActivity(lastSubmittedAt);

        // Map activity status to dashboard status
        let dashboardStatus: "ACCEPTED" | "PENDING" | "REJECTED" = "PENDING";
        if (latestSubmittedActivity) {
          let activityState = latestSubmittedActivity.status ?? "pending";
          if (
            latestSubmittedActivity.feedback &&
            latestSubmittedActivity.feedback.length > 0
          ) {
            activityState = latestSubmittedActivity.feedback[0].status as any;
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
          id: allocation.student.id,
          initials,
          name,
          project: allocation.project.name,
          lastActivity: lastActivityText,
          status: dashboardStatus,
        };
      }),
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
