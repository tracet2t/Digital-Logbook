/** @jest-environment node */

jest.mock("../../src/repositories/onboarding_repository_impl", () => ({
  __esModule: true,
  __repo: {
    findByEmail: jest.fn(),
    createApplication: jest.fn(),
    getApplicationCountByStatus: jest.fn(),
    getApplicationById: jest.fn(),
    findByStatus: jest.fn(),
    searchApplications: jest.fn(),
    getApplicationsByDateRange: jest.fn(),
    getAll: jest.fn(),
    updateStatus: jest.fn(),
  },
  OnboardingRepository: jest.fn(function OnboardingRepositoryMock(
    this: unknown,
  ) {
    return (jest.requireMock("../../src/repositories/onboarding_repository_impl") as {
      __repo: {
        findByEmail: jest.Mock;
        createApplication: jest.Mock;
        getApplicationCountByStatus: jest.Mock;
        getApplicationById: jest.Mock;
        findByStatus: jest.Mock;
        searchApplications: jest.Mock;
        getApplicationsByDateRange: jest.Mock;
        getAll: jest.Mock;
        updateStatus: jest.Mock;
      };
    }).__repo;
  }),
}));

jest.mock("../../src/server_actions/getSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { Role } from "@prisma/client";
import getSession from "../../src/server_actions/getSession";
import * as onboardingRepoModule from "../../src/repositories/onboarding_repository_impl";
import { GET, PATCH, POST } from "../../src/app/api/onboarding/route";

describe("/api/onboarding route", () => {
  const mockOnboardingRepository = (onboardingRepoModule as unknown as {
    __repo: {
      findByEmail: jest.Mock;
      createApplication: jest.Mock;
      getApplicationCountByStatus: jest.Mock;
      getApplicationById: jest.Mock;
      findByStatus: jest.Mock;
      searchApplications: jest.Mock;
      getApplicationsByDateRange: jest.Mock;
      getAll: jest.Mock;
      updateStatus: jest.Mock;
    };
  }).__repo;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST returns 400 when required fields are missing", async () => {
    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "POST",
      body: JSON.stringify({ fullName: "John" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req as any);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      message:
        "fullName, email, university, degreeProgram, and cvLink are required",
    });
  });

  test("POST returns 409 when application email already exists", async () => {
    mockOnboardingRepository.findByEmail.mockResolvedValue({ id: "app-1" });

    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        email: "JOHN@EXAMPLE.COM",
        university: "MIT",
        degreeProgram: "Computer Science",
        cvLink: "https://example.com/cv.pdf",
      }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req as any);

    expect(mockOnboardingRepository.findByEmail).toHaveBeenCalledWith(
      "john@example.com",
    );
    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toEqual({
      message: "An application with this email already exists",
    });
  });

  test("POST returns 201 for valid payload", async () => {
    mockOnboardingRepository.findByEmail.mockResolvedValue(null);
    mockOnboardingRepository.createApplication.mockResolvedValue({
      id: "app-1",
      fullName: "John Doe",
      email: "john@example.com",
      university: "MIT",
      degreeProgram: "Computer Science",
      cvLink: "https://example.com/cv.pdf",
      status: "pending",
    });

    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "POST",
      body: JSON.stringify({
        fullName: "John Doe",
        email: "john@example.com",
        university: "MIT",
        degreeProgram: "Computer Science",
        cvLink: "https://example.com/cv.pdf",
      }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req as any);

    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toEqual({
      message: "Application submitted successfully",
      application: expect.objectContaining({ id: "app-1" }),
    });
  });

  test("GET returns summary when summary=true", async () => {
    mockOnboardingRepository.getApplicationCountByStatus.mockResolvedValue({
      pending: 2,
      approved: 1,
      rejected: 0,
    });

    const req = new Request(
      "http://localhost:3000/api/onboarding?summary=true",
      { method: "GET" },
    );

    const res = await GET(req as any);

    expect(mockOnboardingRepository.getApplicationCountByStatus).toHaveBeenCalled();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      counts: { pending: 2, approved: 1, rejected: 0 },
    });
  });

  test("GET returns 400 for invalid status filter", async () => {
    const req = new Request(
      "http://localhost:3000/api/onboarding?status=unknown",
      { method: "GET" },
    );

    const res = await GET(req as any);

    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({
      message: "Invalid status. Use pending, approved, or rejected",
    });
  });

  test("PATCH returns 401 when no session", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);

    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "PATCH",
      body: JSON.stringify({ id: "app-1", status: "approved" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PATCH(req as any);

    expect(res.status).toBe(401);
    await expect(res.json()).resolves.toEqual({ message: "Unauthorized" });
  });

  test("PATCH returns 403 when role is not superAdmin", async () => {
    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getRole: () => Role.mentor,
    });

    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "PATCH",
      body: JSON.stringify({ id: "app-1", status: "approved" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PATCH(req as any);

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ message: "Forbidden" });
  });

  test("PATCH updates status for superAdmin", async () => {
    (getSession as jest.Mock).mockResolvedValue({
      isAuthenticated: () => true,
      getRole: () => Role.superAdmin,
    });

    mockOnboardingRepository.getApplicationById.mockResolvedValue({ id: "app-1" });
    mockOnboardingRepository.updateStatus.mockResolvedValue({
      id: "app-1",
      status: "approved",
    });

    const req = new Request("http://localhost:3000/api/onboarding", {
      method: "PATCH",
      body: JSON.stringify({ id: "app-1", status: "approved" }),
      headers: { "content-type": "application/json" },
    });

    const res = await PATCH(req as any);

    expect(mockOnboardingRepository.getApplicationById).toHaveBeenCalledWith("app-1");
    expect(mockOnboardingRepository.updateStatus).toHaveBeenCalledWith(
      "app-1",
      "approved",
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      message: "Application status updated successfully",
      application: { id: "app-1", status: "approved" },
    });
  });
});
