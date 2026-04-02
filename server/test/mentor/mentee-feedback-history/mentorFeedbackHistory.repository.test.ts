import { MentorFeedbackRepository } from "../../../src/repositories/mentor_feedback_repository_impl";
import prisma from "../../../src/lib/prisma";

jest.mock("../../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    mentorFeedback: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("MentorFeedbackRepository.getMenteeFeedbackHistory", () => {
  const repo = new MentorFeedbackRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns mapped feedback history with status and feedback notes", async () => {
    const feedbackDate = new Date("2026-03-20T11:00:00.000Z");
    const activityDate = new Date("2026-03-19T09:00:00.000Z");

    (prisma.mentorFeedback.findMany as jest.Mock).mockResolvedValue([
      {
        id: "fb-1",
        activityId: "activity-1",
        mentorId: "mentor-1",
        status: "approved",
        feedbackNotes: "Strong consistency this week.",
        createdAt: feedbackDate,
        activity: {
          date: activityDate,
        },
        mentor: {
          id: "mentor-1",
          firstName: "Jane",
          lastName: "Doe",
        },
      },
    ]);

    const result = await repo.getMenteeFeedbackHistory("student-1");

    expect(prisma.mentorFeedback.findMany).toHaveBeenCalledWith({
      where: {
        activity: {
          studentId: "student-1",
        },
      },
      include: {
        activity: {
          select: {
            date: true,
          },
        },
        mentor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    expect(result).toEqual([
      {
        id: "fb-1",
        activityId: "activity-1",
        mentorId: "mentor-1",
        mentorName: "Jane Doe",
        status: "approved",
        feedbackNotes: "Strong consistency this week.",
        activityDate,
        feedbackDate,
      },
    ]);
  });

  test("returns an empty list when no feedback exists", async () => {
    (prisma.mentorFeedback.findMany as jest.Mock).mockResolvedValue([]);

    const result = await repo.getMenteeFeedbackHistory("student-no-feedback");

    expect(result).toEqual([]);
  });
});
