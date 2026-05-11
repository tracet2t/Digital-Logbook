"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface BulkUploadCellError {
  row: number;
  column: string;
  message: string;
  value: unknown;
}

export interface BulkUploadTableRow {
  id: string;
  [key: string]: unknown;
}

interface BulkUploadTableContextType {
  data: BulkUploadTableRow[];
  columns: string[];
  cellErrors: BulkUploadCellError[];
  currentPage: number;
  pageSize: number;
  selectedRowIds: Set<string>;
  isDeleteDialogOpen: boolean;

  setData: (data: BulkUploadTableRow[]) => void;
  setColumns: (columns: string[]) => void;
  setCellErrors: (errors: BulkUploadCellError[]) => void;
  clearAll: () => void;
  updateCell: (rowIndex: number, column: string, value: unknown) => void;

  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  toggleRowSelection: (rowId: string) => void;
  selectAllRows: (rowIds: string[]) => void;
  deselectAllRows: () => void;
  deleteSelectedRows: () => void;

  openDeleteDialog: () => void;
  closeDeleteDialog: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const BulkUploadTableContext = createContext<
  BulkUploadTableContextType | undefined
>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function BulkUploadTableProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<BulkUploadTableRow[]>([]);
  const [columns, setColumnsState] = useState<string[]>([]);
  const [cellErrors, setCellErrorsState] = useState<BulkUploadCellError[]>([]);
  const [currentPage, setCurrentPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(
    new Set<string>(),
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const setData = useCallback((newData: BulkUploadTableRow[]) => {
    setDataState(newData);
  }, []);

  const setColumns = useCallback((newColumns: string[]) => {
    setColumnsState(newColumns);
  }, []);

  const setCellErrors = useCallback((errors: BulkUploadCellError[]) => {
    setCellErrorsState(errors);
  }, []);

  const clearAll = useCallback(() => {
    setDataState([]);
    setColumnsState([]);
    setCellErrorsState([]);
    setCurrentPageState(1);
    setPageSizeState(10);
    setSelectedRowIds(new Set<string>());
    setIsDeleteDialogOpen(false);
  }, []);

  const updateCell = useCallback(
    (rowIndex: number, column: string, value: unknown) => {
      setDataState((prev) =>
        prev.map((row, index) =>
          index === rowIndex ? { ...row, [column]: value } : row,
        ),
      );
    },
    [],
  );

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPageState(1);
  }, []);

  const toggleRowSelection = useCallback((rowId: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const selectAllRows = useCallback((rowIds: string[]) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      rowIds.forEach((id) => next.add(id));
      return next;
    });
  }, []);

  const deselectAllRows = useCallback(() => {
    setSelectedRowIds(new Set<string>());
  }, []);

  const deleteSelectedRows = useCallback(() => {
    setDataState((prev) => prev.filter((row) => !selectedRowIds.has(row.id)));
    setSelectedRowIds(new Set<string>());
    setIsDeleteDialogOpen(false);
  }, [selectedRowIds]);

  const openDeleteDialog = useCallback(() => {
    if (selectedRowIds.size > 0) {
      setIsDeleteDialogOpen(true);
    }
  }, [selectedRowIds]);

  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  const value: BulkUploadTableContextType = {
    data,
    columns,
    cellErrors,
    currentPage,
    pageSize,
    selectedRowIds,
    isDeleteDialogOpen,
    setData,
    setColumns,
    setCellErrors,
    clearAll,
    updateCell,
    setCurrentPage,
    setPageSize,
    toggleRowSelection,
    selectAllRows,
    deselectAllRows,
    deleteSelectedRows,
    openDeleteDialog,
    closeDeleteDialog,
  };

  return (
    <BulkUploadTableContext.Provider value={value}>
      {children}
    </BulkUploadTableContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useBulkUploadTableStore() {
  const context = useContext(BulkUploadTableContext);
  if (context === undefined) {
    throw new Error(
      "useBulkUploadTableStore must be used within BulkUploadTableProvider",
    );
  }
  return context;
}
