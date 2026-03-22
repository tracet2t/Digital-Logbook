import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  /** Items per page – used to compute the "Showing X to Y" label. Default 10 */
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

/**
 * Shared pagination footer for all admin tables.
 * Shows "Showing X to Y of Z results" + prev/next/page links.
 *
 * Usage:
 *   <AdminPagination
 *     page={currentPage}
 *     totalPages={totalPages}
 *     total={filteredItems.length}
 *     itemsPerPage={ITEMS_PER_PAGE}
 *     onPageChange={setPage}
 *   />
 */
export default function AdminPagination({
  page,
  totalPages,
  total,
  itemsPerPage = 10,
  onPageChange,
}: AdminPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const to = Math.min(page * itemsPerPage, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-900">{from}</span> to{" "}
        <span className="font-medium text-slate-900">{to}</span> of{" "}
        <span className="font-medium text-slate-900">{total}</span> results
      </p>
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
            />
          </PaginationItem>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={page === p}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          {totalPages > 5 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
