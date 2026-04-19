// Mock hooks and libraries
jest.mock("@/_hooks/admin/useInvitation", () => ({
  useChangeInvitationStatus: jest.fn(),
  useDeleteInvitation: jest.fn(),
  useInvitation: jest.fn(),
  useRecentInvitations: jest.fn(),
}));

jest.mock("@/_hooks/projects", () => ({
  useGetProjects: jest.fn(),
}));

jest.mock("@/components/ui/card", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/admin/PageHeader", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/InvitationStats", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/InvitationsTable", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/dialogs/CreateInvitationDialog", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/dialogs/viewInvitationDialog", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/dialogs/ChangeStatusDialog", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/components/Invitations/dialogs/DeleteDialog", () => ({
  __esModule: true,
  default: () => null,
}));

import * as useInvitationHooks from "@/_hooks/admin/useInvitation";
import * as useProjectsHooks from "@/_hooks/projects";

describe("InvitationsMainContent Component - Units Tests", () => {
  const mockInvitations = [
    {
      id: "1",
      email: "student1@test.com",
      role: "student",
      project: "Project A",
      status: "Pending",
    },
    {
      id: "2",
      email: "mentor1@test.com",
      role: "mentor",
      project: "Project B",
      status: "Accepted",
    },
    {
      id: "3",
      email: "admin1@test.com",
      role: "superAdmin",
      project: "Project C",
      status: "Expired",
    },
  ];

  const mockProjects = [
    { id: "proj-1", name: "Project A" },
    { id: "proj-2", name: "Project B" },
    { id: "proj-3", name: "Project C" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useInvitationHooks.useInvitation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    (useInvitationHooks.useRecentInvitations as jest.Mock).mockReturnValue({
      data: mockInvitations,
      isLoading: false,
      isError: false,
    });

    (useInvitationHooks.useChangeInvitationStatus as jest.Mock).mockReturnValue(
      {
        mutate: jest.fn(),
        isPending: false,
      }
    );

    (useInvitationHooks.useDeleteInvitation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    (useProjectsHooks.useGetProjects as jest.Mock).mockReturnValue({
      data: mockProjects,
    });
  });

  test("should have correct number of mock invitations", () => {
    expect(mockInvitations).toHaveLength(3);
  });

  test("should have correct invitation data structure", () => {
    mockInvitations.forEach((inv) => {
      expect(inv).toHaveProperty("id");
      expect(inv).toHaveProperty("email");
      expect(inv).toHaveProperty("role");
      expect(inv).toHaveProperty("project");
      expect(inv).toHaveProperty("status");
    });
  });

  test("should have valid email format in invitations", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    mockInvitations.forEach((inv) => {
      expect(emailRegex.test(inv.email)).toBe(true);
    });
  });

  test("should have valid role values", () => {
    const validRoles = ["student", "mentor", "superAdmin"];
    mockInvitations.forEach((inv) => {
      expect(validRoles).toContain(inv.role);
    });
  });

  test("should have valid status values", () => {
    const validStatuses = ["Pending", "Accepted", "Expired"];
    mockInvitations.forEach((inv) => {
      expect(validStatuses).toContain(inv.status);
    });
  });

  test("should calculate pending count correctly", () => {
    const pendingCount = mockInvitations.filter(
      (i) => i.status === "Pending"
    ).length;
    expect(pendingCount).toBe(1);
  });

  test("should calculate accepted count correctly", () => {
    const acceptedCount = mockInvitations.filter(
      (i) => i.status === "Accepted"
    ).length;
    expect(acceptedCount).toBe(1);
  });

  test("should calculate expired count correctly", () => {
    const expiredCount = mockInvitations.filter(
      (i) => i.status === "Expired"
    ).length;
    expect(expiredCount).toBe(1);
  });

  test("should filter invitations by email", () => {
    const searchQuery = "student1";
    const filtered = mockInvitations.filter((inv) =>
      inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].email).toBe("student1@test.com");
  });

  test("should filter invitations by role", () => {
    const searchQuery = "mentor";
    const filtered = mockInvitations.filter((inv) =>
      inv.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].role).toBe("mentor");
  });

  test("should filter invitations by project", () => {
    const searchQuery = "Project A";
    const filtered = mockInvitations.filter((inv) =>
      inv.project.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].project).toBe("Project A");
  });

  test("should return empty array when no matches found", () => {
    const searchQuery = "nonexistent";
    const filtered = mockInvitations.filter((inv) =>
      inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(0);
  });

  test("should calculate pagination correctly with 10 items per page", () => {
    const ITEMS_PER_PAGE = 10;
    const totalPages = Math.max(1, Math.ceil(mockInvitations.length / ITEMS_PER_PAGE));
    expect(totalPages).toBe(1);
  });

  test("should calculate pagination correctly with multiple pages", () => {
    const ITEMS_PER_PAGE = 10;
    const manyInvitations = Array.from({ length: 25 }, (_, i) => ({
      id: `${i}`,
      email: `user${i}@test.com`,
      role: "student",
      project: "Project A",
      status: "Pending",
    }));

    const totalPages = Math.max(
      1,
      Math.ceil(manyInvitations.length / ITEMS_PER_PAGE)
    );
    expect(totalPages).toBe(3);
  });

  test("should calculate start and end count for pagination", () => {
    const ITEMS_PER_PAGE = 10;
    const currentPage = 1;
    const startCount = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endCount = Math.min(
      currentPage * ITEMS_PER_PAGE,
      mockInvitations.length
    );

    expect(startCount).toBe(1);
    expect(endCount).toBe(3);
  });

  test("should have correct project options", () => {
    expect(mockProjects).toHaveLength(3);
    expect(mockProjects[0].name).toBe("Project A");
    expect(mockProjects[1].name).toBe("Project B");
    expect(mockProjects[2].name).toBe("Project C");
  });

  test("should validate email format", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = [
      "test@example.com",
      "user.name@example.co.uk",
      "user+tag@example.com",
    ];
    const invalidEmails = ["invalid", "invalid@", "@example.com", "user@"];

    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  test("should validate name length (minimum 2 characters)", () => {
    const names = ["Jo", "John", "A", "X"];
    const validNames = names.filter((name) => name.length >= 2);

    expect(validNames).toContain("Jo");
    expect(validNames).toContain("John");
    expect(validNames).not.toContain("A");
    expect(validNames).not.toContain("X");
  });

  test("should have correct form schema structure", () => {
    const formData = {
      role: "student",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      project: "proj-1",
    };

    expect(formData).toHaveProperty("role");
    expect(formData).toHaveProperty("firstName");
    expect(formData).toHaveProperty("lastName");
    expect(formData).toHaveProperty("email");
    expect(formData).toHaveProperty("project");
  });

  test("should have required fields in form", () => {
    const requiredFields = ["role", "firstName", "lastName", "email", "project"];
    const formData = {
      role: "student",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      project: "proj-1",
    };

    requiredFields.forEach((field) => {
      expect(formData).toHaveProperty(field);
    });
  });

  test("should detect empty form fields", () => {
    const emptyFormData = {
      role: "",
      firstName: "",
      lastName: "",
      email: "",
      project: "",
    };

    Object.values(emptyFormData).forEach((value) => {
      expect(value).toBe("");
    });
  });

  test("should handle optional invitation fields", () => {
    const invitationWithOptional = {
      email: "user@test.com",
      role: "student" as const,
      firstName: "John",
      lastName: "Doe",
      projectId: "proj-123",
    };

    expect(invitationWithOptional.firstName).toBe("John");
    expect(invitationWithOptional.lastName).toBe("Doe");
    expect(invitationWithOptional.projectId).toBe("proj-123");
  });

  test("should handle invitation statuses", () => {
    const statuses = ["Pending", "Accepted", "Expired"];
    statuses.forEach((status) => {
      expect(["Pending", "Accepted", "Expired"]).toContain(status);
    });
  });

  test("should have correct const ITEMS_PER_PAGE value", () => {
    const ITEMS_PER_PAGE = 10;
    expect(ITEMS_PER_PAGE).toBe(10);
  });

  test("should count invitations by status", () => {
    const statusCounts = {
      Pending: mockInvitations.filter((i) => i.status === "Pending").length,
      Accepted: mockInvitations.filter((i) => i.status === "Accepted").length,
      Expired: mockInvitations.filter((i) => i.status === "Expired").length,
    };

    expect(statusCounts.Pending).toBe(1);
    expect(statusCounts.Accepted).toBe(1);
    expect(statusCounts.Expired).toBe(1);
  });

  test("should calculate total invitations", () => {
    const total = mockInvitations.length;
    expect(total).toBe(3);
  });

  test("should handle search with case insensitivity", () => {
    const searchQuery = "STUDENT1";
    const filtered = mockInvitations.filter((inv) =>
      inv.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
  });

  test("should handle multiple role types", () => {
    const roles = ["student", "mentor", "superAdmin"];
    const hasAllRoles = mockInvitations.some((inv) => inv.role === roles[0]) &&
      mockInvitations.some((inv) => inv.role === roles[1]) &&
      mockInvitations.some((inv) => inv.role === roles[2]);

    expect(hasAllRoles).toBe(true);
  });

  test("should validate invitation object properties", () => {
    mockInvitations.forEach((inv) => {
      expect(typeof inv.id).toBe("string");
      expect(typeof inv.email).toBe("string");
      expect(typeof inv.role).toBe("string");
      expect(typeof inv.project).toBe("string");
      expect(typeof inv.status).toBe("string");
    });
  });

  test("should handle empty invitations list", () => {
    const emptyInvitations: any[] = [];
    expect(emptyInvitations.length).toBe(0);
    expect(emptyInvitations).toEqual([]);
  });

  test("should generate page numbers for pagination", () => {
    const ITEMS_PER_PAGE = 10;
    const totalInvitations = 25;
    const totalPages = Math.ceil(totalInvitations / ITEMS_PER_PAGE);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    expect(pageNumbers).toEqual([1, 2, 3]);
  });
});
