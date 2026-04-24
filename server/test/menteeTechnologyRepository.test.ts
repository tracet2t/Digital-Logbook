import { randomUUID } from "crypto";

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";
import { ActivityStatus, Role } from "@prisma/client";

import prisma from "../src/lib/prisma";
import { MenteeTechnologyRepository } from "../src/repositories/mentee_technology_repository_impl";

const repository = new MenteeTechnologyRepository();

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
      email: `mentee-tech-${marker}@example.com`,
      firstName: "Test",
      lastName: "User",
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
  date,
  timeSpent = 60,
  notes,
}: {
  studentId: string;
  status?: ActivityStatus;
  technologies?: string[];
  date?: Date;
  timeSpent?: number;
  notes?: string;
}) {
  const activity = await prisma.activity.create({
    data: {
      studentId,
      date: date ?? new Date(),
      timeSpent,
      notes: notes ?? `mentee-tech-${randomUUID()}`,
      technologies,
      status,
    },
  });

  createdActivityIds.push(activity.id);
  return activity;
}

describe("MenteeTechnologyRepository", () => {
  beforeAll(() => {
    assertTestDatabase();
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

  describe("addTechnologiesToTask", () => {
    test("updates a task for its owning student", async () => {
      const student = await createUser();
      const activity = await createActivity({
        studentId: student.id,
        technologies: ["Node.js"],
      });

      const result = await repository.addTechnologiesToTask(
        activity.id,
        student.id,
        ["Next.js", "PostgreSQL"],
      );

      expect(result.kind).toBe("updated");
      if (result.kind !== "updated") {
        throw new Error("Expected updated result");
      }

      expect(result.task.taskId).toBe(activity.id);
      expect(result.task.technologies).toEqual(["Next.js", "PostgreSQL"]);

      const updatedActivity = await prisma.activity.findUnique({
        where: { id: activity.id },
      });

      expect(updatedActivity?.technologies).toEqual(["Next.js", "PostgreSQL"]);
    });

    test("returns not_found when the task does not exist", async () => {
      const student = await createUser();

      const result = await repository.addTechnologiesToTask(
        randomUUID(),
        student.id,
        ["TypeScript"],
      );

      expect(result).toEqual({ kind: "not_found" });
    });

    test("returns forbidden when another student tries to update the task", async () => {
      const owner = await createUser();
      const intruder = await createUser();
      const activity = await createActivity({
        studentId: owner.id,
        technologies: ["React"],
      });

      const result = await repository.addTechnologiesToTask(
        activity.id,
        intruder.id,
        ["Rust"],
      );

      expect(result).toEqual({ kind: "forbidden" });

      const unchangedActivity = await prisma.activity.findUnique({
        where: { id: activity.id },
      });

      expect(unchangedActivity?.technologies).toEqual(["React"]);
    });
  });

  describe("getTaskTechnologiesByStudent", () => {
    test("returns only approved tasks for the given student", async () => {
      const student = await createUser();
      const otherStudent = await createUser();

      const latestAccepted = await createActivity({
        studentId: student.id,
        status: ActivityStatus.accepted,
        technologies: ["Next.js"],
        date: new Date("2026-04-20T10:00:00.000Z"),
      });
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.pending,
        technologies: ["ShouldNotAppear"],
        date: new Date("2026-04-19T10:00:00.000Z"),
      });
      const olderAccepted = await createActivity({
        studentId: student.id,
        status: ActivityStatus.accepted,
        technologies: ["PostgreSQL"],
        date: new Date("2026-04-18T10:00:00.000Z"),
      });
      await createActivity({
        studentId: otherStudent.id,
        status: ActivityStatus.accepted,
        technologies: ["OtherStudentTech"],
        date: new Date("2026-04-21T10:00:00.000Z"),
      });

      const result = await repository.getTaskTechnologiesByStudent(student.id);

      expect(result).toHaveLength(2);
      expect(result.map((task) => task.taskId)).toEqual([
        latestAccepted.id,
        olderAccepted.id,
      ]);
      expect(result.every((task) => task.technologies[0] !== "ShouldNotAppear")).toBe(true);
      expect(result.every((task) => task.technologies[0] !== "OtherStudentTech")).toBe(true);
    });

    test("returns an empty array when the student has no approved tasks", async () => {
      const student = await createUser();

      await createActivity({
        studentId: student.id,
        status: ActivityStatus.pending,
        technologies: ["PendingOnly"],
      });

      const result = await repository.getTaskTechnologiesByStudent(student.id);

      expect(result).toEqual([]);
    });
  });

  describe("getAllTechnologiesForStudent", () => {
    test("returns a flat unique sorted list of technologies", async () => {
      const student = await createUser();

      await createActivity({
        studentId: student.id,
        status: ActivityStatus.accepted,
        technologies: ["React", "TypeScript", "React"],
      });
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.accepted,
        technologies: ["Node.js", "TypeScript"],
      });
      await createActivity({
        studentId: student.id,
        status: ActivityStatus.pending,
        technologies: ["ShouldNotAppear"],
      });

      const result = await repository.getAllTechnologiesForStudent(student.id);

      expect(result).toEqual(["Node.js", "React", "TypeScript"]);
    });

    test("returns an empty array when the student has no approved task technologies", async () => {
      const student = await createUser();

      const result = await repository.getAllTechnologiesForStudent(student.id);

      expect(result).toEqual([]);
    });
  });
});