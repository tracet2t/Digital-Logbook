import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { InvitationRepository } from "@/repositories/repositories";

const invitationRepository = new InvitationRepository();

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    if (!session || session.getRole() !== "super_admin") {
      return NextResponse.json({ message: "Unauthorized. Super Admin access required." }, { status: 401 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ message: "Email and role are required." }, { status: 400 });
    }

    const invitedBy = session.getId()!;
    const invitation = await invitationRepository.createInvite({
      email,
      role,
      invitedBy,
    });

    return NextResponse.json({ 
      message: "Invitation created successfully", 
      token: invitation.token 
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json({ message: "Error creating invitation" }, { status: 500 });
  }
};
