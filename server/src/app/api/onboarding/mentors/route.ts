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
    const mentors = await prisma.user.findMany({
      where: {
        role: Role.mentor,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        emailConfirmed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get unique emails
    const emails = mentors.map((m) => m.email);

    // Fetch all invitations for these mentors
    const invitations = await prisma.invitation.findMany({
      where: { email: { in: emails } },
      orderBy: { createdAt: "desc" },
    });

    // Create map for quick lookup
    const invitationByEmail = new Map(invitations.map((i) => [i.email, i]));

    // Enrich mentors with user and invitation data
    const enrichedMentors = mentors.map((m) => {
      const invitation = invitationByEmail.get(m.email);

      // Determine invitation status
      let invitationStatus: "Active" | "Pending" | "Expired" | undefined;
      let invitationExpiresAt: string | undefined;

      if (invitation) {
        invitationExpiresAt = invitation.expiresAt.toISOString();
        const now = new Date();

        if (invitation.accepted) {
          invitationStatus = "Active";
        } else if (new Date(invitation.expiresAt) < now) {
          invitationStatus = "Expired";
        } else {
          invitationStatus = "Pending";
        }
      }

      return {
        id: m.id,
        fullName: `${m.firstName} ${m.lastName}`,
        email: m.email,
        university: "-",
        degreeProgram: "-",
        cvLink: "#",
        status: m.isActive ? ("approved" as const) : ("inactive" as const),
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
        user: {
          id: m.id,
          isActive: m.isActive,
          emailConfirmed: m.emailConfirmed,
        },
        invitationStatus,
        invitationExpiresAt,
      };
    });

    return NextResponse.json(enrichedMentors, { status: 200 });
  } catch (error) {
    console.error("Error fetching unassigned mentors:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
