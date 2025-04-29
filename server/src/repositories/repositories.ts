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
      where: { activityID: id },
    });
  }

  async findActivityById(id: string) {
    return this.modelClient.findUnique({
      where: { activityID: id },
      select: { createdAt: true, userID: true },
    });
  }

  async findActivitiesByStudentIds(studentIds: string[], date?: Date) {
    return this.modelClient.findMany({
      where: {
        studentId: { in: studentIds },
        ...(date && {
          date: {
            gte: date,
            lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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

  async getMentorshipsByMentorId(mentorId: string) {
    return prisma.project.findMany({
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

  // Get all projects by a mentor
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

  // Get a single project by ID
  async getProjectById(projectID: number) {
    return this.modelClient.findUnique({
      where: { projectID },
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

  // Create a new project
  async createProject(data: {
    projectTitle: string;
    projectDescription: string;
    progress: number;
    startedAt: Date;
    deadline: Date;
    teamName: string;
    mentorID?: string;
    studentIDs?: string[]; // optional for linking students
  }) {
    return this.modelClient.create({
      data: {
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        progress: data.progress,
        startedAt: data.startedAt,
        deadline: data.deadline,
        teamName: data.teamName,
        mentorID: data.mentorID,
        students: data.studentIDs
          ? {
              connect: data.studentIDs.map((id) => ({ userID: id })),
            }
          : undefined,
      },
    });
  }

  // Update an existing project
  async updateProject(projectID: number, updates: Partial<Project>) {
    return this.modelClient.update({
      where: { projectID },
      data: updates,
    });
  }

  // Soft delete a project
  async softDeleteProject(projectID: number) {
    return this.modelClient.update({
      where: { projectID },
      data: {
        isDeleted: true,
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

  async upsertFeedback(activityId: string, mentorId: string, review: string, status: string) {
    const existingFeedback = await this.modelClient.findFirst({
      where: {
        activityID: activityId,
        mentorID: mentorId,
      },
    });

    if (existingFeedback) {
      return this.modelClient.update({
        where: { id: existingFeedback.id },
        data: { review, status },
      });
    } else {
      return this.modelClient.create({
        data: {
          activityID: activityId,
          mentorID: mentorId,
          review,
          status,
        },
      });
    }
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
