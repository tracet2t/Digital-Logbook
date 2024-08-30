// src/services/registerstudent.ts
'use server'; // Indicates this is a server action

import { prisma } from '@/services/prisma';
import bcrypt from 'bcrypt';

export async function registerStudent(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
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
