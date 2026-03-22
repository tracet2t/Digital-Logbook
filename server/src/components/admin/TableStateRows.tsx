import { TableCell, TableRow } from "@/components/ui/table";

interface TableStateRowsProps {
  /** Number of columns – used for colSpan so the row spans the full table */
  colSpan: number;
  loading: boolean;
  /** Pass the error message string, any truthy value, or null/false to hide */
  error?: string | null | boolean;
  /** Pass true when the data array is empty (and not loading/erroring) */
  empty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
}

/**
 * Renders a single-row placeholder inside <TableBody> for the three common
 * async states: loading, error, and empty results.
 *
 * Usage:
 *   <TableBody>
 *     <TableStateRows
 *       colSpan={5}
 *       loading={isLoading}
 *       error={fetchError}
 *       empty={visibleRows.length === 0}
 *       loadingMessage="Loading users..."
 *       emptyMessage="No users found for the selected filters."
 *     />
 *     {!isLoading && visibleRows.map((row) => <TableRow key={row.id}>...</TableRow>)}
 *   </TableBody>
 */
export default function TableStateRows({
  colSpan,
  loading,
  error,
  empty,
  emptyMessage = "No records found.",
  loadingMessage = "Loading...",
}: TableStateRowsProps) {
  if (loading) {
    return (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="px-5 py-8 text-center text-sm text-slate-400"
        >
          {loadingMessage}
        </TableCell>
      </TableRow>
    );
  }

  if (error) {
    return (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="px-5 py-8 text-center text-sm text-red-500"
        >
          {typeof error === "string" ? error : "Failed to load data."}
        </TableCell>
      </TableRow>
    );
  }

  if (empty) {
    return (
      <TableRow>
        <TableCell
          colSpan={colSpan}
          className="px-5 py-8 text-center text-sm text-slate-400"
        >
          {emptyMessage}
        </TableCell>
      </TableRow>
    );
  }

  return null;
}
