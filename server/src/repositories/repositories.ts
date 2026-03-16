import prisma from "@/lib/prisma";
import {
  User,
  Activity,
  MentorActivity,
  Report,
  MentorFeedback,
  Invitation,
  Role,
  Project,
  ProjectAllocation,
} from "@prisma/client";
import BaseRepository from "./baseRepository";
import crypto from "crypto"

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
export class InvitationRepository extends BaseRepository<Invitation> {
  constructor() {
    super(prisma.invitation);
  }

  async createInvite(data: {
    email: string;
    role: Role;
    invitedBy: string; // ID of the super-admin
    tempPassword: string; // hashed
  }) {
    const token = crypto.randomBytes(32).toString("hex"); // secure token
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hours

    //to make sure invitedBy is not null
    if (!data.invitedBy)
      throw new Error("invitedBy (super-admin ID) is required");

    return this.modelClient.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        expiresAt,
        accepted: false,
        tempPassword: data.tempPassword,
        inviter: {
          connect: { id: data.invitedBy }, // ✅ Connect the relation properly
        },
      },
    });
  }

  async findValidInvite(email: string, token: string) {
    return this.modelClient.findFirst({
      where: {
        email,
        token,
        accepted: false,
        expiresAt: { gte: new Date() },
      },
    });
  }

  async markAccepted(id: string) {
    return this.modelClient.update({
      where: { id },
      data: { accepted: true },
    });
  }
}
//-- Project Repository --//
// Manages projects that organize mentorships by grouping students
// under mentors within specific domains (software, film, training, research, other)

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super(prisma.project);
  }

  // Get all projects created by a specific mentor/admin
  async getProjectsByCreator(creatorId: string) {
    return this.modelClient.findMany({
      where: { createdBy: creatorId },
      include: {
        mentors: {
          include: {
            mentor: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  // Get complete project with all assigned mentors and students
  async getProjectWithAssignments(projectId: string) {
    return this.modelClient.findUnique({
      where: { id: projectId },
      include: {
        mentors: {
          include: {
            mentor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
  }

  // Get all students assigned to a project
  async getProjectStudents(projectId: string) {
    const project = await this.modelClient.findUnique({
      where: { id: projectId },
      include: {
        assignments: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
    return (
      project?.assignments.map(
        (a: {
          student: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
          };
        }) => a.student,
      ) || []
    );
  }

  // Get all projects in a specific domain
  async getProjectsByDomain(domain: string) {
    return this.modelClient.findMany({
      where: { domain },
      include: {
        assignments: {
          select: {
            studentId: true,
          },
        },
      },
    });
  }

  // Count total students assigned to a project
  async getProjectStudentCount(projectId: string): Promise<number> {
    return prisma.projectAllocation.count({
      where: { projectId },
    });
  }

  // Check if a student is already assigned to a project
  async isStudentInProject(
    projectId: string,
    studentId: string,
  ): Promise<boolean> {
    const assignment = await prisma.projectAllocation.findFirst({
      where: { projectId, studentId },
    });
    return !!assignment;
  }

  // Assign a student to a project
  async assignStudentToProject(projectId: string, studentId: string) {
    // Check if already assigned
    const existing = await prisma.projectAllocation.findFirst({
      where: { projectId, studentId },
    });

    if (existing) {
      return {
        success: false,
        message: "Student is already assigned to this project",
      };
    }

    const assignment = await prisma.projectAllocation.create({
      data: {
        projectId,
        studentId,
      },
    });

    return {
      success: true,
      message: "Student assigned to project successfully",
      data: assignment,
    };
  }

  // Remove a student from a project
  async removeStudentFromProject(projectId: string, studentId: string) {
    const deleted = await prisma.projectAllocation.deleteMany({
      where: { projectId, studentId },
    });

    return {
      success: deleted.count > 0,
      message:
        deleted.count > 0
          ? "Student removed from project"
          : "No assignment found",
      deletedCount: deleted.count,
    };
  }

  // Get projects for a specific student
  async getStudentProjects(studentId: string) {
    return prisma.projectAllocation.findMany({
      where: { studentId },
      include: {
        project: true,
      },
    });
  }

  // Get all projects with mentor and mentee counts
  async getAllProjectsWithCounts() {
    const projects = await prisma.project.findMany({
      include: {
        mentors: true,
        assignments: true,
      },
    });

    return projects.map((project) => ({
      ...project,
      mentorCount: project.mentors.length,
      studentCount: project.assignments.length,
    }));
  }

  // Get all mentors assigned to a project
  async getProjectMentors(projectId: string) {
    return prisma.projectMentor.findMany({
      where: { projectId },
      include: {
        mentor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  // Check if a mentor is already assigned to a project
  async isMentorInProject(
    projectId: string,
    mentorId: string,
  ): Promise<boolean> {
    const record = await prisma.projectMentor.findFirst({
      where: { projectId, mentorId },
    });
    return !!record;
  }

  // Assign a mentor to a project
  async assignMentorToProject(projectId: string, mentorId: string) {
    const existing = await prisma.projectMentor.findFirst({
      where: { projectId, mentorId },
    });
    if (existing) {
      return {
        success: false,
        message: "Mentor is already assigned to this project",
      };
    }
    const record = await prisma.projectMentor.create({
      data: { projectId, mentorId },
    });
    return {
      success: true,
      message: "Mentor assigned to project successfully",
      data: record,
    };
  }

  // Remove a mentor from a project
  async removeMentorFromProject(projectId: string, mentorId: string) {
    const deleted = await prisma.projectMentor.deleteMany({
      where: { projectId, mentorId },
    });
    return {
      success: deleted.count > 0,
      message:
        deleted.count > 0
          ? "Mentor removed from project"
          : "No assignment found",
      deletedCount: deleted.count,
    };
  }

  // Get all projects a mentor is assigned to
  async getMentorProjects(mentorId: string) {
    return prisma.projectMentor.findMany({
      where: { mentorId },
      include: { project: true },
    });
  }
}
