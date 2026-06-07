import {
  BulkUploadCellError,
  BulkUploadTableRow,
} from "@/_stores/bulkUploadTableStore";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  projectSchema,
  roleSchema,
  VALID_ROLES,
} from "@/schemas/bulkUploadRow.schema";

export { VALID_ROLES };

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

// ─── Zod-based Validation ──────────────────────────────────────────────────────

export const validateBulkUploadRows = (
  rows: BulkUploadTableRow[],
  mapping: BulkUploadFieldMapping,
): BulkUploadCellError[] => {
  const errors: BulkUploadCellError[] = [];

  const emailColumn = resolveColumnName(mapping.email, defaultColumns.email);

  // Detect duplicate emails across all rows
  const emailRowMap = new Map<string, number[]>();
  rows.forEach((row, rowIndex) => {
    const emailValue = String(row[emailColumn] ?? "")
      .trim()
      .toLowerCase();
    if (emailValue) {
      const existing = emailRowMap.get(emailValue) ?? [];
      emailRowMap.set(emailValue, [...existing, rowIndex]);
    }
  });
  const duplicateEmails = new Set(
    [...emailRowMap.entries()]
      .filter(([, indices]) => indices.length > 1)
      .map(([email]) => email),
  );

  rows.forEach((row, rowIndex) => {
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

    // Validate email with Zod
    const emailValue = String(row[emailColumn] ?? "").trim();
    const emailResult = emailSchema.safeParse(emailValue);
    if (!emailResult.success) {
      errors.push({
        row: rowIndex,
        column: emailColumn,
        message: emailResult.error.errors[0]?.message || "Invalid email",
        value: emailValue,
      });
    } else if (duplicateEmails.has(emailValue.toLowerCase())) {
      errors.push({
        row: rowIndex,
        column: emailColumn,
        message: "Duplicate email address",
        value: emailValue,
      });
    }

    // Validate role with Zod
    const roleValue = String(row[roleColumn] ?? "")
      .trim()
      .toLowerCase();
    const roleResult = roleSchema.safeParse(roleValue);
    if (!roleResult.success) {
      errors.push({
        row: rowIndex,
        column: roleColumn,
        message:
          roleResult.error.errors[0]?.message ||
          "Role must be 'mentor' or 'mentee'",
        value: roleValue,
      });
    }

    // Validate first name with Zod
    const firstNameValue = String(row[firstNameColumn] ?? "").trim();
    const firstNameResult = firstNameSchema.safeParse(firstNameValue);
    if (!firstNameResult.success) {
      errors.push({
        row: rowIndex,
        column: firstNameColumn,
        message:
          firstNameResult.error.errors[0]?.message || "First name is required",
        value: firstNameValue,
      });
    }

    // Validate last name with Zod
    const lastNameValue = String(row[lastNameColumn] ?? "").trim();
    const lastNameResult = lastNameSchema.safeParse(lastNameValue);
    if (!lastNameResult.success) {
      errors.push({
        row: rowIndex,
        column: lastNameColumn,
        message:
          lastNameResult.error.errors[0]?.message || "Last name is required",
        value: lastNameValue,
      });
    }

    // Validate project with Zod (basic presence check only)
    const projectValue = String(row[projectColumn] ?? "").trim();
    const projectResult = projectSchema.safeParse(projectValue);
    if (!projectResult.success) {
      errors.push({
        row: rowIndex,
        column: projectColumn,
        message:
          projectResult.error.errors[0]?.message || "Project is required",
        value: projectValue,
      });
    }
  });

  return errors;
};

// ─── Build Invitations ─────────────────────────────────────────────────────────

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

// ─── Project Validation (Database Check) ───────────────────────────────────────

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
