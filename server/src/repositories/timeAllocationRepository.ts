import prisma from "@/lib/prisma";
import { TimeAllocationStatus } from "@prisma/client";

export class TimeAllocationRepository {
  /**
   * Get the total approved working hours and the current allocation status for a mentee on a project.
   */
  async getTimeAllocationDetails(projectId: string, studentId: string) {
    // Fetch the allocation record to get status
    const allocation = await prisma.projectAllocation.findUnique({
      where: {
        projectId_studentId: {
          projectId,
          studentId,
        },
      },
      select: {
        timeAllocationStatus: true,
      },
    });

    if (!allocation) {
      throw new Error("Project allocation not found for student.");
    }

    // Calculate total approved working hours directly from the database
    // We fetch all activities for this student and evaluate feedback status mechanically
    const studentActivities = await prisma.activity.findMany({
      where: { studentId },
      select: {
        timeSpent: true,
        status: true,
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { status: true },
        },
      },
    });

    let totalWorkingMinutes = 0;
    for (const a of studentActivities) {
      let activityStatus = a.status ?? "pending";
      if (a.feedback && a.feedback.length > 0) {
        activityStatus = a.feedback[0].status as any;
      }
      const normalizedStatus = activityStatus === "accepted" ? "approved" : activityStatus;
      if (normalizedStatus === "approved") {
        totalWorkingMinutes += a.timeSpent;
      }
    }

    const totalWorkingHours = totalWorkingMinutes;

    return {
      status: allocation.timeAllocationStatus,
      totalWorkingHours,
    };
  }

  /**
   * Update the time allocation review status for a student's project
   */
  async updateAllocationStatus(
    projectId: string,
    studentId: string,
    status: TimeAllocationStatus
  ) {
    const updated = await prisma.projectAllocation.update({
      where: {
        projectId_studentId: {
          projectId,
          studentId,
        },
      },
      data: {
        timeAllocationStatus: status,
      },
    });

    return updated;
  }
}

export const timeAllocationRepository = new TimeAllocationRepository();
