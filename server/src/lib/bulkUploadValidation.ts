import {
  BulkUploadCellError,
  BulkUploadTableRow,
} from "@/_stores/bulkUploadTableStore";

export const VALID_ROLES = ["mentor", "mentee"] as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BulkUploadFieldMapping = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  project: string;
};

export interface Project {
  id: string;
  name: string;
}

const defaultColumns = {
  email: "Email Address",
  firstName: "First Name",
  lastName: "Last Name",
  role: "Role Type",
};

const resolveColumnName = (mappingValue: string, fallback: string): string => {
  if (!mappingValue || mappingValue === "none") return fallback;
  return mappingValue;
};

export const validateBulkUploadRows = (
  rows: BulkUploadTableRow[],
  mapping: BulkUploadFieldMapping,
): BulkUploadCellError[] => {
  const errors: BulkUploadCellError[] = [];

  rows.forEach((row, rowIndex) => {
    const emailColumn = resolveColumnName(mapping.email, defaultColumns.email);
    const roleColumn = resolveColumnName(mapping.role, defaultColumns.role);
    const firstNameColumn = resolveColumnName(
      mapping.firstName,
      defaultColumns.firstName,
    );
    const lastNameColumn = resolveColumnName(
      mapping.lastName,
      defaultColumns.lastName,
    );
    const projectColumn =
      mapping.project && mapping.project !== "none"
        ? mapping.project
        : "Project";

    const emailValue = String(row[emailColumn] ?? "").trim();
    if (!emailValue) {
      errors.push({
        row: rowIndex,
        column: emailColumn,
        message: "Email is required",
        value: emailValue,
      });
    } else if (!emailRegex.test(emailValue)) {
      errors.push({
        row: rowIndex,
        column: emailColumn,
        message: "Invalid email format",
        value: emailValue,
      });
    }

    const roleValue = String(row[roleColumn] ?? "")
      .trim()
      .toLowerCase();
    if (!roleValue) {
      errors.push({
        row: rowIndex,
        column: roleColumn,
        message: "Role is required",
        value: roleValue,
      });
    } else if (
      !VALID_ROLES.includes(roleValue as (typeof VALID_ROLES)[number])
    ) {
      errors.push({
        row: rowIndex,
        column: roleColumn,
        message: "Invalid role",
        value: roleValue,
      });
    }

    const firstNameValue = String(row[firstNameColumn] ?? "").trim();
    if (!firstNameValue) {
      errors.push({
        row: rowIndex,
        column: firstNameColumn,
        message: "First name is required",
        value: firstNameValue,
      });
    }

    const lastNameValue = String(row[lastNameColumn] ?? "").trim();
    if (!lastNameValue) {
      errors.push({
        row: rowIndex,
        column: lastNameColumn,
        message: "Last name is required",
        value: lastNameValue,
      });
    }

    const projectValue = String(row[projectColumn] ?? "").trim();
    if (!projectValue) {
      errors.push({
        row: rowIndex,
        column: projectColumn,
        message: "Project ID is required",
        value: projectValue,
      });
    }
  });

  return errors;
};

export const buildInvitationsFromRows = (
  rows: BulkUploadTableRow[],
  mapping: BulkUploadFieldMapping,
) => {
  return rows
    .map((row) => {
      if (!mapping.email || mapping.email === "none") return null;
      if (!mapping.role || mapping.role === "none") return null;

      const email = String(row[mapping.email] ?? "").trim();
      const role = String(row[mapping.role] ?? "")
        .trim()
        .toLowerCase();
      const normalizedRole = role === "mentee" ? "student" : role;
      const firstName =
        mapping.firstName && mapping.firstName !== "none"
          ? String(row[mapping.firstName] ?? "").trim()
          : "";
      const lastName =
        mapping.lastName && mapping.lastName !== "none"
          ? String(row[mapping.lastName] ?? "").trim()
          : "";
      const projectId =
        mapping.project && mapping.project !== "none"
          ? String(row[mapping.project] ?? "").trim()
          : "";

      if (!email || !role || !projectId) return null;

      return {
        email,
        role: normalizedRole as "student" | "mentor" | "superAdmin",
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "User",
        projectId,
      };
    })
    .filter((invitation): invitation is NonNullable<typeof invitation> =>
      Boolean(invitation),
    );
};

// ─── Project Validation ───────────────────────────────────────────────────────

export const validateProjectExistence = (
  rows: BulkUploadTableRow[],
  mapping: BulkUploadFieldMapping,
  availableProjects: Project[],
): BulkUploadCellError[] => {
  const errors: BulkUploadCellError[] = [];

  if (!mapping.project || mapping.project === "none") {
    return errors;
  }

  const projectColumn = mapping.project;
  const projectNames = new Set(
    availableProjects.map((p) => p.name.toLowerCase()),
  );
  const projectIds = new Set(availableProjects.map((p) => p.id.toLowerCase()));

  rows.forEach((row, rowIndex) => {
    const projectValue = String(row[projectColumn] ?? "").trim();

    if (projectValue) {
      const valueLower = projectValue.toLowerCase();
      // Check if it's a valid UUID
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          projectValue,
        );

      // If it's a UUID, check if it exists in project IDs
      // If it's a name, check if it exists in project names
      const exists = isUuid
        ? projectIds.has(valueLower)
        : projectNames.has(valueLower);

      if (!exists) {
        errors.push({
          row: rowIndex,
          column: projectColumn,
          message: `Project "${projectValue}" not found. Create the project first.`,
          value: projectValue,
        });
      }
    }
  });

  return errors;
};
