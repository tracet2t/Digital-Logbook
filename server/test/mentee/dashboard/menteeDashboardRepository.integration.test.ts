import { randomUUID } from "crypto";

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";
import { ActivityStatus, FeedbackStatus, Role } from "@prisma/client";

import prisma from "../../../src/lib/prisma";
import { ActivityRepository } from "../../../src/repositories/activity_repository_impl";

const repository = new ActivityRepository();

const createdFeedbackIds: string[] = [];
const createdActivityIds: string[] = [];
const createdUserIds: string[] = [];

function assertTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  expect(databaseUrl).toBeDefined();
  expect(databaseUrl).toMatch(/localhost|127\.0\.0\.1|test/i);
}

async function createUser(role: Role = Role.student) {
  const marker = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: "mentee-dashboard-repo-" + marker + "@example.com",
      firstName: "Repo",
      lastName: "Tester",
      role,
      passwordHash: "hash",
      emailConfirmed: true,
      isFirstTimeLogin: false,
    },
  });

  createdUserIds.push(user.id);
  return user;
}

async function createActivity(args: {
  studentId: string;
  status?: ActivityStatus;
  date?: Date;
  timeSpent?: number;
  notes?: string | null;
  createdAt?: Date;
}) {
  const activity = await prisma.activity.create({
    data: {
      studentId: args.studentId,
      status: args.status ?? ActivityStatus.pending,
      date: args.date ?? new Date(),
      timeSpent: args.timeSpent ?? 30,
      notes: args.notes ?? "Repo task " + randomUUID(),
      technologies: [],
      ...(args.createdAt ? { createdAt: args.createdAt } : {}),
    },
  });

  createdActivityIds.push(activity.id);
  return activity;
}

async function createFeedback(args: {
  activityId: string;
  mentorId: string;
  status?: FeedbackStatus;
  feedbackNotes?: string | null;
  createdAt?: Date;
}) {
  const feedback = await prisma.mentorFeedback.create({
    data: {
      activityId: args.activityId,
      mentorId: args.mentorId,
      status: args.status ?? FeedbackStatus.pending,
      feedbackNotes: args.feedbackNotes ?? null,
      ...(args.createdAt ? { createdAt: args.createdAt } : {}),
    },
  });

  createdFeedbackIds.push(feedback.id);
  return feedback;
}

