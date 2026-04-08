"use client";

import React from "react";
import { useBulkUpload } from "@/hooks/useBulkUpload";
import { BulkUploadStep1 } from "./BulkUploadStep1";
import { BulkUploadStep2 } from "./BulkUploadStep2";

interface BulkUploadTabsProps {
  onBack?: () => void;
  onCancel?: () => void;
}

export function BulkUploadTabs({ onBack, onCancel }: BulkUploadTabsProps) {
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
  } = useBulkUpload();

  const handlePreviewValidate = () => {
    goToStep(2);
  };

  const handleBackToUpload = () => {
    goToStep(1);
  };

  const handleSubmit = () => {
    // Frontend only - will integrate backend later
    console.log("Submitting bulk upload:", {
      file: uploadedFile?.name,
      mapping: fieldMapping,
      rowCount: excelData.length,
    });
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
      ) : (
        <BulkUploadStep2
          fileInfo={fileInfo}
          excelColumns={getExcelColumns()}
          fieldMapping={fieldMapping}
          onFieldMappingChange={handleFieldMapping}
          previewData={previewData}
          onBack={handleBackToUpload}
          onCancel={onCancel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
