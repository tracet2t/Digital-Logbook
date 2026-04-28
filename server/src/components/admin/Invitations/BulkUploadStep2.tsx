"use client";

import React from "react";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  previewData: Record<string, any>[];
  onBack?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
}

const getRoleBadgeColor = (role: string) => {
  const roleMap: Record<string, string> = {
    mentor: "bg-blue-100 text-blue-800",
    lead: "bg-red-100 text-red-800",
    student: "bg-purple-100 text-purple-800",
  };
  return roleMap[role?.toLowerCase()] || "bg-gray-100 text-gray-800";
};

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
  previewData,
  onBack = () => {},
  onCancel = () => {},
  onSubmit = () => {},
  isSubmitting = false,
  progress = { current: 0, total: 0, percentage: 0 },
}: BulkUploadStep2Props) {
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

      {/* Main Content: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel (40%) */}
        <div className="lg:col-span-2 space-y-4">
          {/* File Card */}
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
              <Badge className="bg-[#22C55E] text-white">✓ Valid Format</Badge>
            </div>

            {/* Records Detected */}
            <div className="border-t border-[#e4e7ed] pt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Records Detected
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {fileInfo?.rows ?? 0} rows
              </p>
            </div>
          </Card>

          {/* Field Mapping */}
          <Card className="p-6 border-[#d9dde5] space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Field Mapping
            </h3>

            <div className="space-y-4">
              {/* Email Mapping */}
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

              {/* First Name Mapping */}
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

              {/* Last Name Mapping */}
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

              {/* Role Mapping */}
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

              {/* Project Mapping */}
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

            {/* Pro Tip */}
            <div className="border-t border-[#e4e7ed] pt-4 text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">Pro Tip:</p>
              <p>
                Ensure your data format match the ISO 8601 standard (YYYY-MM-DD)
                to avoid import errors.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Panel (60%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Preview Header */}
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Live Preview (First 5 Rows)
          </p>

          {/* Preview Table */}
          <Card className="border-[#d9dde5] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    First Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Last Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Role Type
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Project
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.length > 0 ? (
                  previewData.map((row, idx) => (
                    <TableRow key={idx} className="bg-white hover:bg-[#fbfcff]">
                      <TableCell className="px-4 py-3 font-medium text-slate-900">
                        {row[fieldMapping.email] || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-slate-700">
                        {fieldMapping.firstName &&
                        fieldMapping.firstName !== "none"
                          ? row[fieldMapping.firstName] || "-"
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-slate-700">
                        {fieldMapping.lastName &&
                        fieldMapping.lastName !== "none"
                          ? row[fieldMapping.lastName] || "-"
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={getRoleBadgeColor(row[fieldMapping.role])}
                        >
                          {row[fieldMapping.role]?.toUpperCase() || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-slate-700">
                        {fieldMapping.project && fieldMapping.project !== "none"
                          ? row[fieldMapping.project] || "-"
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No preview data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Warning Alert */}
          <Alert className="border-[#FFA500] bg-orange-50">
            <AlertCircle className="h-4 w-4 text-[#FFA500]" />
            <AlertDescription className="text-sm text-slate-700">
              The table above shows a preview of how your data will be imported.
              Please verify that columns are mapped correctly to avoid data
              corruption.
            </AlertDescription>
          </Alert>
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
          disabled={isSubmitting}
          className="h-10 w-full bg-[#000053] px-6 font-semibold text-white hover:bg-[#000053] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? "SENDING..." : "UPLOAD & SEND INVITATIONS"} →
        </Button>
      </div>
    </div>
  );
}
