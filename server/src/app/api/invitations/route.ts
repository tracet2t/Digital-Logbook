import { NextRequest, NextResponse } from "next/server";
import getSession from "@/server_actions/getSession";
import { InvitationRepository } from "@/repositories/repositories";
import { sendInvitationEmail } from "@/lib/email";

const invitationRepository = new InvitationRepository();

export const POST = async (req: NextRequest) => {
  try {
    const session = await getSession();
    console.log("Current session role:", session.getRole());
    
    if (!session || session.getRole() !== "super_admin") {
      return NextResponse.json(
        { message: `Unauthorized. Super Admin access required. Your role: ${session.getRole()}` },
        { status: 401 },
      );
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json(
        { message: "Email and role are required." },
        { status: 400 },
      );
    }

    const invitedBy = session.getId()!;
    const invitation = await invitationRepository.createInvite({
      email,
      role,
      invitedBy,
    });

    // 4. Generate the registration link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const invitationUrl = `${baseUrl}/invitations/register?token=${invitation.token}`;

    console.log(`Sending invitation to ${email} with link: ${invitationUrl}`);

    // 5. Send the email
    try {
      await sendInvitationEmail(email, invitationUrl);
    } catch (emailError: any) {
      console.error("Failed to send invitation email:", emailError);
      // We still return success for creation, but notify that email failed
      return NextResponse.json({
        message: "Invitation created, but email failed to send",
        error: emailError.message || "Unknown email error",
        token: invitation.token,
      });
    }

    return NextResponse.json({
      message: "Invitation created and email sent successfully",
      token: invitation.token,
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { message: "Error creating invitation" },
      { status: 500 },
    );
  }
};
