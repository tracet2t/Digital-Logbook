"use client";

import React, { useState } from "react";

import { useBulkSendInvitations } from "@/_hooks/admin/useBulkInvitation";
import { useBulkUpload } from "@/_hooks/useBulkUpload";

import { BulkUploadStep1 } from "./BulkUploadStep1";
import { BulkUploadStep2 } from "./BulkUploadStep2";
import { BulkUploadStep3 } from "./BulkUploadStep3";

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

  const handlePreviewValidate = () => {
    goToStep(2);
  };

  const handleBackToUpload = () => {
    goToStep(1);
  };

  const handleSubmit = async () => {
    // Validate field mapping
    if (
      !fieldMapping.email ||
      fieldMapping.email === "none" ||
      !fieldMapping.role ||
      fieldMapping.role === "none"
    ) {
      alert("Please map the required fields: Email and Role");
      return;
    }

    // Transform Excel data to invitation format
    const invitations = excelData
      .map((row, index) => {
        const email = row[fieldMapping.email];
        const role = row[fieldMapping.role];
        const firstName =
          fieldMapping.firstName && fieldMapping.firstName !== "none"
            ? row[fieldMapping.firstName]
            : "";
        const lastName =
          fieldMapping.lastName && fieldMapping.lastName !== "none"
            ? row[fieldMapping.lastName]
            : "";
        const projectId =
          fieldMapping.project && fieldMapping.project !== "none"
            ? row[fieldMapping.project]
            : undefined;

        // Validate required fields
        if (!email || !role) {
          console.warn(`Row ${index + 1}: Missing required fields`);
          return null;
        }

        return {
          email: email.toString().trim(),
          role: role.toString().toLowerCase() as
            | "student"
            | "mentor"
            | "superAdmin",
          firstName: firstName?.toString().trim() || email.split("@")[0], // Fallback to email username
          lastName: lastName?.toString().trim() || "",
          projectId: projectId?.toString(),
        };
      })
      .filter((inv): inv is NonNullable<typeof inv> => inv !== null);

    if (invitations.length === 0) {
      alert("No valid invitations to send");
      return;
    }

    // Send bulk invitations
    await sendBulkInvitations(invitations, (res) => {
      setSubmissionResult(res);
      if (res.success > 0) {
        goToStep(3); // Show results step
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
          onFileUpload={handleFileUpload}
          onNext={handlePreviewValidate}
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
