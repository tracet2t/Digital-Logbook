import { NextResponse } from "next/server";
import {UserRepository} from "@/repositories/user_repository_impl";
import { InvitationRepository } from "@/repositories/invitation_repository_impl";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, token, tempPassword, newPassword } = await req.json();

    const invitationRepo = new InvitationRepository();
    const userRepo = new UserRepository();

    // Verify invitation exists and is valid
    const invite = await invitationRepo.findValidInvite(email, token);
    if (!invite)
      return NextResponse.json(
        { error: "Invalid or expired invitation" },
        { status: 400 },
      );

    // Verify temporary password against the user's current passwordHash
    const user = await userRepo.getByEmail(email);
    if (!user || !user.passwordHash)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );

    const isValid = await bcrypt.compare(tempPassword, user.passwordHash);
    if (!isValid)
      return NextResponse.json(
        { error: "Temporary password is incorrect" },
        { status: 400 },
      );

    // 3 Update password in the User table
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.updateByEmail(email, {
      passwordHash: hashedPassword,
      isFirstTimeLogin: false,
      emailConfirmed: true,
    });

    //  Mark invitation as accepted
    await invitationRepo.markAccepted(invite.id);

    // Return success and role for front-end routing
    return NextResponse.json({ success: true, role: invite.role });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to complete registration" },
      { status: 500 },
    );
  }
}