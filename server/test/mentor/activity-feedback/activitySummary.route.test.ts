/** @jest-environment node */

jest.mock("../../../src/repositories/activity_repository_impl", () => ({
  __esModule: true,
  __repo: {
    getMenteeActivitySummary: jest.fn(),
  },
  ActivityRepository: jest.fn(function ActivityRepositoryMock(this: unknown) {
    return (jest.requireMock("../../../src/repositories/activity_repository_impl") as {
      __repo: { getMenteeActivitySummary: jest.Mock };
    }).__repo;
  }),
}));

jest.mock("../../../src/server_actions/getSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import getSession from "../../../src/server_actions/getSession";
import * as activityRepoModule from "../../../src/repositories/activity_repository_impl";
import { GET } from "../../../src/app/api/activity/summary/route";

describe("US40 - GET /api/activity/summary", () => {
  const mockActivityRepository = (activityRepoModule as unknown as {
    __repo: { getMenteeActivitySummary: jest.Mock };
  }).__repo;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when session is not authenticated", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const req = new Request(
      "http://localhost:3000/api/activity/summary?studentId=student-1",
    );

    const res = await GET(req as any);

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ message: "Unauthorized" });
  });

  test("returns 400 when studentId query param is missing", async () => {
    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getId: () => "mentor-1",
      getRole: () => "mentor",
    });

    const req = new Request("http://localhost:3000/api/activity/summary");

    const res = await GET(req as any);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "studentId query param required",
    });
  });

  test("returns summary payload for authorized mentor", async () => {
    const summaryPayload = {
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
      lastActivityDate: "2026-03-03T10:00:00.000Z",
      firstActivityDate: "2026-03-01T10:00:00.000Z",
    };

    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getId: () => "mentor-1",
      getRole: () => "mentor",
    });

    mockActivityRepository.getMenteeActivitySummary.mockResolvedValue(
      summaryPayload,
    );

    const req = new Request(
      "http://localhost:3000/api/activity/summary?studentId=student-1&projectId=project-1",
    );

    const res = await GET(req as any);

    expect(mockActivityRepository.getMenteeActivitySummary).toHaveBeenCalledWith(
      "student-1",
      "project-1",
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(summaryPayload);
  });
});
