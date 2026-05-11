"use client";

import React, { useMemo } from "react";

import {
  BulkUploadCellError,
  useBulkUploadTableStore,
} from "@/_stores/bulkUploadTableStore";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BulkUploadEditableTable({
  fieldMapping,
  projects = [],
}: {
  fieldMapping: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    project: string;
  };
  projects?: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
}) {
  const {
    data,
    columns,
    cellErrors,
    currentPage,
    pageSize,
    selectedRowIds,
    isDeleteDialogOpen,
    setData,
    setCurrentPage,
    setPageSize,
    toggleRowSelection,
    selectAllRows,
    deselectAllRows,
    openDeleteDialog,
    closeDeleteDialog,
  } = useBulkUploadTableStore();

  const totalPages = Math.ceil(data.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const paginatedData = data.slice(startIndex, endIndex);

  const currentPageRowIds = paginatedData.map((row) => row.id);
  const allCurrentPageSelected =
    currentPageRowIds.length > 0 &&
    currentPageRowIds.every((id) => selectedRowIds.has(id));
  const someCurrentPageSelected =
    currentPageRowIds.some((id) => selectedRowIds.has(id)) &&
    !allCurrentPageSelected;
  const selectedCount = selectedRowIds.size;

  const getCellError = useMemo(() => {
    const errorMap = new Map<string, BulkUploadCellError>();
    cellErrors.forEach((error) => {
      errorMap.set(`${error.row}-${error.column}`, error);
    });
    return (rowIndex: number, column: string) => {
      return errorMap.get(`${startIndex + rowIndex}-${column}`);
    };
  }, [cellErrors, startIndex]);

  const handleSelectAllCurrentPage = () => {
    allCurrentPageSelected
      ? deselectAllRows()
      : selectAllRows(currentPageRowIds);
  };

  const handleCellUpdate = (
    rowIndex: number,
    column: string,
    value: string,
  ) => {
    const updated = data.map((row, index) =>
      index === rowIndex ? { ...row, [column]: value } : row,
    );
    setData(updated);
  };

  const handleConfirmDelete = () => {
    const remaining = data.filter((row) => !selectedRowIds.has(row.id));
    const newTotalPages = Math.ceil(remaining.length / pageSize) || 1;
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
    setData(remaining);
    deselectAllRows();
    closeDeleteDialog();
  };

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-md border bg-slate-50 p-3">
          <span className="text-sm font-medium text-slate-700">
            {selectedCount} row{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={deselectAllRows}>
              Deselect All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={openDeleteDialog}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <Checkbox
                  checked={allCurrentPageSelected}
                  {...(someCurrentPageSelected && {
                    "data-state": "indeterminate",
                  })}
                  onCheckedChange={handleSelectAllCurrentPage}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[60px] text-center">#</TableHead>
              {columns.map((column) => (
                <TableHead key={column} className="min-w-[160px]">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow key={row.id}>
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedRowIds.has(row.id)}
                    onCheckedChange={() => toggleRowSelection(row.id)}
                    aria-label={`Select row ${startIndex + rowIndex + 1}`}
                  />
                </TableCell>
                <TableCell className="text-center text-sm text-slate-500">
                  {startIndex + rowIndex + 1}
                </TableCell>
                {columns.map((column) => {
                  const error = getCellError(rowIndex, column);
                  const hasError = Boolean(error);
                  const isProjectColumn =
                    column === fieldMapping.project &&
                    fieldMapping.project !== "none";
                  const currentValue = String(row[column] ?? "");
                  const isEmpty = !currentValue || currentValue.trim() === "";

                  return (
                    <TableCell key={`${row.id}-${column}`} className="p-1">
                      <div className="relative">
                        {isProjectColumn ? (
                          <>
                            {isEmpty ? (
                              <Select
                                value={currentValue}
                                onValueChange={(value) =>
                                  handleCellUpdate(
                                    startIndex + rowIndex,
                                    column,
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="h-9 text-sm border-slate-200 w-full">
                                  <SelectValue placeholder="Select project..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {projects.length > 0 ? (
                                    projects.map((project) => (
                                      <SelectItem
                                        key={project.id}
                                        value={project.name}
                                      >
                                        {project.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div className="p-2 text-sm text-slate-500">
                                      No projects available
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                value={currentValue}
                                onChange={(event) =>
                                  handleCellUpdate(
                                    startIndex + rowIndex,
                                    column,
                                    event.target.value,
                                  )
                                }
                                className={`h-9 text-sm ${
                                  hasError
                                    ? "border-red-500 bg-red-50"
                                    : "border-slate-200"
                                }`}
                                placeholder="Enter project name"
                              />
                            )}
                          </>
                        ) : (
                          <Input
                            value={currentValue}
                            onChange={(event) =>
                              handleCellUpdate(
                                startIndex + rowIndex,
                                column,
                                event.target.value,
                              )
                            }
                            className={`h-9 text-sm ${
                              hasError
                                ? "border-red-500 bg-red-50"
                                : "border-slate-200"
                            }`}
                          />
                        )}
                        {hasError && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-red-500 text-white">
                                {error?.message}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <span className="text-sm text-slate-500">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full text-sm text-slate-500 sm:w-auto sm:text-center">
          {data.length === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
          {data.length}
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
          {[
            {
              icon: ChevronsLeft,
              onClick: () => setCurrentPage(1),
              disabled: currentPage === 1,
            },
            {
              icon: ChevronLeft,
              onClick: () => setCurrentPage(Math.max(1, currentPage - 1)),
              disabled: currentPage === 1,
            },
          ].map(({ icon: Icon, onClick, disabled }, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onClick}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          <span className="px-3 text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          {[
            {
              icon: ChevronRight,
              onClick: () =>
                setCurrentPage(Math.min(totalPages, currentPage + 1)),
              disabled: currentPage >= totalPages,
            },
            {
              icon: ChevronsRight,
              onClick: () => setCurrentPage(totalPages),
              disabled: currentPage >= totalPages,
            },
          ].map(({ icon: Icon, onClick, disabled }, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={onClick}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCount === 1 ? (
                <>
                  Are you sure you want to delete this row? This cannot be
                  undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete {selectedCount} rows? This
                  cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-600"
            >
              MentorMentor Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
