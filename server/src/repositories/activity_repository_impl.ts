import { Activity } from "@prisma/client";

import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

/*

      //-- Activity Repository --//

*/

export class ActivityRepository extends BaseRepository<Activity> {
  constructor() {
    super(prisma.activity);
  }

  private mapMenteeDashboardStatus(
    activityStatus: string,
    feedbackStatus?: string,
  ): "APPROVED" | "PENDING" | "REJECTED" {
    const normalized = (feedbackStatus ?? activityStatus ?? "pending").toLowerCase();

    if (normalized === "accepted" || normalized === "approved") {
      return "APPROVED";
    }

    if (normalized === "rejected") {
      return "REJECTED";
    }

    return "PENDING";
  }

  async getMenteeDashboardData(
    studentId: string,
    page: number,
    pageSize: number,
  ): Promise<{
    stats: {
      totalHoursLogged: number;
      tasksCompleted: number;
      pendingApprovals: number;
    };
    activities: Array<{
      feedback: string;
      date: string;
      hours: number;
      status: "APPROVED" | "PENDING" | "REJECTED";
    }>;
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const skip = (safePage - 1) * safePageSize;

    const [
      totalHoursAggregate,
      completedCount,
      pendingCount,
      totalItems,
      activities,
    ] = await prisma.$transaction([
      prisma.activity.aggregate({
        where: { studentId },
        _sum: { timeSpent: true },
      }),
      prisma.activity.count({
        where: { studentId, status: "accepted" },
      }),
      prisma.activity.count({
        where: { studentId, status: "pending" },
      }),
      prisma.activity.count({
        where: { studentId },
      }),
      prisma.activity.findMany({
        where: { studentId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        skip,
        take: safePageSize,
        select: {
          date: true,
          timeSpent: true,
          notes: true,
          status: true,
          feedback: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              status: true,
              feedbackNotes: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));

    return {
      stats: {
        totalHoursLogged: totalHoursAggregate._sum.timeSpent ?? 0,
        tasksCompleted: completedCount,
        pendingApprovals: pendingCount,
      },
      activities: activities.map((activity) => {
        const latestFeedback = activity.feedback[0];

        return {
          feedback:
            latestFeedback?.feedbackNotes?.trim() ||
            activity.notes?.trim() ||
            "No feedback available",
          date: activity.date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          hours: activity.timeSpent,
          status: this.mapMenteeDashboardStatus(
            activity.status,
            latestFeedback?.status,
          ),
        };
      }),
      pagination: {
        page: safePage,
        pageSize: safePageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async findByStudentId(studentId: string, date?: Date) {
    // Use a date-range filter (start of day → start of next day) instead of exact
    // DateTime equality to avoid timezone edge cases.
    const dateFilter = date
      ? {
          gte: new Date(date.toISOString().slice(0, 10) + "T00:00:00.000Z"),
          lt: new Date(date.toISOString().slice(0, 10) + "T23:59:59.999Z"),
        }
      : undefined;

    return this.modelClient.findMany({
      where: {
        studentId,
        ...(dateFilter && { date: dateFilter }),
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
    // Do NOT pass `status` here — the column has DEFAULT 'pending' at the DB level.
    // Passing it would throw PrismaClientValidationError until `prisma generate`
    // is re-run after the 20260329124601_add_activity_status migration.
    return this.modelClient.create({
      data: {
        studentId,
        date,
        timeSpent,
        notes,
      },
    });
  }

  /**
   * Update activity status when mentor accepts/rejects.
   * Uses a cast through unknown because the Prisma client was generated before
   * the ActivityStatus migration — safe to remove cast after `prisma generate`.
   */
  async updateActivityStatus(
    id: string,
    status: "accepted" | "rejected" | "pending",
  ) {
    type UpdateFn = (args: {
      where: { id: string };
      data: { status: string };
    }) => Promise<Record<string, unknown>>;

    return (prisma.activity as unknown as { update: UpdateFn }).update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Get accepted activities only (approved by mentor)
   */
  async getAcceptedActivities(studentId: string) {
    return this.modelClient.findMany({
      where: {
        studentId,
        status: "accepted",
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * Get pending activities (awaiting mentor approval)
   */
  async getPendingActivities(studentId: string) {
    return this.modelClient.findMany({
      where: {
        studentId,
        status: "pending",
      },
      include: {
        feedback: {
          select: {
            status: true,
            feedbackNotes: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
  }

  /**
   * Get total ACCEPTED work hours only
   */
  async getStudentAcceptedHours(
    studentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<number> {
    const activities = await this.modelClient.findMany({
      where: {
        studentId,
        status: "accepted",
        ...(startDate && { date: { gte: startDate } }),
        ...(endDate && { date: { lte: endDate } }),
      },
      select: { timeSpent: true },
    });

    return activities.reduce(
      (sum: number, activity: { timeSpent: number }) =>
        sum + activity.timeSpent,
      0,
    );
  }

  /**
   * Get hours breakdown by status
   */
  async getStudentHoursByStatus(
    studentId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    studentId: string;
    acceptedHours: number;
    pendingHours: number;
    rejectedHours: number;
    totalHours: number;
  }> {
    const activities = await this.modelClient.findMany({
      where: {
        studentId,
        ...(startDate && { date: { gte: startDate } }),
        ...(endDate && { date: { lte: endDate } }),
      },
      select: { timeSpent: true, status: true },
    });

    let acceptedHours = 0;
    let pendingHours = 0;
    let rejectedHours = 0;

    activities.forEach((activity: { timeSpent: number; status: string }) => {
      if (activity.status === "accepted") {
        acceptedHours += activity.timeSpent;
      } else if (activity.status === "pending") {
        pendingHours += activity.timeSpent;
      } else if (activity.status === "rejected") {
        rejectedHours += activity.timeSpent;
      }
    });

    return {
      studentId,
      acceptedHours,
      pendingHours,
      rejectedHours,
      totalHours: acceptedHours + pendingHours + rejectedHours,
    };
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
    const dateFilter = date
      ? {
          gte: new Date(date.slice(0, 10) + "T00:00:00.000Z"),
          lt: new Date(date.slice(0, 10) + "T23:59:59.999Z"),
        }
      : undefined;

    return this.modelClient.findMany({
      where: {
        studentId: studentId,
        ...(dateFilter && { date: dateFilter }),
      },
      include: {
        feedback: {
          orderBy: { createdAt: "asc" },
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
   */
  async getMenteeActivitySummary(
    studentId: string,
    projectId?: string,
  ): Promise<{
    studentId: string;
    projectId: string | null;
    totalSubmitted: number;
    totalAccepted: number;
    totalAcceptedHours: number;
    totalPending: number;
    totalPendingHours: number;
    totalRejected: number;
    totalRejectedHours: number;
    acceptanceRate: number;
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
          totalAccepted: 0,
          totalAcceptedHours: 0,
          totalPending: 0,
          totalPendingHours: 0,
          totalRejected: 0,
          totalRejectedHours: 0,
          acceptanceRate: 0,
          lastActivityDate: null,
          firstActivityDate: null,
        };
      }
    }

    // Get all activities for the student
    const activities = await this.modelClient.findMany({
      where: { studentId },
      orderBy: { date: "asc" },
    });

    const totalSubmitted = activities.length;
    let totalAccepted = 0;
    let totalAcceptedHours = 0;
    let totalPending = 0;
    let totalPendingHours = 0;
    let totalRejected = 0;
    let totalRejectedHours = 0;

    activities.forEach((activity: { status: string; timeSpent: number }) => {
      if (activity.status === "accepted") {
        totalAccepted++;
        totalAcceptedHours += activity.timeSpent;
      } else if (activity.status === "pending") {
        totalPending++;
        totalPendingHours += activity.timeSpent;
      } else if (activity.status === "rejected") {
        totalRejected++;
        totalRejectedHours += activity.timeSpent;
      }
    });

    const acceptanceRate =
      totalSubmitted > 0 ? totalAccepted / totalSubmitted : 0;

    return {
      studentId,
      projectId: projectId ?? null,
      totalSubmitted,
      totalAccepted,
      totalAcceptedHours,
      totalPending,
      totalPendingHours,
      totalRejected,
      totalRejectedHours,
      acceptanceRate,
      lastActivityDate:
        activities.length > 0 ? activities[activities.length - 1].date : null,
      firstActivityDate: activities.length > 0 ? activities[0].date : null,
    };
  }
}
