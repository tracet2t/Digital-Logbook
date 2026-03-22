// Generic paginated-table footer: entry count label + windowed page links.
// Mirrors the pagination style used in the Users page.
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export interface TablePaginationProps {
  startCount: number;
  endCount: number;
  totalCount: number;
  safePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Label shown after the count, e.g. "entries" or "users". Defaults to "entries". */
  itemLabel?: string;
}

export function TablePagination({
  startCount,
  endCount,
  totalCount,
  safePage,
  totalPages,
  onPageChange,
  itemLabel = "entries",
}: TablePaginationProps) {
  // Windowed page numbers: current ± 1
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((n) => Math.abs(n - safePage) <= 1);

  return (
    <div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {startCount} to {endCount} of {totalCount} {itemLabel}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationLink
              size="icon"
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
              disabled={safePage <= 1}
              aria-label="Previous page"
            >
              {"<"}
            </PaginationLink>
          </PaginationItem>

          {/* First page + ellipsis when far from start */}
          {safePage > 2 ? (
            <>
              <PaginationItem>
                <PaginationLink
                  size="icon"
                  isActive={safePage === 1}
                  onClick={() => onPageChange(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {safePage > 3 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
            </>
          ) : null}

          {/* Windowed page numbers */}
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                size="icon"
                isActive={pageNumber === safePage}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last page + ellipsis when far from end */}
          {safePage < totalPages - 1 ? (
            <>
              {safePage < totalPages - 2 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  size="icon"
                  isActive={safePage === totalPages}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : null}

          {/* Next */}
          <PaginationItem>
            <PaginationLink
              size="icon"
              onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
              disabled={safePage >= totalPages}
              aria-label="Next page"
            >
              {">"}
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
