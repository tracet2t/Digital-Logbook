import { InvitationRepository } from "@/repositories/invitation_repository_impl";
import { UserRepository } from "@/repositories/user_repository_impl";
import getSession from "@/server_actions/getSession";
import { registerStudent } from "@/services/registerstudent";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

const invitationRepository = new InvitationRepository();
const userRepository = new UserRepository();

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Check for permissions (super_admin)
    const userRole = session.getRole();
    if (userRole !== Role.superAdmin ) {
      return NextResponse.json(
        {
          message:
            "Forbidden: Only Super Admins  can create invitations",
        },
        { status: 403 },
      );
    }

    const invitedBy = session.getId();
    if (!invitedBy) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid session" },
        { status: 401 },
      );
    }

    // 3. Parse and validate the request body
    const body = await req.json();
    const { email, role, firstName, lastName, projectId } = body;

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required" },
        { status: 400 },
      );
    }

    // Validate role
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // 4. Check if user already exists
    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 },
      );
    }

    let tempPassword: string;
    let userId: string;

    try {
      // 5. Register the user via reusable function
      const registerResult = await registerStudent({
        email,
        firstName,
        lastName,
        role,
        invitedBy,
        projectId, // now assigns project to students or mentors
      });
      tempPassword = registerResult.tempPassword;
      userId = registerResult.user.id;

      // 6. Create the invitation via repository
      const invitation = await invitationRepository.createInvite({
        email,
        role,
        invitedBy,
      });

      console.log("Invite Created", invitation);

      const loginUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/create-account?token=${invitation.token}&email=${encodeURIComponent(email)}`;

      // 7. Send email - if this fails, rollback user creation
      try {
        await sendEmail({
          email,
          name: `${firstName} ${lastName}`,
          tempPassword,
          message: `Your registration was successful. Your temporary password is: ${tempPassword}`,
          loginUrl,
          token: invitation.token,
        });
      } catch (emailError: any) {
        // If email fails, delete the created user and invitation
        console.error("Email failed, rolling back user creation:", emailError);
        await userRepository.delete(userId);
        await invitationRepository.delete(invitation.id);
        throw new Error(
          "Failed to send invitation email. User creation rolled back.",
        );
      }

      return NextResponse.json(
        { message: "Invitation sent successfully", invitation },
        { status: 201 },
      );
    } catch (innerError: any) {
      throw innerError;
    }
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    // Handle specific Prisma errors (e.g., uniqueness constraints) if necessary
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "An invitation for this email or token already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // If a token is passed, return **single invitation validation**
    const token = searchParams.get("token");
    if (token) {
      const invitations = await invitationRepository.getAll({
        where: { token },
      });

      if (invitations.length === 0) {
        return NextResponse.json(
          { valid: false, message: "Invalid token" },
          { status: 404 }
        );
      }

      const invitation = invitations[0];

      if (invitation.accepted) {
        return NextResponse.json(
          { valid: false, message: "Token has already been used" },
          { status: 400 }
        );
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        return NextResponse.json(
          { valid: false, message: "Token has expired" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        valid: true,
        email: invitation.email,
        role: invitation.role,
      });
    }

    // If no token, return **all invitations for the table**
    const invitations = await invitationRepository.getAll({
      orderBy: { createdAt: "desc" },
      include: { inviter: true}, // optional, if you want inviter info
    });
    // 2. Fetch all projects
    const now = new Date();
     

    // Fetch all users whose emails match invitations
    const emails = invitations.map(inv => inv.email);
    const users = await prisma.user.findMany({
      where: { email: { in: emails } },
      select: { id: true, email: true },
    });

    // Map email → userId
    const emailToUserId: Record<string, string> = {};
    users.forEach(user => {
      emailToUserId[user.email] = user.id;
    });

    // Fetch project allocations for all invited users who exist
    const userIds = Object.values(emailToUserId);
    const allocations = await prisma.projectAllocation.findMany({
      where: { studentId: { in: userIds } },
      include: { project: true },
    });

    // Map userId → project name
    const projectMap: Record<string, string> = {};
    allocations.forEach(allocation => {
      projectMap[allocation.studentId] = allocation.project.name;
    });

    const mapped = invitations.map(inv => {
      const status: "Pending" | "Accepted" | "Expired" =
        inv.accepted ? "Accepted" : (now > new Date(inv.expiresAt) ? "Expired" : "Pending");

      const userId = emailToUserId[inv.email];
      const projectName = userId ? projectMap[userId] || "-" : "-";

      return {
        id: inv.id,
        email: inv.email,
        role: inv.role,
        project: projectName,
        status,
        createdAt: inv.createdAt,
        expiresAt: inv.expiresAt,
      };
    });

    return NextResponse.json(mapped, { status: 200 });
  } catch (err) {
    console.error("Error fetching invitations:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Expire an invitation so the link can no longer be used
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

    // Set expiresAt to epoch so the token is permanently invalidated
    await prisma.invitation.update({
      where: { id },
      data: { expiresAt: new Date(0) },
    });

    return NextResponse.json({ message: "Invitation expired" });
  } catch (err) {
    console.error("Error expiring invitation:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove invitation and fully purge associated user data
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.getRole() !== Role.superAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "id is required" }, { status: 400 });

    const invitation = await prisma.invitation.findUnique({ where: { id } });
    if (!invitation) return NextResponse.json({ message: "Invitation not found" }, { status: 404 });

    const user = await prisma.user.findUnique({ where: { email: invitation.email } });

    if (user) {
      await prisma.$transaction(async (tx) => {
        // Delete mentor feedback on user's activities
        const activityIds = (await tx.activity.findMany({ where: { studentId: user.id }, select: { id: true } })).map(a => a.id);
        if (activityIds.length) await tx.mentorFeedback.deleteMany({ where: { activityId: { in: activityIds } } });

        await tx.activity.deleteMany({ where: { studentId: user.id } });
        await tx.mentorFeedback.deleteMany({ where: { mentorId: user.id } });
        await tx.mentorActivity.deleteMany({ where: { mentorId: user.id } });
        await tx.report.deleteMany({ where: { mentorId: user.id } });
        await tx.userBadge.deleteMany({ where: { userId: user.id } });
        await tx.projectAllocation.deleteMany({ where: { studentId: user.id } });
        await tx.projectMentor.deleteMany({ where: { mentorId: user.id } });
        // Null-out invitations sent BY this user (onDelete: SetNull handles FK, but explicit is safer)
        await tx.invitation.updateMany({ where: { invitedBy: user.id }, data: { invitedBy: null } });
        // Delete the invitation record itself
        await tx.invitation.delete({ where: { id } });
        await tx.user.delete({ where: { id: user.id } });
      });
    } else {
      // No user found – just remove the invitation record
      await prisma.invitation.delete({ where: { id } });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting invitation:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

