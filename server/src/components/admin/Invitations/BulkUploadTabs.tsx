"use client";

import React, { useState } from "react";

import { useBulkSendInvitations } from "@/_hooks/admin/useBulkInvitation";
import { useGetAllProjects } from "@/_hooks/admin/useProject";
import { useBulkUpload } from "@/_hooks/useBulkUpload";
import { useBulkUploadTableStore } from "@/_stores/bulkUploadTableStore";

import {
  buildInvitationsFromRows,
  validateBulkUploadRows,
  validateProjectExistence,
} from "@/lib/bulkUploadValidation";

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
    fileInfo,
    fieldMapping,
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
    cancelBulkSend,
  } = useBulkSendInvitations();
  const { data: projects = [], isLoading: isLoadingProjects } =
    useGetAllProjects();
  const { data, cellErrors, setCellErrors } = useBulkUploadTableStore();
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const handleFieldMappingAndValidate = (
    field: "email" | "firstName" | "lastName" | "role" | "project",
    column: string,
  ) => {
    const nextMapping = { ...fieldMapping, [field]: column };
    handleFieldMapping(field, column);
    if (data.length > 0) {
      // Combine field validation and project validation
      const fieldErrors = validateBulkUploadRows(data, nextMapping);
      const projectErrors = validateProjectExistence(
        data,
        nextMapping,
        projects,
      );
      setCellErrors([...fieldErrors, ...projectErrors]);
    }
  };

  const handleFileUploadAndAdvance = async (file: File) => {
    await handleFileUpload(file);
    goToStep(2);
  };

  const handleBackToUpload = () => {
    goToStep(1);
  };

  const handleSubmit = async () => {
    if (missingRequiredColumns.length > 0) return;
    if (!fieldMapping.email || fieldMapping.email === "none") return;
    if (!fieldMapping.role || fieldMapping.role === "none") return;
    if (cellErrors.length > 0) return;

    const invitations = buildInvitationsFromRows(data, fieldMapping);
    if (invitations.length === 0) return;

    await sendBulkInvitations(invitations, (res) => {
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

  const handleCancelFlow = () => {
    cancelBulkSend();
    resetUpload();
    setSubmissionResult(null);
    onCancel?.();
  };

  const isSubmitDisabled =
    missingRequiredColumns.length > 0 ||
    !fieldMapping.email ||
    fieldMapping.email === "none" ||
    !fieldMapping.role ||
    fieldMapping.role === "none" ||
    cellErrors.length > 0 ||
    data.length === 0 ||
    isLoadingProjects;

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
          onFieldMappingChange={handleFieldMappingAndValidate}
          onBack={handleBackToUpload}
          onCancel={handleCancelFlow}
          onSubmit={handleSubmit}
          isSubmitting={isSending}
          progress={progress}
          missingRequiredColumns={missingRequiredColumns}
          isSubmitDisabled={isSubmitDisabled}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
        />
      ) : (
        <BulkUploadStep3
          result={submissionResult}
          onNewUpload={handleNewUpload}
          onClose={handleCancelFlow}
        />
      )}
    </div>
  );
}
