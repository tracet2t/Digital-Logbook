import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

interface InvitationsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function InvitationsPagination({ page, totalPages, total, onPageChange }: InvitationsPaginationProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
      <p className="text-sm text-slate-500">
        Showing <span className="font-medium text-slate-900">{total === 0 ? 0 : (page - 1) * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * 10, total)}</span> of <span className="font-medium text-slate-900">{total}</span> results
      </p>
      <Pagination className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => onPageChange(Math.max(1, page - 1))} />
          </PaginationItem>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={page === p} onClick={() => onPageChange(p)}>{p}</PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
          <PaginationItem>
            <PaginationNext onClick={() => onPageChange(Math.min(totalPages, page + 1))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}