// src/auth/reset-password.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { UserRepository } from "@/repositories/repositories"; // Use your UserRepository
import getSession from "@/server_actions/getSession";

// Helper function to validate password requirements
function validatePassword(password: string) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const minLength = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && minLength;
}

// Expected body type
interface ResetPasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.getUsername();

    if (!email) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword }: ResetPasswordData = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate the new password
    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must include at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    const userRepository = new UserRepository();
    const user = await userRepository.getByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.update(user.id, {
      passwordHash: hashedPassword,
      emailConfirmed: true, // Assuming this is a feature where you confirm after reset
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the password" },
      { status: 500 }
    );
  }
}