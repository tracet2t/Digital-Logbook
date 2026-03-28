import prisma from "@/lib/prisma";
import BaseRepository from "./baseRepository";
import { ProjectTechnology } from "@prisma/client";

export default class TechnologyRepository extends BaseRepository<ProjectTechnology> {
  constructor() {
    super(prisma.projectTechnology as any);
  }

  /**
   * Assign or update a technology rating for a student in a project.
   */
  async upsertStudentTechnology(
    projectId: string,
    studentId: string,
    name: string,
    rating?: number
  ): Promise<ProjectTechnology> {
    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      throw new Error("Rating must be an integer between 1 and 5");
    }

    return prisma.projectTechnology.upsert({
      where: {
        projectId_studentId_name: { projectId, studentId, name },
      },
      update: { rating, updatedAt: new Date() },
      create: {
        projectId,
        studentId,
        name,
        rating,
      },
    });
  }

  /**
   * Get all technologies rated for a specific student.
   */
  async getStudentTechnologies(studentId: string): Promise<ProjectTechnology[]> {
    return prisma.projectTechnology.findMany({
      where: { studentId },
    });
  }

  /**
   * Get all technologies rated within a specific project.
   */
  async getProjectTechnologies(projectId: string): Promise<ProjectTechnology[]> {
    return prisma.projectTechnology.findMany({
      where: { projectId },
    });
  }

  /**
   * Remove a specific technology for a student in a project.
   */
  async removeStudentTechnology(
    projectId: string,
    studentId: string,
    name: string
  ): Promise<void> {
    await prisma.projectTechnology.delete({
      where: {
        projectId_studentId_name: { projectId, studentId, name },
      },
    });
  }
}
