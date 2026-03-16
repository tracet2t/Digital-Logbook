// src/api/users.ts - Get students for a mentor via project assignments
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();
    if (!mentorId) {
      return NextResponse.json(
        { message: "Mentor ID not found" },
        { status: 401 },
      );
    }

    // Fetch students assigned to projects where this mentor is a member
    const projects = await prisma.project.findMany({
      where: { mentors: { some: { mentorId } } },
      include: {
        assignments: {
          include: {
            student: true,
          },
        },
      },
    });

    // Flatten and deduplicate students across projects
    const studentMap = new Map<
      string,
      (typeof projects)[0]["assignments"][0]["student"]
    >();
    for (const project of projects) {
      for (const assignment of project.assignments) {
        studentMap.set(assignment.student.id, assignment.student);
      }
    }

    return NextResponse.json(Array.from(studentMap.values()));
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Error fetching students" },
      { status: 500 },
    );
  }
};
