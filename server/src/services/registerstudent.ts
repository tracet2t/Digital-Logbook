'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
}

export async function registerStudent(data: RegisterStudentData) {
  const { firstName, lastName, email } = data;
  const password = Math.random().toString(36).slice(-8); // Generate a random password

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        role: 'student',
      },
    });
  } catch (error) {
    console.error('Error registering student:', error);
    throw new Error('Failed to register student');
  }
}
