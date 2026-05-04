"use client";

import { useState } from "react";

import * as XLSX from "xlsx";

import { useBulkUploadTableStore } from "@/_stores/bulkUploadTableStore";
import { validateBulkUploadRows } from "@/lib/bulkUploadValidation";

interface FieldMapping {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  project: string;
}

interface BulkUploadState {
  currentStep: 1 | 2 | 3;
  uploadedFile: File | null;
  excelData: Record<string, any>[];
  excelColumns: string[];
  fieldMapping: FieldMapping;
  previewData: Record<string, any>[];
  isLoading: boolean;
  error: string | null;
  missingRequiredColumns: string[];
  fileInfo: {
    name: string;
    size: number;
    rows: number;
  } | null;
}

export function useBulkUpload() {
  const { setData, setColumns, setCellErrors, clearAll } =
    useBulkUploadTableStore();
  const [state, setState] = useState<BulkUploadState>({
    currentStep: 1,
    uploadedFile: null,
    excelData: [],
    excelColumns: [],
    fieldMapping: {
      email: "none",
      firstName: "none",
      lastName: "none",
      role: "none",
      project: "none",
    },
    previewData: [],
    isLoading: false,
    error: null,
    missingRequiredColumns: [],
    fileInfo: null,
  });

  const parseExcelFile = (
    file: File,
  ): Promise<{ rows: Record<string, any>[]; headers: string[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: "",
          }) as Record<string, any>[];
          const headerRow = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            range: 0,
            blankrows: false,
          }) as Array<Array<string>>;
          const headers = (headerRow[0] || [])
            .map((header) => header?.toString().trim())
            .filter((header) => header);
          resolve({ rows, headers });
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
    const validFormats = [
      ".xlsx",
      ".xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const fileExtension = file.name.substring(file.name.lastIndexOf("."));

    if (
      !validFormats.some(
        (format) =>
          file.type === format || fileExtension.toLowerCase() === format,
      )
    ) {
      setState((prev) => ({
        ...prev,
        error: "Invalid file format. Please upload .xlsx or .xls files only.",
      }));
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setState((prev) => ({
        ...prev,
        error: "File size exceeds 5MB limit.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const { rows, headers } = await parseExcelFile(file);

      if (rows.length === 0) {
        setState((prev) => ({
          ...prev,
          error: "Excel file is empty.",
          isLoading: false,
        }));
        return;
      }

      if (rows.length > 500) {
        setState((prev) => ({
          ...prev,
          error: "Excel file exceeds 500 rows limit.",
          isLoading: false,
        }));
        return;
      }

      const previewRows = rows.slice(0, 5);
      const columns = headers;
      const normalizedColumns = columns.reduce<Record<string, string>>(
        (acc, column) => {
          const key = column.toLowerCase().trim();
          if (!acc[key]) acc[key] = column;
          return acc;
        },
        {},
      );

      const headerMap: Record<keyof FieldMapping, string> = {
        email: "Email Address",
        firstName: "First Name",
        lastName: "Last Name",
        role: "Role Type",
        project: "Project",
      };

      const requiredHeaders: Array<keyof FieldMapping> = [
        "email",
        "role",
        "firstName",
        "lastName",
      ];
      const missingRequiredColumns = requiredHeaders
        .filter((field) => !normalizedColumns[headerMap[field].toLowerCase()])
        .map((field) => headerMap[field]);

      const getMappedColumn = (field: keyof FieldMapping) => {
        const header = headerMap[field].toLowerCase();
        return normalizedColumns[header] || "none";
      };

      const ensuredColumns = [...columns];
      requiredHeaders.forEach((field) => {
        const name = headerMap[field];
        if (!ensuredColumns.includes(name)) {
          ensuredColumns.push(name);
        }
      });

      const createRowId = (index: number) => {
        if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
          return crypto.randomUUID();
        }
        return `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`;
      };

      const rowsWithIds = rows.map((row, index) => {
        const nextRow = { ...row } as Record<string, unknown>;
        requiredHeaders.forEach((field) => {
          const columnName = headerMap[field];
          if (nextRow[columnName] === undefined) {
            nextRow[columnName] = "";
          }
        });
        return {
          ...nextRow,
          id: createRowId(index),
        };
      });

      const defaultMapping = {
        email: getMappedColumn("email"),
        firstName: getMappedColumn("firstName"),
        lastName: getMappedColumn("lastName"),
        role: getMappedColumn("role"),
        project: getMappedColumn("project"),
      };

      setColumns(ensuredColumns);
      setData(rowsWithIds);
      setCellErrors(validateBulkUploadRows(rowsWithIds, defaultMapping));

      setState((prev) => ({
        ...prev,
        uploadedFile: file,
        excelData: rows,
        excelColumns: ensuredColumns,
        previewData: previewRows,
        fileInfo: {
          name: file.name,
          size: file.size,
          rows: rows.length,
        },
        isLoading: false,
        error: null,
        fieldMapping: defaultMapping,
        missingRequiredColumns,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Failed to process file",
        isLoading: false,
      }));
    }
  };

  const handleFieldMapping = (field: keyof FieldMapping, column: string) => {
    setState((prev) => ({
      ...prev,
      fieldMapping: {
        ...prev.fieldMapping,
        [field]: column,
      },
    }));
  };

  const goToStep = (step: 1 | 2 | 3) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const resetUpload = () => {
    clearAll();
    setState({
      currentStep: 1,
      uploadedFile: null,
      excelData: [],
      fieldMapping: {
        email: "none",
        firstName: "none",
        lastName: "none",
        role: "none",
        project: "none",
      },
      excelColumns: [],
      previewData: [],
      isLoading: false,
      error: null,
      missingRequiredColumns: [],
      fileInfo: null,
    });
  };

  const getExcelColumns = (): string[] => {
    return state.excelColumns;
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
