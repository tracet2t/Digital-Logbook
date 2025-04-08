import prisma from "@/lib/prisma";
import { User, Activity, Mentor, Student, Project, Review, Report } from "@prisma/client";
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

  async getUserWithActivities(userId: string) {
    return this.modelClient.findUnique({
      where: { userID: userId },
      select: {
        firstName: true,
        lastName: true,
        activities: {
          select: {
            date: true,
            timeSpent: true,
            title: true,
            description: true,
            reviews: {
              select: {
                status: true,
                review: true,
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

  async findByUserId(userId: string, date?: Date) {
    return this.modelClient.findMany({
      where: {
        userID: userId,
        ...(date && { date }),
      },
      include: {
        reviews: {
          select: {
            status: true,
            review: true,
          },
        },
      },
    });
  }

  async createActivity(userId: string, date: Date, timeSpent: number, title: string, description: string) {
    return this.modelClient.create({
      data: {
        userID: userId,
        date,
        timeSpent,
        title,
        description,
      },
    });
  }

  async updateActivity(id: string, userId: string, data: { timeSpent?: number; title?: string; notes?: string }) {
    return this.modelClient.update({
      where: {
        activityID: id,
        userID: userId,
      },
      data,
    });
  }

  async deleteActivity(id: string) {
    return this.modelClient.delete({
      where: { id },
    });
  }

  async findActivityById(id: string) {
    return this.modelClient.findMany({
      where: { id },
    });
  }
}

/*

      //-- Mentor Repository --//

*/
export class MentorRepository extends BaseRepository<Mentor> {
  constructor() {
    super(prisma.mentor);
  }

  async getMentorWithStudents(mentorId: string) {
    return this.modelClient.findUnique({
      where: { userID: mentorId },
      include: {
        students: {
          select: {
            userID: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }  
}

/*

      //-- Student Repository --//

*/
export class StudentRepository extends BaseRepository<Student> {
  constructor() {
    super(prisma.student);
  }

  async getStudentWithMentor(studentId: string) {
    return this.modelClient.findUnique({
      where: { userID: studentId },
      include: {
        mentor: {
          select: {
            userID: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}

/*

      //-- Project Repository --//

*/
export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(prisma.project);
  }

  async getProjectsByMentorId(mentorId: string) {
    return this.modelClient.findMany({
      where: { mentorID: mentorId },
      include: {
        students: {
          select: {
            userID: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }
}

/*

      //-- Review Repository --//

*/
export class ReviewRepository extends BaseRepository<Review> {
  constructor() {
    super(prisma.review);
  }

  async getReviewsByActivityId(activityId: string) {
    return this.modelClient.findMany({
      where: { activityID: activityId },
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

  async getReportsByMentorId(mentorId: string) {
    return this.modelClient.findMany({
      where: { mentorID: mentorId },
    });
  }
}
