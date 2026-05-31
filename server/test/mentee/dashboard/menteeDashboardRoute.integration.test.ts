import { randomUUID } from "crypto";

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { ActivityStatus, FeedbackStatus, Role } from "@prisma/client";
import { NextRequest } from "next/server";

import { GET } from "../../../src/app/api/mentee/dashboard/route";
import prisma from "../../../src/lib/prisma";
import getSession from "../../../src/server_actions/getSession";

jest.mock("../../../src/server_actions/getSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

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
      email: "mentee-dashboard-route-" + marker + "@example.com",
      firstName: "Route",
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
}) {
  const activity = await prisma.activity.create({
    data: {
      studentId: args.studentId,
      status: args.status ?? ActivityStatus.pending,
      date: args.date ?? new Date(),
      timeSpent: args.timeSpent ?? 30,
      notes: args.notes ?? "Route task " + randomUUID(),
      technologies: [],
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
}) {
  const feedback = await prisma.mentorFeedback.create({
    data: {
      activityId: args.activityId,
      mentorId: args.mentorId,
      status: args.status ?? FeedbackStatus.pending,
      feedbackNotes: args.feedbackNotes ?? null,
    },
  });

  createdFeedbackIds.push(feedback.id);
  return feedback;
}

function createDashboardRequest(args: {
  page?: string | number;
  pageSize?: string | number;
}) {
  const page = args.page ?? 1;
  const pageSize = args.pageSize ?? 4;
  const query =
    "http://localhost/api/mentee/dashboard?page=" +
    String(page) +
    "&pageSize=" +
    String(pageSize);

  return new NextRequest(query, { method: "GET" });
}

function buildSession({
  id = null,
  role = null,
  authenticated = true,
}: {
  id?: string | null;
  role?: Role | null;
  authenticated?: boolean;
}) {
  return {
    isAuthenticated: () => authenticated,
    getId: () => id,
    getRole: () => role,
  } as any;
}

describe("mentee dashboard route integration", () => {
  beforeAll(() => {
    assertTestDatabase();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(async () => {
    jest.restoreAllMocks();

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

  test("returns 401 when not authenticated", async () => {
    mockedGetSession.mockResolvedValue(buildSession({ authenticated: false }));

    const response = await GET(createDashboardRequest({}));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "Unauthorized" });
  });

  test("returns 403 for non-student role", async () => {
    const mentor = await createUser(Role.mentor);
    mockedGetSession.mockResolvedValue(
      buildSession({ id: mentor.id, role: Role.mentor }),
    );

    const response = await GET(createDashboardRequest({}));
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body).toEqual({ message: "Forbidden" });
  });

  test("returns 401 when authenticated student has missing user id", async () => {
    mockedGetSession.mockResolvedValue(
      buildSession({ role: Role.student, id: null }),
    );

    const response = await GET(createDashboardRequest({}));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ message: "User ID not found" });
  });

  test.each([
    ["abc", "4"],
    ["1", "abc"],
    ["0", "4"],
    ["1", "0"],
    ["-1", "4"],
    ["1", "-2"],
  ])(
    "returns 400 for invalid pagination params (page=%s, pageSize=%s)",
    async (page, pageSize) => {
      const student = await createUser(Role.student);
      mockedGetSession.mockResolvedValue(
        buildSession({ id: student.id, role: Role.student }),
      );

      const response = await GET(
        createDashboardRequest({
          page,
          pageSize,
        }),
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({ message: "Invalid pagination params" });
    },
  );

  test("returns 200 with frontend-compatible response contract", async () => {
    const student = await createUser(Role.student);
    const mentor = await createUser(Role.mentor);
    mockedGetSession.mockResolvedValue(
      buildSession({ id: student.id, role: Role.student }),
    );

    const activity = await createActivity({
      studentId: student.id,
      status: ActivityStatus.accepted,
      date: new Date("2026-04-20T12:00:00.000Z"),
      timeSpent: 90,
      notes: "Build dashboard cards\nwith responsive layout",
    });

    await createFeedback({
      activityId: activity.id,
      mentorId: mentor.id,
      status: FeedbackStatus.approved,
      feedbackNotes: "  Great work  ",
    });

    const response = await GET(
      createDashboardRequest({
        page: 1,
        pageSize: 7,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(typeof body.stats.totalHoursLogged).toBe("number");
    expect(typeof body.stats.approvedTasks).toBe("number");
    expect(typeof body.stats.pendingApprovals).toBe("number");
    expect(typeof body.stats.rejectedTasks).toBe("number");

    expect(Array.isArray(body.activities)).toBe(true);
    expect(body.activities.length).toBeGreaterThanOrEqual(1);

    const first = body.activities[0];
    expect(typeof first.taskName).toBe("string");
    expect(typeof first.feedback).toBe("string");
    expect(typeof first.date).toBe("string");
    expect(typeof first.hours).toBe("number");
    expect(["APPROVED", "PENDING", "REJECTED"]).toContain(first.status);

    expect(typeof body.pagination.page).toBe("number");
    expect(typeof body.pagination.pageSize).toBe("number");
    expect(typeof body.pagination.totalItems).toBe("number");
    expect(typeof body.pagination.totalPages).toBe("number");
  });

  test("caps pageSize at 50", async () => {
    const student = await createUser(Role.student);
    mockedGetSession.mockResolvedValue(
      buildSession({ id: student.id, role: Role.student }),
    );

    for (let i = 0; i < 3; i += 1) {
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.pending,
        timeSpent: 15 + i,
        notes: "Cap test " + i,
      });
    }

    const response = await GET(
      createDashboardRequest({
        page: 1,
        pageSize: 999,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.pagination.pageSize).toBe(50);
    expect(body.activities.length).toBeLessThanOrEqual(50);
  });

  test("returns 500 when repository layer throws (page=Infinity causes prisma validation failure)", async () => {
    const student = await createUser(Role.student);
    mockedGetSession.mockResolvedValue(
      buildSession({ id: student.id, role: Role.student }),
    );

    const response = await GET(
      createDashboardRequest({
        page: "Infinity",
        pageSize: 5,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ message: "Error fetching mentee dashboard data" });
  });
});
