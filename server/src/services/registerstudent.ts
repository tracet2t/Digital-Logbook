"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/email";
import getSession from "@/server_actions/getSession";
import { UserRepository } from "@/repositories/repositories";

interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
  projectId?: string;
}

export async function registerStudent(data: RegisterStudentData) {
  const { firstName, lastName, email, projectId } = data;
  const password = Math.random().toString(36).slice(-8);

  const hashedPassword = await bcrypt.hash(password, 10);

  // Retrieve the mentor's ID from the session
  const mentorId = (await getSession()).getId();
  const userRepository = new UserRepository();

  try {
    // Create a new student in the database with default values for missing fields
    const student = await userRepository.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: hashedPassword,
      role: "student",
      emailConfirmed: false,
      isFirstTimeLogin: true,
      isActive: true,
      invitedBy: mentorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // If a projectId is provided, assign the student to that project
    if (projectId) {
      await prisma.projectAllocation.create({
        data: {
          projectId: projectId,
          studentId: student.id,
        },
      });
    }

    // Send an email to the student with the temporary password
    await sendEmail({
      email,
      password,
      name: `${firstName} ${lastName}`,
      message: `Your registration was successful. Your temporary password is: ${password}`,
    });
  } catch (error) {
    console.error("Error registering student:", error);
    throw new Error("Failed to register student");
  }
}
