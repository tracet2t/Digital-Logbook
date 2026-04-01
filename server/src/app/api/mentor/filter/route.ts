// src/api/mentor/filter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MentorFilterRepository } from "@/repositories/mentor_repository_filter";
import getSession from "@/server_actions/getSession";

const mentorFilterRepo = new MentorFilterRepository();

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();
    if (!mentorId) {
      return NextResponse.json({ message: "User ID not found" }, { status: 401 });
    }

    const url = new URL(req.url);
    const projectId = url.searchParams.get("projectId");

    if (projectId) {
      // Fetch students assigned to a specific project
      const students = await mentorFilterRepo.getProjectStudents(projectId);
      return NextResponse.json(students);
    }

    // Fetch all projects for the mentor if no projectId
    const projects = await mentorFilterRepo.getMentorProjects(mentorId);
    return NextResponse.json(
      projects.map((p) => ({ id: p.id, name: p.name }))
    );
  } catch (error) {
    console.error("Error fetching mentor filter data:", error);
    return NextResponse.json(
      { message: "Error fetching mentor filter data" },
      { status: 500 }
    );
  }
};