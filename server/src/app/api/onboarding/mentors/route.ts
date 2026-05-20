import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/onboarding/mentors
 *
 * Returns all users with role=mentor who have no ProjectMentor allocation
 * (i.e. mentors not yet assigned to any project).
 *
 * Shaped as OnboardingApplication-compatible objects so the existing
 * BenchCard / ProjectCard components can render them without changes.
 *
 * Auth: superAdmin only
 */
export async function GET(_req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== "superAdmin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Fetch all mentor users (both active and inactive)
    const unassigned = await prisma.user.findMany({
      where: {
        role: Role.mentor,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Map to the OnboardingApplication shape expected by the front-end
    const result = unassigned.map((m) => ({
      id: m.id,
      fullName: `${m.firstName} ${m.lastName}`,
      email: m.email,
      university: "-",
      degreeProgram: "-",
      cvLink: "#",
      status: m.isActive ? ("approved" as const) : ("inactive" as const),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching unassigned mentors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