describe("ActivityRepository.getMenteeDashboardData integration", () => {
  beforeAll(() => {
    assertTestDatabase();
  });

  afterEach(async () => {
    if (createdFeedbackIds.length > 0) {
      await prisma.mentorFeedback.deleteMany({
        where: { id: { in: [...createdFeedbackIds] } },
      });
      createdFeedbackIds.length = 0;
    }

    if (createdActivityIds.length > 0) {
      await prisma.activity.deleteMany({
        where: { id: { in: [...createdActivityIds] } },
      });
      createdActivityIds.length = 0;
    }

    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: [...createdUserIds] } },
      });
      createdUserIds.length = 0;
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("returns zeroed stats and stable pagination for empty dataset", async () => {
    const student = await createUser(Role.student);

    const result = await repository.getMenteeDashboardData(student.id, 1, 7);

    expect(result.stats).toEqual({
      totalHoursLogged: 0,
      approvedTasks: 0,
      pendingApprovals: 0,
      rejectedTasks: 0,
    });
    expect(result.activities).toEqual([]);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.pageSize).toBe(7);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.totalPages).toBe(1);
  });

  test("computes stats aggregation correctly", async () => {
    const student = await createUser(Role.student);

    await createActivity({
      studentId: student.id,
      status: ActivityStatus.accepted,
      timeSpent: 60,
    });
    await createActivity({
      studentId: student.id,
      status: ActivityStatus.accepted,
      timeSpent: 30,
    });
    await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      timeSpent: 45,
    });
    await createActivity({
      studentId: student.id,
      status: ActivityStatus.rejected,
      timeSpent: 15,
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 10);

    expect(result.stats.totalHoursLogged).toBe(150);
    expect(result.stats.approvedTasks).toBe(2);
    expect(result.stats.pendingApprovals).toBe(1);
  });

  test("applies safe page and pageSize boundaries (>=1)", async () => {
    const student = await createUser(Role.student);

    await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      notes: "Boundary Task 1",
    });
    await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      notes: "Boundary Task 2",
    });

    const result = await repository.getMenteeDashboardData(student.id, 0, 0);

    expect(result.pagination.page).toBe(1);
    expect(result.pagination.pageSize).toBe(1);
    expect(result.activities).toHaveLength(1);
  });

  test("orders activities by date desc then createdAt desc", async () => {
    const student = await createUser(Role.student);

    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-20T12:00:00.000Z"),
      createdAt: new Date("2026-04-20T12:05:00.000Z"),
      notes: "SameDateOlderCreatedAt",
    });

    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-20T12:00:00.000Z"),
      createdAt: new Date("2026-04-20T12:10:00.000Z"),
      notes: "SameDateNewerCreatedAt",
    });

    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-21T12:00:00.000Z"),
      createdAt: new Date("2026-04-21T12:01:00.000Z"),
      notes: "LatestDateTask",
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 10);

    expect(result.activities.map((a) => a.taskName)).toEqual([
      "LatestDateTask",
      "SameDateNewerCreatedAt",
      "SameDateOlderCreatedAt",
    ]);
  });

  test("extracts taskName from first line and falls back to Untitled Task", async () => {
    const student = await createUser(Role.student);

    await createActivity({
      studentId: student.id,
      notes: "First line title\nSecond line details",
      date: new Date("2026-04-20T12:00:00.000Z"),
    });

    await createActivity({
      studentId: student.id,
      notes: "   ",
      date: new Date("2026-04-19T12:00:00.000Z"),
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 10);

    expect(result.activities[0].taskName).toBe("First line title");
    expect(result.activities[1].taskName).toBe("Untitled Task");
  });

  test("uses latest mentor feedback by createdAt desc and trims feedbackNotes", async () => {
    const student = await createUser(Role.student);
    const mentor = await createUser(Role.mentor);

    const activity = await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      notes: "Task notes",
    });

    await createFeedback({
      activityId: activity.id,
      mentorId: mentor.id,
      status: FeedbackStatus.rejected,
      feedbackNotes: " older feedback ",
      createdAt: new Date("2026-04-20T10:00:00.000Z"),
    });

    await createFeedback({
      activityId: activity.id,
      mentorId: mentor.id,
      status: FeedbackStatus.approved,
      feedbackNotes: "  latest feedback  ",
      createdAt: new Date("2026-04-20T11:00:00.000Z"),
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 10);

    expect(result.activities[0].feedback).toBe("latest feedback");
  });

  test("applies feedback fallback order: latest feedbackNotes, then notes, then default text", async () => {
    const student = await createUser(Role.student);
    const mentor = await createUser(Role.mentor);

    const withFeedback = await createActivity({
      studentId: student.id,
      notes: "With feedback activity",
      date: new Date("2026-04-22T12:00:00.000Z"),
    });

    await createFeedback({
      activityId: withFeedback.id,
      mentorId: mentor.id,
      status: FeedbackStatus.pending,
      feedbackNotes: "  Preferred feedback  ",
    });

    await createActivity({
      studentId: student.id,
      notes: "  Use notes fallback  ",
      date: new Date("2026-04-21T12:00:00.000Z"),
    });

    await createActivity({
      studentId: student.id,
      notes: "   ",
      date: new Date("2026-04-20T12:00:00.000Z"),
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 10);

    expect(result.activities[0].feedback).toBe("Preferred feedback");
    expect(result.activities[1].feedback).toBe("Use notes fallback");
    expect(result.activities[2].feedback).toBe("No feedback available");
  });

  test("maps status to APPROVED, REJECTED, or PENDING", async () => {
    const student = await createUser(Role.student);
    const mentor = await createUser(Role.mentor);

    await createActivity({
      studentId: student.id,
      status: ActivityStatus.accepted,
      notes: "Approved from activity",
      date: new Date("2026-04-23T12:00:00.000Z"),
    });

    const approvedFromFeedback = await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      notes: "Approved from feedback",
      date: new Date("2026-04-22T12:00:00.000Z"),
    });

    await createFeedback({
      activityId: approvedFromFeedback.id,
      mentorId: mentor.id,
      status: FeedbackStatus.approved,
    });

    await createActivity({
      studentId: student.id,
      status: ActivityStatus.rejected,
      notes: "Rejected task",
      date: new Date("2026-04-21T12:00:00.000Z"),
    });

    await createActivity({
      studentId: student.id,
      status: ActivityStatus.pending,
      notes: "Pending task",
      date: new Date("2026-04-20T12:00:00.000Z"),
    });

    const result = await repository.getMenteeDashboardData(student.id, 1, 20);

    const byTask: Record<string, string> = {};
    result.activities.forEach((a) => {
      byTask[a.taskName] = a.status;
    });

    expect(byTask["Approved from activity"]).toBe("APPROVED");
    expect(byTask["Approved from feedback"]).toBe("APPROVED");
    expect(byTask["Rejected task"]).toBe("REJECTED");
    expect(byTask["Pending task"]).toBe("PENDING");
  });

  test("pagination totalPages and page slicing are correct", async () => {
    const student = await createUser(Role.student);

    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-23T12:00:00.000Z"),
      notes: "Task A",
    });
    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-22T12:00:00.000Z"),
      notes: "Task B",
    });
    await createActivity({
      studentId: student.id,
      date: new Date("2026-04-21T12:00:00.000Z"),
      notes: "Task C",
    });

    const page1 = await repository.getMenteeDashboardData(student.id, 1, 2);
    const page2 = await repository.getMenteeDashboardData(student.id, 2, 2);

    expect(page1.pagination.totalItems).toBe(3);
    expect(page1.pagination.totalPages).toBe(2);
    expect(page1.activities).toHaveLength(2);

    expect(page2.pagination.totalItems).toBe(3);
    expect(page2.pagination.totalPages).toBe(2);
    expect(page2.activities).toHaveLength(1);
  });
});
