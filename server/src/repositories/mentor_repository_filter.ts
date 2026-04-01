import prisma from "@/lib/prisma";
import BaseRepository from "./baseRepository";
import { ProjectMentor, Project } from "@prisma/client";

export class MentorFilterRepository extends BaseRepository<ProjectMentor> {
  constructor() {
    super(prisma.projectMentor);
  }

  /**
   * Get all projects assigned to a mentor
   */
  async getMentorProjects(mentorId: string): Promise<Project[]> {
    const projects = await this.modelClient.findMany({
      where: { mentorId },
      include: { project: true },
    });

    return projects.map((p: { project: any; }) => p.project);
  }

  /**
   * Get all students assigned to a project
   */
  async getProjectStudents(projectId: string): Promise<{ id: string; name: string }[]> {
    const allocations = await prisma.projectAllocation.findMany({
      where: { projectId },
      include: { student: true },
    });

    return allocations.map(a => ({
      id: a.student.id,
      name: `${a.student.firstName} ${a.student.lastName}`,
    }));
  }

  /**
   * Optional combined method for dashboard to fetch projects + students
   */
  async getMentorProjectsWithStudents(
    mentorId: string
  ): Promise<
    {
      projectId: string;
      projectName: string;
      students: { id: string; name: string }[];
    }[]
  > {
    const projects = await this.modelClient.findMany({
      where: { mentorId },
      include: {
        project: {
          include: {
            assignments: {
              include: { student: true },
            },
          },
        },
      },
    });

    return projects.map((p: { project: { id: any; name: any; assignments: any[]; }; }) => ({
      projectId: p.project.id,
      projectName: p.project.name,
      students: p.project.assignments.map(a => ({
        id: a.student.id,
        name: `${a.student.firstName} ${a.student.lastName}`,
      })),
    }));
  }

  
}