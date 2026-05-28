"use server";

import getSession from "@/server_actions/getSession";

import prisma from "@/lib/prisma";

export interface AdminProject {
  id: string;
  name: string;
  description: string;
  domain: string;
  batchNo: string;
  mentors: number;
  students: number;
  createdBy: string;
  createdDate: string;
  mentorList: Array<{ id: string; name: string }>;
  studentList: Array<{ id: string; name: string }>;
}

export interface AdminProjectStats {
  totalProjects: number;
  totalMentors: number;
  totalStudents: number;
  projects: AdminProject[];
}

export async function getAdminProjectStats(): Promise<AdminProjectStats> {
  const [projects, totalMentors, totalStudents] = await Promise.all([
    prisma.project.findMany({
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
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where: { role: "mentor" } }),
    prisma.user.count({ where: { role: "student" } }),
  ]);

  // Resolve creator names in bulk
  const creatorIds = Array.from(new Set(projects.map((p) => p.createdBy)));
  const creators = await prisma.user.findMany({
    where: { id: { in: creatorIds } },
    select: { id: true, firstName: true, lastName: true },
  });
  const creatorMap = new Map(
    creators.map((c) => [c.id, `${c.firstName} ${c.lastName}`]),
  );

  const enrichedProjects: AdminProject[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    domain: p.domain,
    batchNo: p.batchNo ?? "",
    mentors: p.mentors.length,
    students: p.assignments.length,
    createdBy: creatorMap.get(p.createdBy) ?? p.createdBy,
    createdDate: p.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    mentorList: p.mentors.map((m) => ({
      id: m.mentor.id,
      name: `${m.mentor.firstName} ${m.mentor.lastName}`,
    })),
    studentList: p.assignments.map((a) => ({
      id: a.student.id,
      name: `${a.student.firstName} ${a.student.lastName}`,
    })),
  }));

  return {
    totalProjects: projects.length,
    totalMentors,
    totalStudents,
    projects: enrichedProjects,
  };
}

export async function createProject(
  name: string,
  description: string,
  domain: string,
  batchNo?: string,
): Promise<void> {
  const session = await getSession();
  const createdBy = session.getId();
  if (!createdBy) throw new Error("Unauthorized");
  await prisma.project.create({
    data: {
      name: name.trim(),
      description: description.trim() || undefined,
      domain: domain.trim(),
      batchNo: batchNo?.trim() || null,
      createdBy,
    },
  });
}

export async function updateProject(
  id: string,
  name: string,
  description: string,
  domain: string,
  batchNo?: string,
): Promise<void> {
  await prisma.project.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description.trim() || null,
      domain: domain.trim(),
      batchNo: batchNo?.trim() || null,
    },
  });
}

export async function deleteProject(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.projectAllocation.deleteMany({ where: { projectId: id } }),
    prisma.projectMentor.deleteMany({ where: { projectId: id } }),
    prisma.project.delete({ where: { id } }),
  ]);
}
