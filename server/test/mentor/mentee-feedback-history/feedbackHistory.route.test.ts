/** @jest-environment node */

jest.mock("../../../src/repositories/mentor_feedback_repository_impl", () => ({
  __esModule: true,
  __repo: {
    getMenteeFeedbackHistory: jest.fn(),
  },
  MentorFeedbackRepository: jest.fn(function MentorFeedbackRepositoryMock(
    this: unknown,
  ) {
    return (jest.requireMock(
      "../../../src/repositories/mentor_feedback_repository_impl",
    ) as {
      __repo: { getMenteeFeedbackHistory: jest.Mock };
    }).__repo;
  }),
}));

jest.mock("../../../src/server_actions/getSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import getSession from "../../../src/server_actions/getSession";
import * as feedbackRepoModule from "../../../src/repositories/mentor_feedback_repository_impl";
import { GET } from "../../../src/app/api/feedback/history/route";

describe("GET /api/feedback/history", () => {
  const mockFeedbackRepository = (feedbackRepoModule as unknown as {
    __repo: { getMenteeFeedbackHistory: jest.Mock };
  }).__repo;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 401 when session is not authenticated", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const req = new Request(
      "http://localhost:3000/api/feedback/history?studentId=student-1",
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

    const req = new Request("http://localhost:3000/api/feedback/history");

    const res = await GET(req as any);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      error: "studentId query param required",
    });
  });

  test("returns 403 for unauthorized role", async () => {
    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getId: () => "another-student",
      getRole: () => "student",
    });

    const req = new Request(
      "http://localhost:3000/api/feedback/history?studentId=student-1",
    );

    const res = await GET(req as any);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: "Forbidden" });
  });

  test("returns feedback history payload for authorized mentor", async () => {
    const history = [
      {
        id: "fb-1",
        activityId: "a-1",
        mentorId: "m-1",
        mentorName: "Jane Doe",
        status: "approved",
        feedbackNotes: "Great progress",
        activityDate: "2026-03-19T09:00:00.000Z",
        feedbackDate: "2026-03-20T11:00:00.000Z",
      },
    ];

    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getId: () => "mentor-1",
      getRole: () => "mentor",
    });

    mockFeedbackRepository.getMenteeFeedbackHistory.mockResolvedValue(history);

    const req = new Request(
      "http://localhost:3000/api/feedback/history?studentId=student-1",
    );

    const res = await GET(req as any);

    expect(mockFeedbackRepository.getMenteeFeedbackHistory).toHaveBeenCalledWith(
      "student-1",
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      studentId: "student-1",
      feedbackCount: 1,
      feedback: history,
    });
  });
});
