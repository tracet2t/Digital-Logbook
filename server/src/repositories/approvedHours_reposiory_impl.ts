import prisma from "@/lib/prisma";

/*

      //-- Approved Hours Repository --//

*/

export class ApprovedHoursRepository {
  async getApprovedHours(studentId: string): Promise<number> {
    const result = await prisma.activity.aggregate({
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
    const result = await prisma.activity.aggregate({
      _sum: {
        timeSpent: true,
      },
      where: {
        studentId,
        student: {
          projectAllocations: {
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
