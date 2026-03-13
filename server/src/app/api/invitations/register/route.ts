import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {
  InvitationRepository,
  UserRepository,
  MentorshipRepository,
} from "@/repositories/repositories";

const invitationRepository = new InvitationRepository();
const userRepository = new UserRepository();
const mentorshipRepository = new MentorshipRepository();

export const POST = async (req: NextRequest) => {
  try {
    const { token, firstName, lastName, password } = await req.json();

    if (!token || !firstName || !lastName || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // 1. Verify invitation again
    const invitation = await invitationRepository.findByToken(token);

    if (
      !invitation ||
      invitation.accepted ||
      new Date() > invitation.expiresAt
    ) {
      return NextResponse.json(
        { message: "Invalid, used, or expired invitation" },
        { status: 400 },
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await userRepository.create({
      email: invitation.email,
      firstName,
      lastName,
      passwordHash: hashedPassword,
      role: invitation.role,
      emailConfirmed: true, // Since they registered via a private invitation link
      isFirstTimeLogin: false,
      invitedBy: invitation.invitedBy,
    });

    // 4. If they are a student, link them to the mentor who invited them
    if (invitation.role === "student") {
      await mentorshipRepository.create({
        mentorId: invitation.invitedBy,
        studentId: user.id,
      });
    }

    // 5. Mark invitation as accepted
    await invitationRepository.acceptInvitation(token);

    return NextResponse.json({
      message: "User registered successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error registering via invitation:", error);
    return NextResponse.json(
      { message: "Error during registration" },
      { status: 500 },
    );
  }
};
