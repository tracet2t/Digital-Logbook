import { ActivityRepository } from "../../../src/repositories/activity_repository_impl";
import prisma from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    activity: {
      findMany: jest.fn(),
    },
    projectAllocation: {
      findUnique: jest.fn(),
    },
  },
}));

describe("US40 - ActivityRepository.getMenteeActivitySummary", () => {
  const repo = new ActivityRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns zero summary when project allocation is missing", async () => {
    (prisma.projectAllocation.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await repo.getMenteeActivitySummary("student-1", "project-1");

    expect(prisma.projectAllocation.findUnique).toHaveBeenCalledWith({
      where: {
        projectId_studentId: {
          projectId: "project-1",
          studentId: "student-1",
        },
      },
    });

    expect(prisma.activity.findMany).not.toHaveBeenCalled();
    expect(result).toEqual({
      studentId: "student-1",
      projectId: "project-1",
      totalSubmitted: 0,
      totalAccepted: 0,
      totalAcceptedHours: 0,
      totalPending: 0,
      totalPendingHours: 0,
      totalRejected: 0,
      totalRejectedHours: 0,
      acceptanceRate: 0,
      lastActivityDate: null,
      firstActivityDate: null,
    });
  });

  test("returns aggregated counts, hours, rate, and first/last activity dates", async () => {
    const firstDate = new Date("2026-03-01T10:00:00.000Z");
    const secondDate = new Date("2026-03-02T10:00:00.000Z");
    const thirdDate = new Date("2026-03-03T10:00:00.000Z");

    (prisma.projectAllocation.findUnique as jest.Mock).mockResolvedValue({
      projectId: "project-1",
      studentId: "student-1",
    });

    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { status: "pending", timeSpent: 2, date: firstDate },
      { status: "accepted", timeSpent: 3, date: secondDate },
      { status: "rejected", timeSpent: 1, date: thirdDate },
    ]);

    const result = await repo.getMenteeActivitySummary("student-1", "project-1");

    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: { studentId: "student-1" },
      orderBy: { date: "asc" },
    });

    expect(result).toEqual({
      studentId: "student-1",
      projectId: "project-1",
      totalSubmitted: 3,
      totalAccepted: 1,
      totalAcceptedHours: 3,
      totalPending: 1,
      totalPendingHours: 2,
      totalRejected: 1,
      totalRejectedHours: 1,
      acceptanceRate: 1 / 3,
      firstActivityDate: firstDate,
      lastActivityDate: thirdDate,
    });
  });

  test("does not require allocation check when projectId is omitted", async () => {
    (prisma.activity.findMany as jest.Mock).mockResolvedValue([
      { status: "accepted", timeSpent: 5, date: new Date("2026-03-10T10:00:00.000Z") },
    ]);

    const result = await repo.getMenteeActivitySummary("student-2");

    expect(prisma.projectAllocation.findUnique).not.toHaveBeenCalled();
    expect(result.projectId).toBeNull();
    expect(result.totalSubmitted).toBe(1);
    expect(result.totalAccepted).toBe(1);
    expect(result.totalAcceptedHours).toBe(5);
  });
});
