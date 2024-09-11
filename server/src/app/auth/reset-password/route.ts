// src/auth/reset-password.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import getSession from "@/server_actions/getSession";

const prisma = new PrismaClient();

// Helper function to validate password requirements
function validatePassword(password: string) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const minLength = password.length >= 8; 

  return hasUpperCase && hasLowerCase && hasNumber && minLength;
}

export async function PUT(req: NextRequest) {
  try {
    const email = (await getSession()).getUsername();
    const { currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password, email, and new password are required" },
        { status: 400 }
      );
    }

    // Validate the new password
    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        { error: "Password must include at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword, emailConfirmed: true },
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
