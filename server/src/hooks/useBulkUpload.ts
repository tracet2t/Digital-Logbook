"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

interface FieldMapping {
  email: string;
  role: string;
  project: string;
}

interface BulkUploadState {
  currentStep: 1 | 2;
  uploadedFile: File | null;
  excelData: Record<string, any>[];
  fieldMapping: FieldMapping;
  previewData: Record<string, any>[];
  isLoading: boolean;
  error: string | null;
  fileInfo: {
    name: string;
    size: number;
    rows: number;
  } | null;
}

export function useBulkUpload() {
  const [state, setState] = useState<BulkUploadState>({
    currentStep: 1,
    uploadedFile: null,
    excelData: [],
    fieldMapping: {
      email: "",
      role: "",
      project: "",
    },
    previewData: [],
    isLoading: false,
    error: null,
    fileInfo: null,
  });

  const parseExcelFile = (file: File): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(worksheet) as Record<string, any>[];
          resolve(rows);
        } catch (err) {
          reject(new Error("Failed to parse Excel file"));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    // Validate file format
    const validFormats = [".xlsx", ".xls", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));
    
    if (!validFormats.some(format => file.type === format || fileExtension.toLowerCase() === format)) {
      setState(prev => ({
        ...prev,
        error: "Invalid file format. Please upload .xlsx or .xls files only.",
      }));
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setState(prev => ({
        ...prev,
        error: "File size exceeds 5MB limit.",
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const data = await parseExcelFile(file);

      if (data.length === 0) {
        setState(prev => ({
          ...prev,
          error: "Excel file is empty.",
          isLoading: false,
        }));
        return;
      }

      if (data.length > 500) {
        setState(prev => ({
          ...prev,
          error: "Excel file exceeds 500 rows limit.",
          isLoading: false,
        }));
        return;
      }

      const previewRows = data.slice(0, 5);
      const columns = Object.keys(data[0] || {});

      setState(prev => ({
        ...prev,
        uploadedFile: file,
        excelData: data,
        previewData: previewRows,
        fileInfo: {
          name: file.name,
          size: file.size,
          rows: data.length,
        },
        isLoading: false,
        error: null,
        fieldMapping: {
          email: columns[0] || "",
          role: columns[1] || "",
          project: columns[2] || "",
        },
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to process file",
        isLoading: false,
      }));
    }
  };

  const handleFieldMapping = (field: keyof FieldMapping, column: string) => {
    setState(prev => ({
      ...prev,
      fieldMapping: {
        ...prev.fieldMapping,
        [field]: column,
      },
    }));
  };

  const goToStep = (step: 1 | 2) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  };

  const resetUpload = () => {
    setState({
      currentStep: 1,
      uploadedFile: null,
      excelData: [],
      fieldMapping: {
        email: "",
        role: "",
        project: "",
      },
      previewData: [],
      isLoading: false,
      error: null,
      fileInfo: null,
    });
  };

  const getExcelColumns = (): string[] => {
    if (state.excelData.length === 0) return [];
    return Object.keys(state.excelData[0]);
  };

  return {
    ...state,
    handleFileUpload,
    handleFieldMapping,
    goToStep,
    resetUpload,
    getExcelColumns,
  };
}
