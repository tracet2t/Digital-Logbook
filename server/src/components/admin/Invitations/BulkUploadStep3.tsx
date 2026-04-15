"use client";

import React from "react";

import { AlertTriangle, CheckCircle2, Upload, XCircle } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BulkUploadStep3Props {
  result: {
    success: number;
    failed: number;
    errors: Array<{ row: number; email: string; error: string }>;
  } | null;
  onNewUpload?: () => void;
  onClose?: () => void;
}

export function BulkUploadStep3({
  result,
  onNewUpload = () => {},
  onClose = () => {},
}: BulkUploadStep3Props) {
  if (!result) {
    return null;
  }

  const total = result.success + result.failed;
  const successRate = Math.round((result.success / total) * 100);

  return (
    <div className="space-y-6 w-full">
      {/* Step Indicator */}
      <div className="text-center">
        <span className="text-sm font-bold text-[#22C55E] uppercase tracking-wide">
          Bulk Upload Complete
        </span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Invitations Summary
        </h1>
        <p className="text-slate-600 mt-2">
          Review the results of your bulk invitation upload
        </p>
      </div>

      {/* Success/Failure Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Card */}
        <Card className="p-6 border-[#d9dde5]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#f1f5f9] rounded-lg">
              <Upload className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Total Processed
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
            </div>
          </div>
        </Card>

        {/* Success Card */}
        <Card className="p-6 border-[#d9dde5]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-[#22C55E]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Successfully Sent
              </p>
              <p className="text-2xl font-bold text-[#22C55E] mt-1">
                {result.success}
              </p>
            </div>
          </div>
        </Card>

        {/* Failed Card */}
        <Card className="p-6 border-[#d9dde5]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Failed
              </p>
              <p className="text-2xl font-bold text-[#EF4444] mt-1">
                {result.failed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Rate Bar */}
      <Card className="p-6 border-[#d9dde5]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Success Rate</p>
            <p className="text-sm font-bold text-slate-900">{successRate}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                successRate === 100
                  ? "bg-[#22C55E]"
                  : successRate >= 50
                    ? "bg-[#FFA500]"
                    : "bg-[#EF4444]"
              }`}
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Status Alert */}
      {result.success === total ? (
        <Alert className="border-[#22C55E] bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
          <AlertDescription className="text-sm text-slate-700">
            <span className="font-semibold">Success!</span> All invitations were
            sent successfully. Recipients will receive their invitation emails
            shortly.
          </AlertDescription>
        </Alert>
      ) : result.failed === total ? (
        <Alert className="border-[#EF4444] bg-red-50">
          <XCircle className="h-4 w-4 text-[#EF4444]" />
          <AlertDescription className="text-sm text-slate-700">
            <span className="font-semibold">All invitations failed.</span>{" "}
            Please review the errors below and try again with corrected data.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-[#FFA500] bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-[#FFA500]" />
          <AlertDescription className="text-sm text-slate-700">
            <span className="font-semibold">Partial success.</span> Some
            invitations were sent successfully, but others failed. Review the
            errors below.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Details Table */}
      {result.errors.length > 0 && (
        <Card className="border-[#d9dde5] overflow-hidden">
          <div className="p-4 bg-[#f8fafc] border-b border-[#e4e7ed]">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Failed Invitations ({result.errors.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Row #
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Error Message
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.errors.map((error, idx) => (
                  <TableRow key={idx} className="bg-white hover:bg-[#fbfcff]">
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="border-[#EF4444] text-[#EF4444]"
                      >
                        {error.row}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium text-slate-900">
                      {error.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-slate-600">
                      {error.error}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-[#e4e7ed]">
        <Button
          onClick={onClose}
          variant="outline"
          className="px-6 h-10 border-[#d9dde5] text-slate-700 hover:bg-slate-50"
        >
          Close
        </Button>

        <Button
          onClick={onNewUpload}
          className="px-6 h-10 bg-[#000053] hover:bg-[#000053] text-white font-semibold"
        >
          <Upload size={16} className="mr-2" />
          Upload Another File
        </Button>
      </div>
    </div>
  );
}
