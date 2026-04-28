"use client";

import React, { useState, useRef } from "react";
import { FileUp, Check } from "lucide-react";

interface DragDropZoneProps {
  onFileDrop: (file: File) => void;
  accept?: string;
  selectedFile?: File | null;
  error?: string | null;
  isLoading?: boolean;
}

export function DragDropZone({
  onFileDrop,
  accept = ".xlsx,.xls",
  selectedFile = null,
  error = null,
  isLoading = false,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onFileDrop(files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center w-full h-72 px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
          isDragging
            ? "border-[#000053] bg-[#e8ecff]"
            : error
            ? "border-red-300 bg-red-50"
            : selectedFile
            ? "border-[#22C55E] bg-[#f0fdf4]"
            : "border-[#d9dde5] bg-[#f8fafc] hover:bg-[#f0f4ff]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={isLoading}
        />

        {selectedFile && !error ? (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="relative">
                <FileUp size={48} className="text-[#22C55E]" />
                <Check
                  size={24}
                  className="absolute -bottom-1 -right-1 text-[#22C55E] bg-white rounded-full p-1"
                />
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <FileUp size={48} className="mx-auto text-slate-400" />
            <div>
              <p className="text-base font-semibold text-slate-900">
                Drag and drop your Excel file here or click to browse
              </p>
              <p className="text-sm text-slate-500 mt-1">
                .xlsx, .xls files only | Max 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-600 font-medium">{error}</div>}
    </div>
  );
}