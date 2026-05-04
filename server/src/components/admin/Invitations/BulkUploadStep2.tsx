"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BulkUploadEditableTable } from "./BulkUploadEditableTable";

interface BulkUploadStep2Props {
  fileInfo: {
    name: string;
    size: number;
    rows: number;
  } | null;
  excelColumns: string[];
  fieldMapping: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    project: string;
  };
  onFieldMappingChange: (
    field: "email" | "firstName" | "lastName" | "role" | "project",
    column: string,
  ) => void;
  onBack?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  missingRequiredColumns?: string[];
  isSubmitDisabled?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function BulkUploadStep2({
  fileInfo,
  excelColumns,
  fieldMapping,
  onFieldMappingChange,
  onBack = () => {},
  onCancel = () => {},
  onSubmit = () => {},
  isSubmitting = false,
  progress = { current: 0, total: 0, percentage: 0 },
  missingRequiredColumns = [],
  isSubmitDisabled = false,
}: BulkUploadStep2Props) {
  const hasMissingRequired = missingRequiredColumns.length > 0;

  return (
    <div className="space-y-6 w-full">
      {/* Step Indicator */}
      <div className="text-center">
        <span className="text-sm font-bold text-[#FF6B6B] uppercase tracking-wide">
          Workflow: Step 2 of 2
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Data Mapping & Verification
        </h1>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-6 border-[#d9dde5] space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                {fileInfo && (
                  <>
                    <p className="font-semibold text-slate-900">
                      {fileInfo.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      {formatFileSize(fileInfo.size)} • {fileInfo.rows} rows
                    </p>
                  </>
                )}
              </div>
              {hasMissingRequired ? (
                <Badge className="bg-orange-100 text-orange-800">
                  Missing Required Columns
                </Badge>
              ) : (
                <Badge className="bg-[#22C55E] text-white">
                  ✓ Valid Format
                </Badge>
              )}
            </div>

            <div className="border-t border-[#e4e7ed] pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Records Detected
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {fileInfo?.rows ?? 0} rows
              </p>
            </div>
          </Card>

          <Card className="p-6 border-[#d9dde5] space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Field Mapping
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  System Field: Email
                </p>
                <Select
                  value={fieldMapping.email}
                  onValueChange={(value) =>
                    onFieldMappingChange("email", value)
                  }
                >
                  <SelectTrigger className="h-9 border-[#dbe0e8]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {excelColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  System Field: Role
                </p>
                <Select
                  value={fieldMapping.role}
                  onValueChange={(value) => onFieldMappingChange("role", value)}
                >
                  <SelectTrigger className="h-9 border-[#dbe0e8]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {excelColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  System Field: First Name
                </p>
                <Select
                  value={fieldMapping.firstName}
                  onValueChange={(value) =>
                    onFieldMappingChange("firstName", value)
                  }
                >
                  <SelectTrigger className="h-9 border-[#dbe0e8]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {excelColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  System Field: Last Name
                </p>
                <Select
                  value={fieldMapping.lastName}
                  onValueChange={(value) =>
                    onFieldMappingChange("lastName", value)
                  }
                >
                  <SelectTrigger className="h-9 border-[#dbe0e8]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {excelColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  System Field: Project
                </p>
                <Select
                  value={fieldMapping.project}
                  onValueChange={(value) =>
                    onFieldMappingChange("project", value)
                  }
                >
                  <SelectTrigger className="h-9 border-[#dbe0e8]">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {excelColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border-t border-[#e4e7ed] pt-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Pro Tip:</p>
              <p>
                Ensure your data format match the ISO 8601 standard (YYYY-MM-DD)
                to avoid import errors.
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Preview Data ({fileInfo?.rows ?? 0} rows)
          </p>
          <BulkUploadEditableTable fieldMapping={fieldMapping} />
        </div>
      </div>

      {/* Progress Bar */}
      {isSubmitting && (
        <Card className="p-6 border-[#d9dde5]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Sending Invitations...
              </p>
              <p className="text-sm text-slate-600">
                {progress.current} / {progress.total}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-[#000053] h-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              {progress.percentage}% Complete
            </p>
          </div>
        </Card>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-6 border-t border-[#e4e7ed] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            onClick={onBack}
            variant="outline"
            className="h-10 w-full border-[#d9dde5] px-6 text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            ← Back to Upload
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="h-10 w-full border-[#d9dde5] px-6 text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            Cancel
          </Button>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || isSubmitDisabled}
          className="h-10 w-full bg-[#000053] px-6 font-semibold text-white hover:bg-[#000053] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? "SENDING..." : "COMPLETE UPLOAD"} →
        </Button>
      </div>
    </div>
  );
}
