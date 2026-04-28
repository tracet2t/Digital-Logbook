// server_actions/registerUser.ts
"use server";

import { UserRepository } from "@/repositories/user_repository_impl";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma";

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  invitedBy: string; // ID of the inviter (mentor/admin)
  projectId?: string; // required for students
}

export async function registerStudent(data: RegisterUserData) {
  const { firstName, lastName, email, role, invitedBy, projectId } = data;

  // --- Validation ---
  if (!email || !firstName || !lastName || !role) {
    throw new Error("Missing required fields");
  }

  const validRoles: Role[] = [Role.student, Role.mentor];
  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
  }

  // --- Generate temporary password ---
  const tempPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  const userRepository = new UserRepository();

  // --- Create user ---
  const user = await userRepository.create({
    firstName,
    lastName,
    email,
    role,
    invitedBy,
    passwordHash: hashedPassword,
    emailConfirmed: false,
    isFirstTimeLogin: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // --- Assign project if projectId is provided ---
  if (projectId) {
    if (role === Role.student) {
      await prisma.projectAllocation.create({
        data: {
          studentId: user.id,
          projectId,
        },
      });
      //--Assign Mentors ---
    } else if (role === Role.mentor) {
      await prisma.projectMentor.create({
        data: {
          mentorId: user.id,
          projectId,
        },
      });
    }
  }

  return { user, tempPassword, hashedPassword };
}
