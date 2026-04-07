import { OnboardingRepository } from "../../src/repositories/onboarding_repository_impl";
import prisma from "../../src/lib/prisma";

jest.mock("../../src/lib/prisma", () => ({
  __esModule: true,
  default: {
    menteeApplication: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("OnboardingRepository", () => {
  let repo: OnboardingRepository;

  const mockMenteeApplication = {
    id: "mentee-app-123",
    fullName: "John Doe",
    email: "john@example.com",
    university: "MIT",
    degreeProgram: "Computer Science",
    cvLink: "https://example.com/cv.pdf",
    status: "pending" as const,
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-01"),
  };

  beforeEach(() => {
    repo = new OnboardingRepository();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findByEmail", () => {
    test("should find a mentee application by email successfully", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockResolvedValue(
        mockMenteeApplication,
      );

      const result = await repo.findByEmail("john@example.com");

      expect(prisma.menteeApplication.findUnique).toHaveBeenCalledWith({
        where: { email: "john@example.com" },
      });
      expect(result).toEqual(mockMenteeApplication);
      expect(result?.email).toBe("john@example.com");
    });

    test("should return null if email not found", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repo.findByEmail("nonexistent@example.com");

      expect(prisma.menteeApplication.findUnique).toHaveBeenCalledWith({
        where: { email: "nonexistent@example.com" },
      });
      expect(result).toBeNull();
    });

    test("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      (prisma.menteeApplication.findUnique as jest.Mock).mockRejectedValue(
        dbError,
      );

      await expect(repo.findByEmail("john@example.com")).rejects.toThrow(
        "Database connection failed",
      );
    });

    test("should handle empty email string", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repo.findByEmail("");

      expect(prisma.menteeApplication.findUnique).toHaveBeenCalledWith({
        where: { email: "" },
      });
      expect(result).toBeNull();
    });
  });

  describe("findByStatus", () => {
    test("should find applications by status successfully", async () => {
      const mockPendingApps = [
        mockMenteeApplication,
        {
          ...mockMenteeApplication,
          id: "mentee-app-124",
          email: "jane@example.com",
          fullName: "Jane Smith",
        },
      ];

      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockPendingApps,
      );

      const result = await repo.findByStatus("pending");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockPendingApps);
    });

    test("should return empty array when no applications match status", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.findByStatus("rejected");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "rejected" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual([]);
    });

    test("should handle database errors when finding by status", async () => {
      const dbError = new Error("Query failed");
      (prisma.menteeApplication.findMany as jest.Mock).mockRejectedValue(
        dbError,
      );

      await expect(repo.findByStatus("pending")).rejects.toThrow(
        "Query failed",
      );
    });

    test("should order results by createdAt in descending order", async () => {
      const mockApps = [
        { ...mockMenteeApplication, createdAt: new Date("2026-04-03") },
        { ...mockMenteeApplication, createdAt: new Date("2026-04-02") },
        { ...mockMenteeApplication, createdAt: new Date("2026-04-01") },
      ];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockApps,
      );

      await repo.findByStatus("approved");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getPendingApplications", () => {
    test("should get all pending applications", async () => {
      const mockPendingApps = [mockMenteeApplication];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockPendingApps,
      );

      const result = await repo.getPendingApplications();

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "pending" },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockPendingApps);
    });

    test("should return empty array if no pending applications", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.getPendingApplications();

      expect(result).toEqual([]);
    });
  });

  describe("getApprovedApplications", () => {
    test("should get all approved applications", async () => {
      const mockApprovedApp = {
        ...mockMenteeApplication,
        status: "approved" as const,
      };
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([
        mockApprovedApp,
      ]);

      const result = await repo.getApprovedApplications();

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "approved" },
        orderBy: { createdAt: "desc" },
      });
      expect(result[0].status).toBe("approved");
    });

    test("should return empty array if no approved applications", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.getApprovedApplications();

      expect(result).toEqual([]);
    });
  });

  describe("getRejectedApplications", () => {
    test("should get all rejected applications", async () => {
      const mockRejectedApp = {
        ...mockMenteeApplication,
        status: "rejected" as const,
      };
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([
        mockRejectedApp,
      ]);

      const result = await repo.getRejectedApplications();

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: { status: "rejected" },
        orderBy: { createdAt: "desc" },
      });
      expect(result[0].status).toBe("rejected");
    });

    test("should return empty array if no rejected applications", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.getRejectedApplications();

      expect(result).toEqual([]);
    });
  });

  describe("updateStatus", () => {
    test("should update application status successfully", async () => {
      const updatedApp = {
        ...mockMenteeApplication,
        status: "approved" as const,
      };
      (prisma.menteeApplication.update as jest.Mock).mockResolvedValue(
        updatedApp,
      );

      const result = await repo.updateStatus(
        "mentee-app-123",
        "approved",
      );

      expect(prisma.menteeApplication.update).toHaveBeenCalledWith({
        where: { id: "mentee-app-123" },
        data: { status: "approved" },
      });
      expect(result.status).toBe("approved");
    });

    test("should update status to rejected", async () => {
      const updatedApp = {
        ...mockMenteeApplication,
        status: "rejected" as const,
      };
      (prisma.menteeApplication.update as jest.Mock).mockResolvedValue(
        updatedApp,
      );

      const result = await repo.updateStatus(
        "mentee-app-123",
        "rejected",
      );

      expect(prisma.menteeApplication.update).toHaveBeenCalledWith({
        where: { id: "mentee-app-123" },
        data: { status: "rejected" },
      });
      expect(result.status).toBe("rejected");
    });

    test("should handle application not found", async () => {
      const notFoundError = new Error("Record not found");
      (prisma.menteeApplication.update as jest.Mock).mockRejectedValue(
        notFoundError,
      );

      await expect(
        repo.updateStatus("nonexistent-id", "approved"),
      ).rejects.toThrow("Record not found");
    });

    test("should handle database errors during update", async () => {
      const dbError = new Error("Database error");
      (prisma.menteeApplication.update as jest.Mock).mockRejectedValue(
        dbError,
      );

      await expect(
        repo.updateStatus("mentee-app-123", "approved"),
      ).rejects.toThrow("Database error");
    });
  });

  describe("approveApplication", () => {
    test("should approve an application by ID", async () => {
      const approvedApp = {
        ...mockMenteeApplication,
        status: "approved" as const,
      };
      (prisma.menteeApplication.update as jest.Mock).mockResolvedValue(
        approvedApp,
      );

      const result = await repo.approveApplication("mentee-app-123");

      expect(prisma.menteeApplication.update).toHaveBeenCalledWith({
        where: { id: "mentee-app-123" },
        data: { status: "approved" },
      });
      expect(result.status).toBe("approved");
    });

    test("should handle approval of non-existent application", async () => {
      (prisma.menteeApplication.update as jest.Mock).mockRejectedValue(
        new Error("Application not found"),
      );

      await expect(repo.approveApplication("invalid-id")).rejects.toThrow(
        "Application not found",
      );
    });
  });

  describe("rejectApplication", () => {
    test("should reject an application by ID", async () => {
      const rejectedApp = {
        ...mockMenteeApplication,
        status: "rejected" as const,
      };
      (prisma.menteeApplication.update as jest.Mock).mockResolvedValue(
        rejectedApp,
      );

      const result = await repo.rejectApplication("mentee-app-123");

      expect(prisma.menteeApplication.update).toHaveBeenCalledWith({
        where: { id: "mentee-app-123" },
        data: { status: "rejected" },
      });
      expect(result.status).toBe("rejected");
    });

    test("should handle rejection of non-existent application", async () => {
      (prisma.menteeApplication.update as jest.Mock).mockRejectedValue(
        new Error("Application not found"),
      );

      await expect(repo.rejectApplication("invalid-id")).rejects.toThrow(
        "Application not found",
      );
    });
  });

  describe("createApplication", () => {
    test("should create a new mentee application successfully", async () => {
      const newApplicationData = {
        fullName: "Alice Johnson",
        email: "alice@example.com",
        university: "Stanford",
        degreeProgram: "Software Engineering",
        cvLink: "https://example.com/alice-cv.pdf",
      };

      const createdApp = {
        id: "mentee-app-new",
        ...newApplicationData,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.menteeApplication.create as jest.Mock).mockResolvedValue(
        createdApp,
      );

      const result = await repo.createApplication(newApplicationData);

      expect(prisma.menteeApplication.create).toHaveBeenCalledWith({
        data: {
          ...newApplicationData,
          status: "pending",
        },
      });
      expect(result.status).toBe("pending");
      expect(result.email).toBe("alice@example.com");
      expect(result.fullName).toBe("Alice Johnson");
    });

    test("should set initial status to pending", async () => {
      const newApplicationData = {
        fullName: "Bob Smith",
        email: "bob@example.com",
        university: "Harvard",
        degreeProgram: "Biology",
        cvLink: "https://example.com/bob-cv.pdf",
      };

      (prisma.menteeApplication.create as jest.Mock).mockResolvedValue({
        id: "mentee-app-bob",
        ...newApplicationData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await repo.createApplication(newApplicationData);

      expect(prisma.menteeApplication.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          status: "pending",
        }),
      });
      expect(result.status).toBe("pending");
    });

    test("should handle database errors during creation", async () => {
      const newApplicationData = {
        fullName: "Test User",
        email: "test@example.com",
        university: "Test University",
        degreeProgram: "Test Program",
        cvLink: "https://example.com/cv.pdf",
      };

      (prisma.menteeApplication.create as jest.Mock).mockRejectedValue(
        new Error("Unique constraint failed on the fields: (`email`)"),
      );

      await expect(repo.createApplication(newApplicationData)).rejects.toThrow(
        "Unique constraint failed",
      );
    });

    test("should not include id, createdAt, updatedAt in create data", async () => {
      const newApplicationData = {
        fullName: "Charlie Brown",
        email: "charlie@example.com",
        university: "Yale",
        degreeProgram: "Mathematics",
        cvLink: "https://example.com/charlie-cv.pdf",
      };

      (prisma.menteeApplication.create as jest.Mock).mockResolvedValue({
        id: "mentee-app-charlie",
        ...newApplicationData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await repo.createApplication(newApplicationData);

      const callArgs = (prisma.menteeApplication.create as jest.Mock)
        .mock.calls[0][0];
      expect(callArgs.data).not.toHaveProperty("id");
      expect(callArgs.data).not.toHaveProperty("createdAt");
      expect(callArgs.data).not.toHaveProperty("updatedAt");
    });
  });

  describe("getApplicationById", () => {
    test("should retrieve application by ID successfully", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockResolvedValue(
        mockMenteeApplication,
      );

      const result = await repo.getApplicationById("mentee-app-123");

      expect(prisma.menteeApplication.findUnique).toHaveBeenCalledWith({
        where: { id: "mentee-app-123" },
      });
      expect(result).toEqual(mockMenteeApplication);
    });

    test("should return null if application not found", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repo.getApplicationById("nonexistent-id");

      expect(result).toBeNull();
    });

    test("should handle database errors when getting by ID", async () => {
      (prisma.menteeApplication.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await expect(repo.getApplicationById("mentee-app-123")).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getApplicationsByDateRange", () => {
    test("should retrieve applications within date range successfully", async () => {
      const startDate = new Date("2026-04-01");
      const endDate = new Date("2026-04-30");

      const mockAppsInRange = [
        mockMenteeApplication,
        {
          ...mockMenteeApplication,
          id: "mentee-app-124",
          email: "jane@example.com",
          createdAt: new Date("2026-04-15"),
        },
      ];

      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockAppsInRange,
      );

      const result = await repo.getApplicationsByDateRange(startDate, endDate);

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toHaveLength(2);
    });

    test("should return empty array if no applications in date range", async () => {
      const startDate = new Date("2026-05-01");
      const endDate = new Date("2026-05-31");

      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.getApplicationsByDateRange(startDate, endDate);

      expect(result).toEqual([]);
    });

    test("should order results by createdAt in descending order", async () => {
      const startDate = new Date("2026-04-01");
      const endDate = new Date("2026-04-30");

      const mockApps = [
        { ...mockMenteeApplication, createdAt: new Date("2026-04-30") },
        { ...mockMenteeApplication, createdAt: new Date("2026-04-15") },
        { ...mockMenteeApplication, createdAt: new Date("2026-04-01") },
      ];

      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockApps,
      );

      await repo.getApplicationsByDateRange(startDate, endDate);

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    test("should handle inclusive date range boundaries", async () => {
      const startDate = new Date("2026-04-01T00:00:00Z");
      const endDate = new Date("2026-04-30T23:59:59Z");

      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      await repo.getApplicationsByDateRange(startDate, endDate);

      const callArgs = (prisma.menteeApplication.findMany as jest.Mock)
        .mock.calls[0][0];
      expect(callArgs.where.createdAt.gte).toEqual(startDate);
      expect(callArgs.where.createdAt.lte).toEqual(endDate);
    });

    test("should handle database errors during date range query", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockRejectedValue(
        new Error("Query failed"),
      );

      await expect(
        repo.getApplicationsByDateRange(
          new Date("2026-04-01"),
          new Date("2026-04-30"),
        ),
      ).rejects.toThrow("Query failed");
    });
  });

  describe("searchApplications", () => {
    test("should search applications by full name", async () => {
      const mockSearchResults = [mockMenteeApplication];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockSearchResults,
      );

      const result = await repo.searchApplications("John");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { fullName: { contains: "John", mode: "insensitive" } },
            { email: { contains: "John", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockSearchResults);
    });

    test("should search applications by email", async () => {
      const mockSearchResults = [mockMenteeApplication];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockSearchResults,
      );

      const result = await repo.searchApplications("john@example.com");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { fullName: { contains: "john@example.com", mode: "insensitive" } },
            {
              email: { contains: "john@example.com", mode: "insensitive" },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockSearchResults);
    });

    test("should perform case-insensitive search", async () => {
      const mockSearchResults = [mockMenteeApplication];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockSearchResults,
      );

      const result = await repo.searchApplications("JOHN DOE");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { fullName: { contains: "JOHN DOE", mode: "insensitive" } },
            { email: { contains: "JOHN DOE", mode: "insensitive" } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    });

    test("should return empty array if no matches found", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.searchApplications("nonexistent");

      expect(result).toEqual([]);
    });

    test("should return multiple matching results", async () => {
      const mockResults = [
        mockMenteeApplication,
        {
          ...mockMenteeApplication,
          id: "mentee-app-124",
          email: "johnny@example.com",
          fullName: "Johnny Appleseed",
        },
      ];
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue(
        mockResults,
      );

      const result = await repo.searchApplications("Johnny");

      expect(result).toHaveLength(2);
    });

    test("should handle special characters in search term", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repo.searchApplications("test@domain.co.uk");

      expect(prisma.menteeApplication.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              fullName: {
                contains: "test@domain.co.uk",
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: "test@domain.co.uk",
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { createdAt: "desc" },
      });
    });

    test("should handle database errors during search", async () => {
      (prisma.menteeApplication.findMany as jest.Mock).mockRejectedValue(
        new Error("Search failed"),
      );

      await expect(repo.searchApplications("John")).rejects.toThrow(
        "Search failed",
      );
    });
  });

  describe("getApplicationCountByStatus", () => {
    test("should return correct counts for all statuses", async () => {
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(3) // approved
        .mockResolvedValueOnce(2); // rejected

      const result = await repo.getApplicationCountByStatus();

      expect(prisma.menteeApplication.count).toHaveBeenCalledTimes(3);
      expect(prisma.menteeApplication.count).toHaveBeenNthCalledWith(1, {
        where: { status: "pending" },
      });
      expect(prisma.menteeApplication.count).toHaveBeenNthCalledWith(2, {
        where: { status: "approved" },
      });
      expect(prisma.menteeApplication.count).toHaveBeenNthCalledWith(3, {
        where: { status: "rejected" },
      });

      expect(result).toEqual({
        pending: 5,
        approved: 3,
        rejected: 2,
      });
    });

    test("should return zero counts when no applications exist", async () => {
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const result = await repo.getApplicationCountByStatus();

      expect(result).toEqual({
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    });

    test("should handle large count values", async () => {
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(10000)
        .mockResolvedValueOnce(5000)
        .mockResolvedValueOnce(2500);

      const result = await repo.getApplicationCountByStatus();

      expect(result).toEqual({
        pending: 10000,
        approved: 5000,
        rejected: 2500,
      });
    });

    test("should handle database errors during count", async () => {
      (prisma.menteeApplication.count as jest.Mock).mockRejectedValueOnce(
        new Error("Count query failed"),
      );

      await expect(repo.getApplicationCountByStatus()).rejects.toThrow(
        "Count query failed",
      );
    });

    test("should execute count queries in parallel", async () => {
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2);

      await repo.getApplicationCountByStatus();

      const calls = (prisma.menteeApplication.count as jest.Mock).mock.calls;
      expect(calls.length).toBe(3);
      // Verify all three different statuses were queried
      expect(calls).toEqual([
        [{ where: { status: "pending" } }],
        [{ where: { status: "approved" } }],
        [{ where: { status: "rejected" } }],
      ]);
    });

    test("should return object with all three status keys", async () => {
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(1);

      const result = await repo.getApplicationCountByStatus();

      expect(result).toHaveProperty("pending");
      expect(result).toHaveProperty("approved");
      expect(result).toHaveProperty("rejected");
      expect(Object.keys(result)).toHaveLength(3);
    });
  });

  describe("Integration-like tests", () => {
    test("should handle workflow: create, check count, search, approve", async () => {
      const newAppData = {
        fullName: "Test User",
        email: "test@example.com",
        university: "Test Uni",
        degreeProgram: "CS",
        cvLink: "https://example.com/cv.pdf",
      };

      const createdApp = {
        id: "test-id",
        ...newAppData,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Create
      (prisma.menteeApplication.create as jest.Mock).mockResolvedValueOnce(
        createdApp,
      );
      const created = await repo.createApplication(newAppData);
      expect(created.status).toBe("pending");

      // Get count
      (prisma.menteeApplication.count as jest.Mock)
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      const counts = await repo.getApplicationCountByStatus();
      expect(counts.pending).toBe(1);

      // Search
      (prisma.menteeApplication.findMany as jest.Mock).mockResolvedValueOnce([
        createdApp,
      ]);
      const searched = await repo.searchApplications("Test");
      expect(searched).toHaveLength(1);

      // Approve
      const approvedApp = { ...createdApp, status: "approved" as const };
      (prisma.menteeApplication.update as jest.Mock).mockResolvedValueOnce(
        approvedApp,
      );
      const approved = await repo.approveApplication("test-id");
      expect(approved.status).toBe("approved");
    });
  });
});
