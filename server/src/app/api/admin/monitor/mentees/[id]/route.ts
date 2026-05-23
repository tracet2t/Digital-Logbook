import getSession from "@/server_actions/getSession";
import { Role, WarningCategory } from "@prisma/client";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SEVERITY_ORDER: (WarningCategory | null)[] = [
  "high",
  "medium",
  "low",
  null,
];

const getHighestSeverity = (
  warnings: { warningType: WarningCategory | null }[],
) => {
  for (const level of SEVERITY_ORDER) {
    if (warnings.some((warning) => warning.warningType === level)) {
      return level;
    }
  }
  return null;
};

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const menteeId = params.id;
    if (!menteeId) {
      return NextResponse.json(
        { message: "Missing mentee id" },
        { status: 400 },
      );
    }

    const mentee = await prisma.user.findUnique({
      where: { id: menteeId, role: Role.student },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        batchNo: true,
        createdAt: true,
      },
    });

    if (!mentee) {
      return NextResponse.json(
        { message: "Mentee not found" },
        { status: 404 },
      );
    }

    const [projects, mentorInfo, activities, warnings] = await Promise.all([
      prisma.projectAllocation.findMany({
        where: { studentId: menteeId },
        select: {
          project: {
            select: { id: true, name: true, description: true, batchNo: true },
          },
          timeAllocationStatus: true,
          assignedAt: true,
        },
      }),
      prisma.projectMentor.findFirst({
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
            select: { id: true, name: true },
          },
        },
      }),
      prisma.activity.findMany({
        where: { studentId: menteeId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          date: true,
          createdAt: true,
          timeSpent: true,
          notes: true,
          technologies: true,
          status: true,
          feedback: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { status: true, feedbackNotes: true },
          },
        },
      }),
      prisma.warningStatus.findMany({
        where: { studentId: menteeId },
        select: { warningType: true },
      }),
    ]);

    const totalHours = activities.reduce(
      (sum, activity) => sum + (activity.timeSpent ?? 0),
      0,
    );

    const response = {
      profile: {
        id: mentee.id,
        firstName: mentee.firstName,
        lastName: mentee.lastName,
        fullName: `${mentee.firstName} ${mentee.lastName}`,
        email: mentee.email,
        isActive: mentee.isActive,
        batchNo: mentee.batchNo,
        createdAt: mentee.createdAt,
      },
      projects: projects.map((allocation) => ({
        id: allocation.project.id,
        name: allocation.project.name,
        description: allocation.project.description,
        batchNo: allocation.project.batchNo,
        allocationStatus: allocation.timeAllocationStatus,
        assignedAt: allocation.assignedAt,
      })),
      mentor: mentorInfo
        ? {
            id: mentorInfo.mentor.id,
            firstName: mentorInfo.mentor.firstName,
            lastName: mentorInfo.mentor.lastName,
            fullName: `${mentorInfo.mentor.firstName} ${mentorInfo.mentor.lastName}`,
            email: mentorInfo.mentor.email,
            projectAssigned: mentorInfo.project.name,
          }
        : null,
      statistics: {
        totalHours: Math.round(totalHours * 10) / 10,
      },
      tasks: activities.map((activity) => ({
        id: activity.id,
        date: activity.date,
        createdAt: activity.createdAt,
        timeSpent: activity.timeSpent ?? 0,
        notes: activity.notes ?? "",
        technologies: activity.technologies ?? [],
        status: activity.status,
        feedback: activity.feedback,
      })),
      warningSeverity: getHighestSeverity(warnings),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching mentee detail:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
