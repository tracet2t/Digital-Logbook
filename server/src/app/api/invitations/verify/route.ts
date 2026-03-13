import { NextRequest, NextResponse } from "next/server";
import { InvitationRepository } from "@/repositories/repositories";

const invitationRepository = new InvitationRepository();

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token is required" }, { status: 400 });
    }

    const invitation = await invitationRepository.findByToken(token);

    if (!invitation) {
      return NextResponse.json({ message: "Invalid token" }, { status: 404 });
    }

    if (invitation.accepted) {
      return NextResponse.json({ message: "Invitation already used" }, { status: 400 });
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json({ message: "Invitation expired" }, { status: 400 });
    }

    return NextResponse.json({
      email: invitation.email,
      role: invitation.role,
      invitedBy: invitation.inviter.firstName + " " + invitation.inviter.lastName,
    });
  } catch (error) {
    console.error("Error verifying invitation:", error);
    return NextResponse.json({ message: "Error verifying invitation" }, { status: 500 });
  }
};
