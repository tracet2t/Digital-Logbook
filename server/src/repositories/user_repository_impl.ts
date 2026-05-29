import { User } from "@prisma/client";

import prisma from "@/lib/prisma";

import BaseRepository from "./baseRepository";

/*

      //-- User Repository --//

*/

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(prisma.user);
  }

  getByEmail(email: string): Promise<User | null> {
    return this.modelClient.findUnique({
      where: { email },
    });
  }

  async getUserWithActivities(studentId: string) {
    return this.modelClient.findUnique({
      where: {
        id: studentId,
      },
      select: {
        firstName: true,
        lastName: true,
        activities: {
          select: {
            date: true,
            timeSpent: true,
            notes: true,
            createdAt: true,
            feedback: {
              select: {
                status: true,
                feedbackNotes: true,
              },
            },
          },
        },
      },
    });
  }
  async updateByEmail(email: string, data: Partial<User>) {
    return this.modelClient.update({
      where: { email },
      data,
    });
  }
}
