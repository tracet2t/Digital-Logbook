import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  /** Items per page – used to compute the "Showing X to Y" label. Default 10 */
  itemsPerPage?: number;
  /** Label shown after the count, e.g. "users" or "entries". Default "results" */
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

/**
 * Shared pagination footer for all admin tables.
 * Matches the users page style: "Showing X to Y of Z" + windowed < 1 2 3 > links.
 */
export default function AdminPagination({
  page,
  totalPages,
  total,
  itemsPerPage = 10,
  itemLabel = "results",
  onPageChange,
}: AdminPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const to = Math.min(page * itemsPerPage, total);

  const goToPage = (next: number) => {
    if (next < 1 || next > totalPages) return;
    onPageChange(next);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-[#e4e7ed] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Showing {from} to {to} of {total} {itemLabel}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationLink
              size="icon"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              aria-label="Previous page"
            >
              {"<"}
            </PaginationLink>
          </PaginationItem>

          {/* First page + ellipsis when far from start */}
          {page > 2 ? (
            <>
              <PaginationItem>
                <PaginationLink
                  size="icon"
                  isActive={page === 1}
                  onClick={() => goToPage(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {page > 3 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
            </>
          ) : null}

          {/* Windowed pages: current ±1 */}
          {Array.from({ length: totalPages }, (_, idx) => idx + 1)
            .filter((n) => Math.abs(n - page) <= 1)
            .map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  size="icon"
                  isActive={n === page}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}

          {/* Last page + ellipsis when far from end */}
          {page < totalPages - 1 ? (
            <>
              {page < totalPages - 2 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  size="icon"
                  isActive={page === totalPages}
                  onClick={() => goToPage(totalPages)}
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
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
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
