import { PrismaClient } from '@prisma/client';
import {describe, expect, test, beforeAll, afterAll} from '@jest/globals';

const prisma = new PrismaClient();

describe('User Model', () => {
  beforeAll(async () => {
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('createUser creates a user', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student', 
      },
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('test@example.com');
    expect(user.firstName).toBe('John');
  });

  test('getUser retrieves a user', async () => {
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    expect(user).toBeTruthy();
    expect(user?.email).toBe('test@example.com');
  });

  test('updateUser updates a user', async () => {
    const updatedUser = await prisma.user.update({
      where: { email: 'test@example.com' },
      data: { lastName: 'Smith' },
    });

    expect(updatedUser.lastName).toBe('Smith');
  });

  test('deleteUser deletes a user', async () => {
    const deletedUser = await prisma.user.delete({
      where: { email: 'test@example.com' },
    });

    expect(deletedUser.email).toBe('test@example.com');
  });
});
