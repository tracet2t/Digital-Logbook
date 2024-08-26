import { PrismaClient } from "@prisma/client";
import TaskService from "../modules/daily_activity/task_service"; 
import { describe, expect, test, jest, beforeAll, afterAll } from '@jest/globals';

// Mock PrismaClient
jest.mock("@prisma/client");

const mockCreate = jest.fn();
PrismaClient.prototype.dailyActivity = {
  create: mockCreate
};

describe('TaskService', () => {
  let taskService: TaskService;

  beforeAll(() => {
    taskService = new TaskService();
  });
 /*
  afterAll(() => {
    jest.resetAllMocks();
  });
*/

// Create new actvity

  test('should create a task with the given data', async () => {
    const taskData = {
      student_id: 1,
      date: new Date(),
      working_hours: 2,
      notes: "Test notes",
    };

    const expectedResult = {
      id: 1,
      ...taskData,
    };

    mockCreate.mockResolvedValue(expectedResult);

    // Act
    const result = await taskService.createTask(taskData);

    // Assert
    expect(result).toEqual(expectedResult);
    expect(mockCreate).toHaveBeenCalledWith({
      data: taskData,
    });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
