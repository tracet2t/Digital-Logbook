//log the user
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as jose from "jose";
import { UserRepository } from "@/repositories/user_repository_impl";
import { InvitationRepository } from "@/repositories/invitation_repository_impl";

const invitationRepository = new InvitationRepository();
const userRepository = new UserRepository();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, firstName, lastName, password } = body;

    if (!token || !firstName || !lastName || !password) {
      return NextResponse.json(
        { message: "Token, first name, last name, and password are required" },
        { status: 400 },
      );
    }

    // 1. Validate the invitation token
    const invitations = await invitationRepository.getAll({
      where: { token },
    });

    if (invitations.length === 0) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    const invitation = invitations[0];

    // Check if token is used
    if (invitation.accepted) {
      return NextResponse.json(
        { message: "Invitation has already been used" },
        { status: 400 },
      );
    }

    // Check if token is expired
    if (new Date() > new Date(invitation.expiresAt)) {
      return NextResponse.json(
        { message: "Invitation has expired" },
        { status: 400 },
      );
    }

    // 2. Check if user already exists
    const existingUser = await userRepository.getByEmail(invitation.email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 },
      );
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create the user
    const newUser: any = await userRepository.create({
      email: invitation.email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: invitation.role,
      emailConfirmed: true, // Email is confirmed via the invitation link
      isFirstTimeLogin: true,
      invitedBy: invitation.invitedBy,
      isActive: true, // Default value
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Mark invitation as accepted
    await invitationRepository.update(invitation.id, {
      accepted: true,
    });

    // 6. Generate JWT token (Log the user in)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const algo = "HS256";

    const jwtToken = await new jose.SignJWT({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role.toString(),
      fname: newUser.firstName,
      lname: newUser.lastName,
    })
      .setProtectedHeader({ alg: algo })
      .setIssuedAt()
      .setIssuer(process.env.ISSUER!)
      .setAudience(process.env.AUDIENCE!)
      .setExpirationTime(process.env.JWT_EXPIRY!)
      .sign(secret);

    // 7. Return response
    // Determine redirect URL based on role
    let redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/unauthorized`;
    if (newUser.role === "student") {
      // Since they just registered and set password, maybe go straight to dashboard?
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/student`;
    } else if (newUser.role === "mentor") {
      redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/mentor`;
    }

    const response = NextResponse.json({
      message: "Registration successful",
      redirectUrl: redirectUrl,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });

    response.headers.set("Set-Cookie", `token=${jwtToken}; Path=/; HttpOnly`);
    return response;
  } catch (error) {
    console.error("Error registering user with invite:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
