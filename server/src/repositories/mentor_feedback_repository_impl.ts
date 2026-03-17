import prisma from "@/lib/prisma";
import {MentorFeedback,} from "@prisma/client";
import BaseRepository from "./baseRepository";
import crypto from "crypto"
/*

      //-- Mentor Feedback Repository --//

*/

export class MentorFeedbackRepository extends BaseRepository<MentorFeedback> {
  constructor() {
    super(prisma.mentorFeedback);
  }

  async getFeedbackByActivityId(activityId: string, date?: Date) {
    return this.modelClient.findFirst({
      where: {
        activityId: String(activityId),
        activity: {
          date: date ? new Date(date) : undefined,
        },
      },
    });
  }

  async upsertFeedback(
    activityId: string,
    mentorId: string,
    review: string,
    status: string,
  ) {
    // Check if the feedback already exists
    const existingFeedback = await this.modelClient.findFirst({
      where: {
        activityId,
        mentorId,
      },
    });

    if (existingFeedback) {
      // Update the existing feedback
      return this.modelClient.update({
        where: {
          id: existingFeedback.id,
        },
        data: {
          feedbackNotes: review,
          status,
        },
      });
    } else {
      // Create new feedback
      return this.modelClient.create({
        data: {
          activityId,
          mentorId,
          feedbackNotes: review,
          status,
        },
      });
    }
  }
}