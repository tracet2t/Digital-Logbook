"use client";

import { useSyncExternalStore } from "react";

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

interface BulkUploadTableState {
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

const initialState = {
  data: [],
  columns: [],
  cellErrors: [],
  currentPage: 1,
  pageSize: 10,
  selectedRowIds: new Set<string>(),
  isDeleteDialogOpen: false,
};

type StoreState = Omit<
  BulkUploadTableState,
  | "setData"
  | "setColumns"
  | "setCellErrors"
  | "clearAll"
  | "updateCell"
  | "setCurrentPage"
  | "setPageSize"
  | "toggleRowSelection"
  | "selectAllRows"
  | "deselectAllRows"
  | "deleteSelectedRows"
  | "openDeleteDialog"
  | "closeDeleteDialog"
>;

let storeState: StoreState = { ...initialState };
const listeners = new Set<() => void>();
let actions: Omit<BulkUploadTableState, keyof StoreState>;

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const setState = (
  next: Partial<StoreState> | ((prev: StoreState) => StoreState),
) => {
  storeState =
    typeof next === "function" ? next(storeState) : { ...storeState, ...next };
  snapshot = { ...storeState, ...actions };
  emitChange();
};

actions = {
  setData: (data: BulkUploadTableRow[]) => setState({ data }),
  setColumns: (columns: string[]) => setState({ columns }),
  setCellErrors: (cellErrors: BulkUploadCellError[]) => setState({ cellErrors }),

  clearAll: () =>
    setState({
      ...initialState,
      selectedRowIds: new Set<string>(),
    }),

  updateCell: (rowIndex: number, column: string, value: unknown) =>
    setState((prev) => ({
      ...prev,
      data: prev.data.map((row, index) =>
        index === rowIndex ? { ...row, [column]: value } : row,
      ),
    })),

  setCurrentPage: (currentPage: number) => setState({ currentPage }),
  setPageSize: (pageSize: number) =>
    setState({ pageSize, currentPage: 1 }),

  toggleRowSelection: (rowId: string) =>
    setState((prev) => {
      const next = new Set(prev.selectedRowIds);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return { ...prev, selectedRowIds: next };
    }),

  selectAllRows: (rowIds: string[]) =>
    setState((prev) => {
      const next = new Set(prev.selectedRowIds);
      rowIds.forEach((id) => next.add(id));
      return { ...prev, selectedRowIds: next };
    }),

  deselectAllRows: () =>
    setState((prev) => ({ ...prev, selectedRowIds: new Set<string>() })),

  deleteSelectedRows: () =>
    setState((prev) => {
      const remaining = prev.data.filter(
        (row) => !prev.selectedRowIds.has(row.id),
      );
      return {
        ...prev,
        data: remaining,
        selectedRowIds: new Set<string>(),
        isDeleteDialogOpen: false,
      };
    }),

  openDeleteDialog: () =>
    setState((prev) => {
      if (prev.selectedRowIds.size > 0) {
        return { ...prev, isDeleteDialogOpen: true };
      }
      return prev;
    }),

  closeDeleteDialog: () =>
    setState((prev) => ({ ...prev, isDeleteDialogOpen: false })),
};

let snapshot = { ...storeState, ...actions };

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export const useBulkUploadTableStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
