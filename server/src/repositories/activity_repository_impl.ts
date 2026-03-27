import prisma from "@/lib/prisma";
import {Activity,} from "@prisma/client";
import BaseRepository from "./baseRepository";

/*

      //-- Activity Repository --//

*/

export class ActivityRepository extends BaseRepository<Activity> {
  constructor() {
    super(prisma.activity);
  }

  async findByStudentId(studentId: string, date?: Date) {
    return this.modelClient.findMany({
      where: {
        studentId,
        ...(date && { date }),
      },
      include: {
        feedback: {
          select: {
            status: true,
            feedbackNotes: true,
          },
        },
      },
    });
  }

  async createActivity(
    studentId: string,
    date: Date,
    timeSpent: number,
    notes: string,
  ) {
    return this.modelClient.create({
      data: {
        studentId,
        date,
        timeSpent,
        notes,
      },
    });
  }

  async updateActivity(
    id: string,
    studentId: string,
    data: { timeSpent?: number; notes?: string },
  ) {
    return this.modelClient.update({
      where: {
        id,
        studentId,
      },
      data,
    });
  }

  async findActivityById(id: string) {
    return this.modelClient.findUnique({
      where: { id },
      select: { createdAt: true, studentId: true },
    });
  }

  async deleteActivity(id: string) {
    return this.modelClient.delete({
      where: { id },
    });
  }

  async getStudentFeedbacks(studentId: string, date?: string) {
    return this.modelClient.findMany({
      where: {
        studentId: studentId,
        ...(date && { date: new Date(date) }),
      },
      include: {
        feedback: {
          select: {
            status: true,
            feedbackNotes: true,
          },
        },
      },
    });
  }

  /**
   * Get aggregated activity submission and approval summary for a mentee in a project.
   *
   * @param studentId - Mentee user ID
   * @param projectId - Project ID (optional — if provided, verifies student is allocated to that project)
   * @returns Summary object with counts and approval rate
   */
  async getMenteeActivitySummary(
    studentId: string,
    projectId?: string
  ): Promise<{
    studentId: string;
    projectId: string | null;
    totalSubmitted: number;
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
    approvalRate: number;
    lastActivityDate: Date | null;
    firstActivityDate: Date | null;
  }> {
    // If projectId provided, verify student is allocated to that project
    if (projectId) {
      const allocation = await prisma.projectAllocation.findUnique({
        where: { projectId_studentId: { projectId, studentId } },
      });
      if (!allocation) {
        return {
          studentId,
          projectId,
          totalSubmitted: 0,
          totalApproved: 0,
          totalRejected: 0,
          totalPending: 0,
          approvalRate: 0,
          lastActivityDate: null,
          firstActivityDate: null,
        };
      }
    }

    // Get all activities for the student (Activity has no projectId column)
    const activities = await this.modelClient.findMany({
      where: { studentId },
      include: {
        feedback: {
          select: { status: true },
        },
      },
      orderBy: { date: "asc" },
    });

    const totalSubmitted = activities.length;

    // Count feedback statuses
    let totalApproved = 0;
    let totalRejected = 0;
    let totalPending = 0;

    activities.forEach((activity: any) => {
      if (activity.feedback.length === 0) {
        totalPending++;
      } else {
        const latestFeedback = activity.feedback[activity.feedback.length - 1];
        if (latestFeedback.status === "approved") {
          totalApproved++;
        } else if (latestFeedback.status === "rejected") {
          totalRejected++;
        } else {
          totalPending++;
        }
      }
    });

    const approvalRate =
      totalSubmitted > 0 ? totalApproved / totalSubmitted : 0;

    return {
      studentId,
      projectId: projectId ?? null,
      totalSubmitted,
      totalApproved,
      totalRejected,
      totalPending,
      approvalRate,
      lastActivityDate: activities.length > 0
        ? activities[activities.length - 1].date
        : null,
      firstActivityDate: activities.length > 0
        ? activities[0].date
        : null,
    };
  }
}
