import { BulkUploadTableRow, BulkUploadCellError } from "@/_stores/bulkUploadTableStore";

export const VALID_ROLES = ["mentor", "mentee"] as const;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type BulkUploadFieldMapping = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  project: string;
};

const defaultColumns = {
  email: "Email Address",
  firstName: "First Name",
  lastName: "Last Name",
  role: "Role Type",
};

const resolveColumnName = (
  mappingValue: string,
  fallback: string,
): string => {
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

    const roleValue = String(row[roleColumn] ?? "").trim().toLowerCase();
    if (!roleValue) {
      errors.push({
        row: rowIndex,
        column: roleColumn,
        message: "Role is required",
        value: roleValue,
      });
    } else if (!VALID_ROLES.includes(roleValue as (typeof VALID_ROLES)[number])) {
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
      const role = String(row[mapping.role] ?? "").trim().toLowerCase();
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

      if (!email || !role) return null;

      return {
        email,
        role: normalizedRole as "student" | "mentor" | "superAdmin",
        firstName: firstName || email.split("@")[0],
        lastName,
        projectId: projectId || undefined,
      };
    })
    .filter((invitation): invitation is NonNullable<typeof invitation> =>
      Boolean(invitation),
    );
};
