"use client";

import React from "react";

import { CheckCircle, Download } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { DragDropZone } from "./DragDropZone";

interface BulkUploadStep1Props {
  onFileUpload: (file: File) => void;
  onNext: () => void;
  uploadedFile: File | null;
  error: string | null;
  isLoading: boolean;
}

const downloadSampleTemplate = () => {
  // Sample template data
  const sampleData = [
    {
      "Email Address": "alex.chen@nexus.corp",
      "First Name": "Alex",
      "Last Name": "Chen",
      "Role Type": "Mentor",
      Project: "Alpha Initiative",
    },
    {
      "Email Address": "m.rodriguez@tech.org",
      "First Name": "Maria",
      "Last Name": "Rodriguez",
      "Role Type": "Mentor",
      Project: "Alpha Initiative",
    },
    {
      "Email Address": "j.smith@indie.io",
      "First Name": "Jordan",
      "Last Name": "Smith",
      "Role Type": "Mentor",
      Project: "Global Archive",
    },
    {
      "Email Address": "sarah.lee@nexus.corp",
      "First Name": "Sarah",
      "Last Name": "Lee",
      "Role Type": "Lead",
      Project: "Beta Pilot",
    },
  ];

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 25 }, // Email Address
    { wch: 15 }, // First Name
    { wch: 15 }, // Last Name
    { wch: 12 }, // Role Type
    { wch: 20 }, // Project
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Invitations");

  // Download file
  XLSX.writeFile(workbook, "sample-invitations-template.xlsx");
};

interface BulkUploadStep1Props {
  onFileUpload: (file: File) => void;
  onNext: () => void;
  uploadedFile: File | null;
  error: string | null;
  isLoading: boolean;
}

export function BulkUploadStep1({
  onFileUpload,
  onNext,
  uploadedFile,
  error,
  isLoading,
}: BulkUploadStep1Props) {
  const handlePreviewClick = () => {
    if (uploadedFile) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Page Header */}
      {/* <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">
          Bulk Upload Invitations
        </h1>
        <p className="text-slate-600">
          Upload an Excel file to send multiple invitations at once
        </p>
      </div> */}

      {/* Stats Section - Moved to Top */}
      {/* <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 border-[#d9dde5] text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Current Queue
          </p>
          <p className="text-4xl font-bold text-slate-900">12</p>
          <p className="text-sm text-slate-600">Pending invitations</p>
        </Card>

        <Card className="p-6 border-[#d9dde5] text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Sent
          </p>
          <p className="text-4xl font-bold text-slate-900">1,284</p>
          <p className="text-sm text-slate-600">System lifetime total</p>
        </Card>

        <Card className="p-6 border-[#d9dde5] text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Last Upload
          </p>
          <p className="text-lg font-semibold text-slate-900">
            archive_bulk_24.xlsx
          </p>
          <p className="text-sm text-slate-600">Uploaded 2 hours ago</p>
        </Card>
      </div> */}

      {/* Step Indicator */}
      <div className="text-center">
        <span className="text-sm font-bold text-[#FF6B6B] uppercase tracking-wide">
          Step 1 of 2
        </span>
      </div>

      {/* Drag Drop Zone */}
      <Card className="p-8 border-[#d9dde5]">
        <DragDropZone
          onFileDrop={onFileUpload}
          selectedFile={uploadedFile}
          error={error}
          isLoading={isLoading}
        />
      </Card>

      {/* Upload Guidelines */}
      <Card className="p-6 border-[#d9dde5] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Upload Guidelines
          </h3>
          <button
            onClick={downloadSampleTemplate}
            className="text-sm font-semibold text-[#000053] hover:underline flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Download Sample Template
          </button>
        </div>

        <div className="space-y-3">
          {[
            "Ensure the first row contains column headers (Email, Full Name, Role).",
            "Maximum of 500 rows per individual upload.",
            "Double check email formatting before uploading.",
          ].map((guideline, idx) => (
            <div key={idx} className="flex gap-3">
              <CheckCircle
                size={20}
                className="text-[#22C55E] flex-shrink-0 mt-0.5"
              />
              <span className="text-sm text-slate-700">{guideline}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4">
        <Button
          variant="outline"
          className="px-6 h-10 border-[#d9dde5] text-slate-700 hover:bg-slate-50"
        >
          Back
        </Button>

        <Button
          onClick={handlePreviewClick}
          disabled={!uploadedFile || isLoading}
          className="px-6 h-10 bg-[#000053] hover:bg-[#000053] text-white font-semibold"
        >
          Preview & Validate
        </Button>
      </div>
    </div>
  );
}
