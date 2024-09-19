'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendEmail } from '@/app/api/email/route';
import getSession from '@/server_actions/getSession';
import { UserRepository, MentorshipRepository } from '@/repositories/repositories';


interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
}

export async function registerStudent(data: RegisterStudentData) {
  const { firstName, lastName, email } = data;
  const password = Math.random().toString(36).slice(-8);

  const hashedPassword = await bcrypt.hash(password, 10);

  // Retrieve the mentor's ID from the session
  const mentorId = (await getSession()).getId();
  const userRepository = new UserRepository();
  const mentorRepository = new MentorshipRepository();
  try {
    // Create a new student in the database
    const student = await userRepository.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      passwordHash: hashedPassword,
      role: 'student',
    });

    // Create a mentorship relationship between the mentor and the student
    await mentorRepository.create({
        mentorId: mentorId,      // Mentor's ID from the session
        studentId: student.id,  // Newly created student's ID
    });

    // Send an email to the student with the temporary password
    await sendEmail({
      email,
      password,
      name: `${firstName} ${lastName}`,
      message: `Your registration was successful. Your temporary password is: ${password}`,
    });

  } catch (error) {
    console.error('Error registering student:', error);
    throw new Error('Failed to register student');
  }
}
