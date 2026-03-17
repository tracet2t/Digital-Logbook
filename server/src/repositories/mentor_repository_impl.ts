import prisma from "@/lib/prisma";
import {MentorActivity,} from "@prisma/client";
import BaseRepository from "./baseRepository";
/*

      //-- Mentor Activity Repository --//

*/

export class MentorRepository extends BaseRepository<MentorActivity> {
  constructor() {
    super(prisma.mentorActivity);
  }

  async getMentorActivities(mentorId: string, date?: Date) {
    return this.modelClient.findMany({
      where: {
        mentorId,
        ...(date && { date }),
      },
    });
  }

  async createMentorActivity(data: {
    mentorId: string;
    date: Date;
    workingHours: number;
    activities: string;
  }) {
    return this.modelClient.create({
      data,
    });
  }

  async updateMentorActivity(
    id: string,
    mentorId: string,
    data: {
      workingHours?: number;
      activities?: string;
    },
  ) {
    return this.modelClient.update({
      where: {
        id,
        mentorId,
      },
      data,
    });
  }
}