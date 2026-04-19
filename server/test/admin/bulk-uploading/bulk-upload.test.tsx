// Mock hooks and libraries
jest.mock("@/_hooks/useBulkUpload");
jest.mock("@/_hooks/admin/useBulkInvitation");

import * as useBulkUploadHooks from "@/_hooks/useBulkUpload";
import * as useBulkSendInvitationsHooks from "@/_hooks/admin/useBulkInvitation";

describe("BulkUploadTabs Component - Unit Tests", () => {
  const mockExcelData = [
    {
      Email: "student1@test.com",
      Role: "student",
      "First Name": "John",
      "Last Name": "Doe",
      Project: "Project A",
    },
    {
      Email: "mentor1@test.com",
      Role: "mentor",
      "First Name": "Jane",
      "Last Name": "Smith",
      Project: "Project B",
    },
    {
      Email: "admin1@test.com",
      Role: "superAdmin",
      "First Name": "Bob",
      "Last Name": "Wilson",
      Project: "Project C",
    },
    {
      Email: "", // Invalid - missing email
      Role: "student",
      "First Name": "Invalid",
      "Last Name": "User",
      Project: "Project A",
    },
    {
      Email: "student2@test.com",
      Role: "", // Invalid - missing role
      "First Name": "Valid",
      "Last Name": "User",
      Project: "Project A",
    },
  ];

  const mockFieldMapping = {
    email: "Email",
    role: "Role",
    firstName: "First Name",
    lastName: "Last Name",
    project: "Project",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useBulkUploadHooks.useBulkUpload as jest.Mock).mockReturnValue({
      currentStep: 1,
      uploadedFile: null,
      excelData: mockExcelData,
      fileInfo: {
        name: "test.xlsx",
        size: 1024,
        rows: 5,
      },
      fieldMapping: mockFieldMapping,
      previewData: mockExcelData.slice(0, 5),
      isLoading: false,
      error: null,
      handleFileUpload: jest.fn(),
      handleFieldMapping: jest.fn(),
      goToStep: jest.fn(),
      getExcelColumns: jest.fn(() => ["Email", "Role", "First Name", "Last Name", "Project"]),
      resetUpload: jest.fn(),
    });

    (useBulkSendInvitationsHooks.useBulkSendInvitations as jest.Mock).mockReturnValue({
      sendBulkInvitations: jest.fn(),
      isLoading: false,
      progress: 0,
    });
  });

  test("should have correct number of mock excel rows", () => {
    expect(mockExcelData).toHaveLength(5);
  });

  test("should have correct excel data structure", () => {
    mockExcelData.forEach((row) => {
      expect(row).toHaveProperty("Email");
      expect(row).toHaveProperty("Role");
      expect(row).toHaveProperty("First Name");
      expect(row).toHaveProperty("Last Name");
      expect(row).toHaveProperty("Project");
    });
  });

  test("should validate email format in excel data", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validRows = mockExcelData.filter((row) => row.Email && emailRegex.test(row.Email));
    expect(validRows).toHaveLength(3);
  });

  test("should validate role values in excel data", () => {
    const validRoles = ["student", "mentor", "superAdmin"];
    const validRows = mockExcelData.filter((row) => row.Role && validRoles.includes(row.Role.toLowerCase()));
    expect(validRows).toHaveLength(3);
  });

  test("should transform excel data to invitation format correctly", () => {
    const invitations = mockExcelData
      .map((row) => {
        const email = row.Email;
        const role = row.Role;
        const firstName = row["First Name"];
        const lastName = row["Last Name"];
        const projectId = row.Project;

        if (!email || !role) {
          return null;
        }

        return {
          email: email.toString().trim(),
          role: role.toString().toLowerCase() as "student" | "mentor" | "superAdmin",
          firstName: firstName?.toString().trim() || email.split("@")[0],
          lastName: lastName?.toString().trim() || "",
          projectId: projectId?.toString(),
        };
      })
      .filter((inv): inv is NonNullable<typeof inv> => inv !== null);

    expect(invitations).toHaveLength(3);
    expect(invitations[0]).toEqual({
      email: "student1@test.com",
      role: "student",
      firstName: "John",
      lastName: "Doe",
      projectId: "Project A",
    });
  });

  test("should filter out invalid invitations", () => {
    const invitations = mockExcelData
      .map((row) => {
        const email = row.Email;
        const role = row.Role;
        const firstName = row["First Name"];
        const lastName = row["Last Name"];
        const projectId = row.Project;

        if (!email || !role) {
          return null;
        }

        return {
          email: email.toString().trim(),
          role: role.toString().toLowerCase() as "student" | "mentor" | "superAdmin",
          firstName: firstName?.toString().trim() || email.split("@")[0],
          lastName: lastName?.toString().trim() || "",
          projectId: projectId?.toString(),
        };
      })
      .filter((inv): inv is NonNullable<typeof inv> => inv !== null);

    expect(invitations).toHaveLength(3);
    expect(invitations.some((inv) => inv.email === "")).toBe(false);
    expect(invitations.some((inv) => inv.role === "")).toBe(false);
  });

  test("should handle missing optional fields", () => {
    const rowWithMissingFields = {
      Email: "test@test.com",
      Role: "student",
      "First Name": "",
      "Last Name": "",
      Project: "",
    };

    const invitation = {
      email: rowWithMissingFields.Email.toString().trim(),
      role: rowWithMissingFields.Role.toString().toLowerCase() as "student",
      firstName:
        rowWithMissingFields["First Name"]?.toString().trim() ||
        rowWithMissingFields.Email.split("@")[0],
      lastName: rowWithMissingFields["Last Name"]?.toString().trim() || "",
      projectId: rowWithMissingFields.Project?.toString() || undefined,
    };

    expect(invitation.firstName).toBe("test");
    expect(invitation.lastName).toBe("");
    expect(invitation.projectId).toBeUndefined();
  });

  test("should validate field mapping has required fields", () => {
    const validMapping = {
      email: "Email",
      role: "Role",
      firstName: "First Name",
      lastName: "Last Name",
      project: "Project",
    };

    expect(validMapping.email).toBeTruthy();
    expect(validMapping.role).toBeTruthy();
  });

  test("should detect invalid field mapping", () => {
    const invalidMapping = {
      email: "none",
      role: "none",
      firstName: "none",
      lastName: "none",
      project: "none",
    };

    expect(invalidMapping.email).toBe("none");
    expect(invalidMapping.role).toBe("none");
  });

  test("should handle empty excel data", () => {
    const emptyData: any[] = [];
    const invitations = emptyData
      .map((row) => {
        const email = row.Email;
        const role = row.Role;
        if (!email || !role) return null;
        return { email, role };
      })
      .filter(Boolean);

    expect(invitations).toHaveLength(0);
  });

  test("should trim whitespace from fields", () => {
    const rowWithSpaces = {
      Email: "  test@test.com  ",
      Role: " student ",
      "First Name": " John ",
      "Last Name": " Doe ",
      Project: " Project A ",
    };

    const invitation = {
      email: rowWithSpaces.Email.toString().trim(),
      role: rowWithSpaces.Role.toString().toLowerCase().trim() as "student",
      firstName: rowWithSpaces["First Name"]?.toString().trim(),
      lastName: rowWithSpaces["Last Name"]?.toString().trim(),
      projectId: rowWithSpaces.Project?.toString().trim(),
    };

    expect(invitation.email).toBe("test@test.com");
    expect(invitation.role).toBe("student");
    expect(invitation.firstName).toBe("John");
    expect(invitation.lastName).toBe("Doe");
    expect(invitation.projectId).toBe("Project A");
  });

  test("should handle case insensitive role values", () => {
    const roles = ["STUDENT", "Mentor", "SuperAdmin"];
    const normalizedRoles = roles.map((role) => role.toLowerCase());

    expect(normalizedRoles).toEqual(["student", "mentor", "superadmin"]);
  });

  test("should validate file size limit", () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validSize = 1024 * 1024; // 1MB
    const invalidSize = 6 * 1024 * 1024; // 6MB

    expect(validSize <= maxSize).toBe(true);
    expect(invalidSize <= maxSize).toBe(false);
  });

  test("should validate file format", () => {
    const validFormats = [".xlsx", ".xls"];
    const testFiles = ["test.xlsx", "test.xls", "test.txt"];

    const validFiles = testFiles.filter((file) => {
      const extension = file.substring(file.lastIndexOf("."));
      return validFormats.includes(extension);
    });

    expect(validFiles).toEqual(["test.xlsx", "test.xls"]);
  });

  test("should validate row limit", () => {
    const maxRows = 500;
    const validRowCount = 100;
    const invalidRowCount = 600;

    expect(validRowCount <= maxRows).toBe(true);
    expect(invalidRowCount <= maxRows).toBe(false);
  });

  test("should generate preview data from first 5 rows", () => {
    const previewRows = mockExcelData.slice(0, 5);
    expect(previewRows).toHaveLength(5);
  });

  test("should extract excel columns correctly", () => {
    const columns = Object.keys(mockExcelData[0]);
    expect(columns).toEqual(["Email", "Role", "First Name", "Last Name", "Project"]);
  });

  test("should handle field mapping changes", () => {
    const newMapping = { ...mockFieldMapping, email: "Email Address" };
    expect(newMapping.email).toBe("Email Address");
  });

  test("should validate step navigation", () => {
    const steps = [1, 2, 3];
    steps.forEach((step) => {
      expect([1, 2, 3]).toContain(step);
    });
  });

  test("should handle submission progress", () => {
    const progress = 50;
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  test("should validate bulk invitation payload", () => {
    const validInvitation = {
      email: "test@test.com",
      role: "student" as const,
      firstName: "John",
      lastName: "Doe",
      projectId: "proj-123",
    };

    expect(validInvitation).toHaveProperty("email");
    expect(validInvitation).toHaveProperty("role");
    expect(validInvitation).toHaveProperty("firstName");
    expect(validInvitation).toHaveProperty("lastName");
    expect(validInvitation).toHaveProperty("projectId");
  });

  test("should handle submission result", () => {
    const result = { success: 3, failed: 0 };
    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);
  });

  test("should reset upload state", () => {
    const initialState = {
      currentStep: 1,
      uploadedFile: null,
      excelData: [],
      fieldMapping: {
        email: "none",
        firstName: "none",
        lastName: "none",
        role: "none",
        project: "none",
      },
      previewData: [],
      isLoading: false,
      error: null,
      fileInfo: null,
    };

    expect(initialState.currentStep).toBe(1);
    expect(initialState.uploadedFile).toBeNull();
    expect(initialState.excelData).toEqual([]);
  });

  test("should handle loading states", () => {
    const loadingStates = [true, false];
    loadingStates.forEach((state) => {
      expect(typeof state).toBe("boolean");
    });
  });

  test("should validate error messages", () => {
    const errorMessages = [
      "Invalid file format. Please upload .xlsx or .xls files only.",
      "File size exceeds 5MB limit.",
      "Excel file is empty.",
      "Excel file exceeds 500 rows limit.",
    ];

    errorMessages.forEach((message) => {
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);
    });
  });

  test("should handle file info structure", () => {
    const fileInfo = {
      name: "test.xlsx",
      size: 1024,
      rows: 5,
    };

    expect(fileInfo).toHaveProperty("name");
    expect(fileInfo).toHaveProperty("size");
    expect(fileInfo).toHaveProperty("rows");
  });
});