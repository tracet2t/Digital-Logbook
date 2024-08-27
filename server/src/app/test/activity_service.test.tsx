import { PrismaClient } from '@prisma/client';
import ActivityService from '../modules/activity_service';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';

const prisma = new PrismaClient();

describe('ActivityService', () => {
  let activityService: ActivityService;
  let testUserId: string;
  let testActivityId: string;

  beforeAll(async () => {
    activityService = new ActivityService(prisma);

    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        passwordHash: 'testpassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'student',
      },
    });

    testUserId = testUser.id;

    // Create a test activity
    const testActivity = await activityService.createActivity({
      studentId: testUserId,
      date: new Date(),
      timeSpent: 120,
      notes: 'Test notes',
    });

    testActivityId = testActivity.id;
  });

  afterAll(async () => {
    // Clean up
    await prisma.activity.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  test('should create an activity with the given data', async () => {
    const activityData = {
      studentId: testUserId,
      date: new Date(),
      timeSpent: 120,
      notes: 'Test notes',
    };

    const result = await activityService.createActivity(activityData);

    expect(result).toHaveProperty('id');
    expect(result.studentId).toBe(activityData.studentId);
    expect(result.date).toEqual(activityData.date);
    expect(result.timeSpent).toBe(activityData.timeSpent);
    expect(result.notes).toBe(activityData.notes);

    // Clean up
    await prisma.activity.delete({ where: { id: result.id } });
  });

  test('should read an activity by ID', async () => {
    const result = await activityService.getActivityById(testActivityId);

    expect(result).toHaveProperty('id', testActivityId);
    expect(result).toHaveProperty('studentId', testUserId);
  });

  test('should update an activity within 2 days', async () => {
    const updatedData = {
      date: new Date(),
      timeSpent: 150,
      notes: 'Updated notes',
    };

    const updatedActivity = await activityService.updateActivity(testActivityId, updatedData);

    expect(updatedActivity).toHaveProperty('id', testActivityId);
    expect(updatedActivity.timeSpent).toBe(updatedData.timeSpent);
    expect(updatedActivity.notes).toBe(updatedData.notes);
  });

  test('should not update an activity older than 2 days', async () => {
    // Create a new activity and then set its date to more than 2 days ago
    const oldActivity = await activityService.createActivity({
      studentId: testUserId,
      date: new Date(),
      timeSpent: 120,
      notes: 'Old notes',
    });

    await prisma.activity.update({
      where: { id: oldActivity.id },
      data: { createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
    });

    const updatedData = {
      date: new Date(),
      timeSpent: 150,
      notes: 'Updated notes',
    };

    await expect(activityService.updateActivity(oldActivity.id, updatedData)).rejects.toThrow(
      'Activity cannot be edited or deleted as it is past the allowed timeframe.'
    );
  });

  test('should delete an activity', async () => {
    await activityService.deleteActivity(testActivityId);

    const result = await activityService.getActivityById(testActivityId);
    expect(result).toBeNull();
  });

  test('should not delete an activity older than 2 days', async () => {
    // Create a new activity and then set its date to more than 2 days ago
    const oldActivity = await activityService.createActivity({
      studentId: testUserId,
      date: new Date(),
      timeSpent: 120,
      notes: 'Old notes',
    });

    await prisma.activity.update({
      where: { id: oldActivity.id },
      data: { createdAt: new Date(new Date().setDate(new Date().getDate() - 3)) },
    });

    await expect(activityService.deleteActivity(oldActivity.id)).rejects.toThrow(
      'Activity cannot be edited or deleted as it is past the allowed timeframe.'
    );
  });
});
