import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  startCount: number;
  endCount: number;
  totalCount: number;
  safePage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange: (page: number) => void;
}

// Footer pagination
export function ReportsPagination({
  startCount,
  endCount,
  totalCount,
  safePage,
  totalPages,
  pageNumbers,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
      <p className="text-sm text-[#737373]">
        Showing {startCount} to {endCount} of {totalCount} entries
      </p>
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, safePage - 1))}
            />
          </PaginationItem>
          {safePage > 2 ? (
            <>
              <PaginationItem>
                <PaginationLink
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
          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={safePage === pageNumber}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          {safePage < totalPages - 1 ? (
            <>
              {safePage < totalPages - 2 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  isActive={safePage === totalPages}
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : null}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
