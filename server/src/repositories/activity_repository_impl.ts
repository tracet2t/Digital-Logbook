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

  async getApprovedHours(studentId: string): Promise<number> {
    const result = await this.modelClient.aggregate({
      _sum: {
        timeSpent: true,
      },
      where: {
        studentId,
        feedback: {
          some: {
            status: "approved",
          },
        },
      },
    });

    return result._sum.timeSpent ?? 0;
  }

  async getTotalApprovedHours(studentId: string, projectId: string): Promise<number> {
    const result = await this.modelClient.aggregate({
      _sum: {
        timeSpent: true,
      },
      where: {
        studentId,
        student: {
          allocations: {
            some: {
              projectId,
            },
          },
        },
        feedback: {
          some: {
            status: "approved",
          },
        },
      },
    });

    return result._sum.timeSpent ?? 0;
  }
}
