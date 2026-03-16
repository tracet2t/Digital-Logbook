import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { InvitationRepository, UserRepository } from "@/repositories/repositories";
import getSession from "@/server_actions/getSession";
import { Role } from "@prisma/client";

const invitationRepository = new InvitationRepository();
const userRepository = new UserRepository();

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const session = await getSession();
    if (!session || !session.isAuthenticated()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Check for permissions (Only super_admin can invite)
    const userRole = session.getRole();
    if (userRole !== Role.super_admin) {
        return NextResponse.json({ message: "Forbidden: Only Super Admins can create invitations" }, { status: 403 });
    }

    const invitedBy = session.getId();
    if (!invitedBy) {
        return NextResponse.json({ message: "Unauthorized: Invalid session" }, { status: 401 });
    }

    // 3. Parse and validate the request body
    const body = await req.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ message: "Email and role are required" }, { status: 400 });
    }
    
    // Validate role
    if (!Object.values(Role).includes(role)) {
         return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // 4. Check if user already exists
    const existingUser = await userRepository.getByEmail(email);
    if (existingUser) {
        return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    // 5. Generate secure token and expiration
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire in 7 days

    // 6. Create the invitation via repository
    // Note: The repository method has some unused variables but uses our passed data correctly.
    // We use createInvite because it handles the specific input type expected for Invitation creation
    // better than BaseRepository.create which might expect all model fields.
    const invitation = await invitationRepository.createInvite({
      email,
      role: role as Role,
      token,
      invitedBy,
      expiresAt,
      accepted: false,
    });

    // 7. Return the invitation details (In a real app, send email here)
    return NextResponse.json({
      message: "Invitation created successfully",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        link: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register?token=${invitation.token}` // Helper for frontend dev
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating invitation:", error);
    // Handle specific Prisma errors (e.g., uniqueness constraints) if necessary
    if (error.code === 'P2002') {
         return NextResponse.json({ message: "An invitation for this email or token already exists" }, { status: 409 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    // Use getAll from BaseRepository to find by token without modifying the repository file
    // The token is unique, so we expect at most one result
    const invitations = await invitationRepository.getAll({
      where: { token },
    });

    if (invitations.length === 0) {
      return NextResponse.json({ valid: false, message: "Invalid token" }, { status: 404 });
    }

    const invitation = invitations[0];

    // Check if used
    if (invitation.accepted) {
      return NextResponse.json({ valid: false, message: "Token has already been used" }, { status: 400 });
    }

    // Check if expired
    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json({ valid: false, message: "Token has expired" }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      role: invitation.role,
    });

  } catch (error) {
     console.error("Error validating invitation:", error);
     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
