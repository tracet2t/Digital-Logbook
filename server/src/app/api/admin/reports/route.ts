import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
  try {
    const session = await getSession();

    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.getRole();

    if (userRole !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
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
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = projects.flatMap((project) => {
      if (project.mentors.length === 0) {
        return [
          {
            id: `${project.id}:unassigned`,
            projectName: project.name,
            mentor: "—",
            studentsCount: project.assignments.length,
            date: project.createdAt.toISOString(),
            rawDate: project.createdAt.toISOString(),
          },
        ];
      }
      return project.mentors.map((pm) => {
        const mentorName =
          `${pm.mentor.firstName} ${pm.mentor.lastName}`.trim() ||
          pm.mentor.email;
        return {
          id: `${project.id}:${pm.mentorId}`,
          projectName: project.name,
          mentor: mentorName,
          studentsCount: project.assignments.length,
          date: project.createdAt.toISOString(),
          rawDate: project.createdAt.toISOString(),
        };
      });
    });

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching project report data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
