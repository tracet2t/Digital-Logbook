import prisma from "@/lib/prisma";
import { User, Activity, Mentorship, MentorActivity, Report, MentorFeedback } from "@prisma/client";
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

}

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

  async createActivity(studentId: string, date: Date, timeSpent: number, notes: string) {
    return this.modelClient.create({
      data: {
        studentId,
        date,
        timeSpent,
        notes,
      },
    });
  }

  async updateActivity(id: string, studentId: string, data: { timeSpent?: number; notes?: string }) {
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

}

/*

      //-- Mentorship Repository --//

*/

export class MentorshipRepository extends BaseRepository<Mentorship> {

  constructor() {
    super(prisma.mentorship);
  }

  async getMentorWithStudents(mentorId: string): Promise<any[]> {
    return this.modelClient.findMany({
      where: { mentorId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            activities: {
              select: {
                id: true,
                date: true,
                timeSpent: true,
                notes: true,
                feedback: {
                  select: {
                    status: true,
                    feedbackNotes: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getMentorshipsByMentorId(mentorId: string) {
    return this.modelClient.findMany({
      where: { mentorId: mentorId },
      include: {
        student: true, // Fetch the student details associated with each mentorship
      },
    });
  }

}

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

  async updateMentorActivity(id: string, mentorId: string, data: {
      workingHours?: number;
      activities?: string;
  }) {
      return this.modelClient.update({
          where: {
              id,
              mentorId,
          },
          data,
      });
  }
}

/*

      //-- Report Repository --//

*/


export class ReportRepository extends BaseRepository<Report> {

  constructor() {
    super(prisma.report);
  }
  
}


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

  async upsertFeedback(activityId: string, mentorId: string, review: string, status: string) {
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


