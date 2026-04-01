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

  /**
   * Get all feedback records for a mentee across all activities and projects.
   * Sorted by activity date (newest first).
   *
   * @param studentId - Mentee user ID
   * @returns Array of feedback records with mentor details and activity info
   */
  async getMenteeFeedbackHistory(studentId: string): Promise<Array<{
    id: string;
    activityId: string;
    mentorId: string;
    mentorName: string;
    status: "approved" | "rejected" | "pending";
    feedbackNotes: string | null;
    activityDate: Date;
    feedbackDate: Date;
  }>> {
    const feedbackRecords = await this.modelClient.findMany({
      where: {
        activity: {
          studentId,
        },
      },
      include: {
        activity: {
          select: {
            date: true,
          },
        },
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Newest first
      },
    });

    return feedbackRecords.map((feedback) => ({
      id: feedback.id,
      activityId: feedback.activityId,
      mentorId: feedback.mentorId,
      mentorName: `${feedback.mentor.firstName} ${feedback.mentor.lastName}`,
      status: feedback.status as "approved" | "rejected" | "pending",
      feedbackNotes: feedback.feedbackNotes,
      activityDate: feedback.activity.date,
      feedbackDate: feedback.createdAt,
    }));
  }
}