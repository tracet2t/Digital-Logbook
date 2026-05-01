"use client";

import React, { useEffect, useState } from "react";

import { useBulkSendInvitations } from "@/_hooks/admin/useBulkInvitation";
import { useBulkUpload } from "@/_hooks/useBulkUpload";

import { BulkUploadStep1 } from "./BulkUploadStep1";
import { BulkUploadStep2 } from "./BulkUploadStep2";
import { BulkUploadStep3 } from "./BulkUploadStep3";

type ValidationErrorRow = {
  row: number;
  email?: string;
  error: string;
  column: string;
};

type ValidationResult = {
  validInvitations: Array<{
    email: string;
    role: "student" | "mentor" | "superAdmin";
    firstName?: string;
    lastName?: string;
    projectId?: string;
  }>;
  invalidRows: ValidationErrorRow[];
  summary: { valid: number; invalid: number };
  messages: string[];
};

interface BulkUploadTabsProps {
  onBack?: () => void;
  onCancel?: () => void;
}

export function BulkUploadTabs({ onCancel }: BulkUploadTabsProps) {
  const {
    currentStep,
    uploadedFile,
    excelData,
    fileInfo,
    fieldMapping,
    previewData,
    isLoading,
    error,
    missingRequiredColumns,
    handleFileUpload,
    handleFieldMapping,
    goToStep,
    getExcelColumns,
    resetUpload,
  } = useBulkUpload();

  const {
    sendBulkInvitations,
    isLoading: isSending,
    progress,
  } = useBulkSendInvitations();
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(
    null,
  );
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    setHasValidated(false);
    setValidationResult(null);
  }, [excelData, fieldMapping]);

  const handleFileUploadAndAdvance = async (file: File) => {
    await handleFileUpload(file);
    goToStep(2);
  };

  const handleBackToUpload = () => {
    goToStep(1);
  };

  const buildAndValidateInvitations = (
    rows: Record<string, any>[],
    mapping: typeof fieldMapping,
  ): ValidationResult => {
    const validInvitations: ValidationResult["validInvitations"] = [];
    const invalidRows: ValidationErrorRow[] = [];
    const messages: string[] = [];
    const allowedRoles = ["student", "mentor", "superAdmin", "mentee"] as const;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    rows.forEach((row, index) => {
      const rawEmail = row[mapping.email];
      const rawRole = row[mapping.role];
      const rawFirstName =
        mapping.firstName && mapping.firstName !== "none"
          ? row[mapping.firstName]
          : "";
      const rawLastName =
        mapping.lastName && mapping.lastName !== "none"
          ? row[mapping.lastName]
          : "";
      const rawProjectId =
        mapping.project && mapping.project !== "none"
          ? row[mapping.project]
          : undefined;

      const email = rawEmail?.toString().trim() || "";
      const role = rawRole?.toString().trim().toLowerCase() || "";
      const normalizedRole = role === "mentee" ? "student" : role;
      const firstName = rawFirstName?.toString().trim() || "";
      const lastName = rawLastName?.toString().trim() || "";
      const projectId = rawProjectId?.toString().trim() || "";

      const errors: string[] = [];
      const errorColumns = new Set<string>();
      if (!email && !role) {
        errors.push("Missing email and role");
        errorColumns.add("Email Address");
        errorColumns.add("Role Type");
      } else {
        if (!email) {
          errors.push("Missing email");
          errorColumns.add("Email Address");
        }
        if (email && !emailRegex.test(email)) {
          errors.push("Invalid email format");
          errorColumns.add("Email Address");
        }
        if (!role) {
          errors.push("Missing role");
          errorColumns.add("Role Type");
        }
        if (
          role &&
          !allowedRoles.includes(role as (typeof allowedRoles)[number])
        ) {
          errors.push("Invalid role");
          errorColumns.add("Role Type");
        }
      }

      if (errors.length > 0) {
        invalidRows.push({
          row: index + 1,
          email: email || undefined,
          error: errors.join("; "),
          column: Array.from(errorColumns).join(", ") || "-",
        });
        return;
      }

      validInvitations.push({
        email,
        role: normalizedRole as "student" | "mentor" | "superAdmin",
        firstName: firstName || email.split("@")[0],
        lastName,
        projectId: projectId || undefined,
      });
    });

    return {
      validInvitations,
      invalidRows,
      summary: { valid: validInvitations.length, invalid: invalidRows.length },
      messages,
    };
  };

  const handleSubmit = async () => {
    const missingMappings: string[] = [];
    if (!fieldMapping.email || fieldMapping.email === "none") {
      missingMappings.push("Email Address");
    }
    if (!fieldMapping.role || fieldMapping.role === "none") {
      missingMappings.push("Role Type");
    }

    if (!hasValidated) {
      const result = buildAndValidateInvitations(excelData, fieldMapping);
      if (missingRequiredColumns.length > 0) {
        result.messages.push(
          `Missing required columns: ${missingRequiredColumns.join(", ")}.`,
        );
      }
      if (missingMappings.length > 0) {
        result.messages.push(
          `Map the required fields: ${missingMappings.join(", ")}.`,
        );
      }
      setValidationResult(result);
      setHasValidated(true);
      return;
    }

    if (
      !validationResult ||
      validationResult.validInvitations.length === 0 ||
      missingRequiredColumns.length > 0 ||
      missingMappings.length > 0
    ) {
      const result = buildAndValidateInvitations(excelData, fieldMapping);
      if (missingRequiredColumns.length > 0) {
        result.messages.push(
          `Missing required columns: ${missingRequiredColumns.join(", ")}.`,
        );
      }
      if (missingMappings.length > 0) {
        result.messages.push(
          `Map the required fields: ${missingMappings.join(", ")}.`,
        );
      }
      setValidationResult(result);
      setHasValidated(true);
      return;
    }

    await sendBulkInvitations(validationResult.validInvitations, (res) => {
      setSubmissionResult(res);
      if (res.success > 0) {
        goToStep(3);
      }
    });
  };

  const handleNewUpload = () => {
    resetUpload();
    setSubmissionResult(null);
  };

  return (
    <div className="w-full">
      {currentStep === 1 ? (
        <BulkUploadStep1
          onFileUpload={handleFileUploadAndAdvance}
          uploadedFile={uploadedFile}
          error={error}
          isLoading={isLoading}
        />
      ) : currentStep === 2 ? (
        <BulkUploadStep2
          fileInfo={fileInfo}
          excelColumns={getExcelColumns()}
          fieldMapping={fieldMapping}
          onFieldMappingChange={handleFieldMapping}
          previewData={previewData}
          onBack={handleBackToUpload}
          onCancel={onCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSending}
          progress={progress}
          validationResult={validationResult}
          hasValidated={hasValidated}
          missingRequiredColumns={missingRequiredColumns}
        />
      ) : (
        <BulkUploadStep3
          result={submissionResult}
          onNewUpload={handleNewUpload}
          onClose={onCancel}
        />
      )}
    </div>
  );
}
