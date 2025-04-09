import { NextRequest, NextResponse } from "next/server";
import { ProjectRepository } from "@/repositories/repositories";
import getSession from "@/server_actions/getSession";

const projectRepository = new ProjectRepository();

export const GET = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorId = session.getId();
    const projects = await projectRepository.getProjectsByMentorId(mentorId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ message: "Error fetching projects" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorID = session.getId();
    const body = await req.json();
    const {
      projectTitle,
      projectDescription,
      progress,
      startedAt,
      deadline,
      teamName,
      studentIDs,
    } = body;

    if (
      !projectTitle || !projectDescription || progress === undefined ||
      !startedAt || !deadline || !teamName
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newProject = await projectRepository.createProject({
      projectTitle,
      projectDescription,
      progress,
      startedAt: new Date(startedAt),
      deadline: new Date(deadline),
      teamName,
      mentorID,
      studentIDs,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Error creating project" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectID, ...updates } = body;

    if (!projectID) {
      return NextResponse.json({ message: "Missing project ID" }, { status: 400 });
    }

    const updatedProject = await projectRepository.updateProject(projectID, updates);
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ message: "Error updating project" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const projectID = parseInt(url.searchParams.get("id") || "", 10);

    if (isNaN(projectID)) {
      return NextResponse.json({ message: "Invalid or missing project ID" }, { status: 400 });
    }

    const project = await projectRepository.getProjectById(projectID);
    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // Optional: Add session.getId() === project.mentorID check here

    await projectRepository.softDeleteProject(projectID);
    return NextResponse.json({ message: "Project deleted (soft)" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
  }
};
