import prisma from "@/lib/prisma";
import { Project } from "@prisma/client";
import BaseRepository from "./baseRepository";

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
  // Get email addresses of all mentors assigned to a project
async getProjectMentorsEmails(projectId: string): Promise<string[]> {
  const mentors = await prisma.projectMentor.findMany({
    where: { projectId },
    include: {
      mentor: {
        select: { email: true },
      },
    },
  });

  return mentors.map((m) => m.mentor.email);
}

}
