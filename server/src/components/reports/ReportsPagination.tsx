import { TablePagination } from "@/components/ui/table-pagination";

interface Props {
  startCount: number;
  endCount: number;
  totalCount: number;
  safePage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Footer pagination with entry count and windowed page links
export function ReportsPagination(props: Props) {
  return <TablePagination {...props} itemLabel="entries" />;
}
