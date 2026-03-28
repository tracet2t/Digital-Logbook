import { NextRequest, NextResponse } from "next/server";
import TechnologyRepository from "@/repositories/technology_repository_impl";
import getSession from "@/server_actions/getSession";

export const dynamic = "force-dynamic";
const techRepo = new TechnologyRepository();

// GET ?projectId=... or ?studentId=...
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const studentId = searchParams.get("studentId");

    if (projectId) {
      const technologies = await techRepo.getProjectTechnologies(projectId);
      return NextResponse.json({ technologies }, { status: 200 });
    } else if (studentId) {
      const technologies = await techRepo.getStudentTechnologies(studentId);
      return NextResponse.json({ technologies }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "projectId or studentId query param required" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// POST { projectId, studentId, name, rating }
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    // Assuming mentors and admins can update technologies. 
    // Adjust role check as necessary for your app's logic.
    if (!session?.isAuthenticated() || session.getRole() === "student") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { projectId, studentId, name, rating } = await req.json();

    if (!projectId || !studentId || !name) {
      return NextResponse.json(
        { error: "projectId, studentId, and name are required fields" },
        { status: 400 }
      );
    }

    const technologyResult = await techRepo.upsertStudentTechnology(
      projectId,
      studentId,
      name,
      rating
    );

    return NextResponse.json(technologyResult, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE { projectId, studentId, name }
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAuthenticated() || session.getRole() === "student") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { projectId, studentId, name } = await req.json();

    if (!projectId || !studentId || !name) {
      return NextResponse.json(
        { error: "projectId, studentId, and name are required fields" },
        { status: 400 }
      );
    }

    await techRepo.removeStudentTechnology(projectId, studentId, name);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
