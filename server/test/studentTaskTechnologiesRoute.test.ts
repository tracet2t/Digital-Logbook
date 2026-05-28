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
import { ActivityStatus, Role } from "@prisma/client";
import { NextRequest } from "next/server";

import prisma from "../src/lib/prisma";
import { GET, PATCH } from "../src/app/api/student/tasks/technologies/route";
import getSession from "../src/server_actions/getSession";

jest.mock("../src/server_actions/getSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

const createdActivityIds: string[] = [];
const createdUserIds: string[] = [];

function assertTestDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  expect(databaseUrl).toBeDefined();
  expect(databaseUrl).toMatch(/localhost|127\.0\.0\.1|test/i);
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

async function createUser(role: Role = Role.student) {
  const marker = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: `route-tech-${marker}@example.com`,
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

async function createActivity({
  studentId,
  status = ActivityStatus.accepted,
  technologies = [],
  notes,
}: {
  studentId: string;
  status?: ActivityStatus;
  technologies?: string[];
  notes?: string;
}) {
  const activity = await prisma.activity.create({
    data: {
      studentId,
      date: new Date(),
      timeSpent: 30,
      notes: notes ?? `route-tech-${randomUUID()}`,
      technologies,
      status,
    },
  });

  createdActivityIds.push(activity.id);
  return activity;
}

function createPatchRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/student/tasks/technologies", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("student task technologies route", () => {
  beforeAll(() => {
    assertTestDatabase();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
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

  describe("auth guards", () => {
    test.each([
      ["GET", async () => GET()],
      ["PATCH", async () => PATCH(createPatchRequest({ taskId: randomUUID(), technologies: ["React"] }))],
    ])("returns 401 for missing session on %s", async (_method, callRoute) => {
      mockedGetSession.mockResolvedValue(buildSession({ authenticated: false }));

      const response = await callRoute();
      const body = await response.json();

      expect(response.status).toBe(401);
      expect(body).toEqual({ message: "Unauthorized" });
    });

    test.each([
      ["GET", async () => GET()],
      ["PATCH", async () => PATCH(createPatchRequest({ taskId: randomUUID(), technologies: ["React"] }))],
    ])("returns 403 for wrong role on %s", async (_method, callRoute) => {
      const mentor = await createUser(Role.mentor);
      mockedGetSession.mockResolvedValue(
        buildSession({ id: mentor.id, role: Role.mentor }),
      );

      const response = await callRoute();
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({ message: "Forbidden" });
    });
  });

  describe("GET", () => {
    test("returns approved tasks and a unique technology list for the authenticated student", async () => {
      const student = await createUser(Role.student);
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.accepted,
        technologies: ["TypeScript", "React"],
        notes: "accepted-task",
      });
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.pending,
        technologies: ["ShouldNotAppear"],
        notes: "pending-task",
      });

      mockedGetSession.mockResolvedValue(
        buildSession({ id: student.id, role: Role.student }),
      );

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.tasks).toHaveLength(1);
      expect(body.tasks[0].notes).toBe("accepted-task");
      expect(body.tasks[0].technologies).toEqual(["TypeScript", "React"]);
      expect(body.allTechnologies).toEqual(["React", "TypeScript"]);
    });
  });

  describe("PATCH", () => {
    test("updates the authenticated student's task technologies", async () => {
      const student = await createUser(Role.student);
      const activity = await createActivity({
        studentId: student.id,
        technologies: ["OldTech"],
      });

      mockedGetSession.mockResolvedValue(
        buildSession({ id: student.id, role: Role.student }),
      );

      const response = await PATCH(
        createPatchRequest({
          taskId: activity.id,
          technologies: [" React ", "TypeScript", "React"],
        }),
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.technologies).toEqual(["React", "TypeScript"]);

      const updatedActivity = await prisma.activity.findUnique({
        where: { id: activity.id },
      });

      expect(updatedActivity?.technologies).toEqual(["React", "TypeScript"]);
    });

    test("returns 400 with a descriptive message for invalid input", async () => {
      const student = await createUser(Role.student);
      mockedGetSession.mockResolvedValue(
        buildSession({ id: student.id, role: Role.student }),
      );

      const response = await PATCH(
        createPatchRequest({
          taskId: "",
          technologies: ["React"],
        }),
      );
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body).toEqual({ message: "taskId is required" });
    });

    test("returns 404 when the task does not exist", async () => {
      const student = await createUser(Role.student);
      mockedGetSession.mockResolvedValue(
        buildSession({ id: student.id, role: Role.student }),
      );

      const response = await PATCH(
        createPatchRequest({
          taskId: randomUUID(),
          technologies: ["React"],
        }),
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body).toEqual({ message: "Task not found" });
    });

    test("returns 403 and leaves the record unchanged when a student targets another student's task", async () => {
      const owner = await createUser(Role.student);
      const otherStudent = await createUser(Role.student);
      const activity = await createActivity({
        studentId: owner.id,
        technologies: ["OwnerOnly"],
      });

      mockedGetSession.mockResolvedValue(
        buildSession({ id: otherStudent.id, role: Role.student }),
      );

      const response = await PATCH(
        createPatchRequest({
          taskId: activity.id,
          technologies: ["UnauthorizedChange"],
        }),
      );
      const body = await response.json();

      expect(response.status).toBe(403);
      expect(body).toEqual({ message: "Forbidden" });

      const unchangedActivity = await prisma.activity.findUnique({
        where: { id: activity.id },
      });

      expect(unchangedActivity?.technologies).toEqual(["OwnerOnly"]);
    });
  });
});