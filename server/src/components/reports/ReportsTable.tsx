import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ReportRow } from "./types";

interface Props {
  isLoading: boolean;
  fetchError: string | null;
  visibleReports: ReportRow[];
}

// Renders the report rows for the current page
export function ReportsTable({ isLoading, fetchError, visibleReports }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F5F5F5]">
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Project Name
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Mentor
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Students Count
          </TableHead>
          <TableHead className="text-xs font-bold uppercase text-[#737373]">
            Date
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center text-sm text-[#737373]"
            >
              Loading reports...
            </TableCell>
          </TableRow>
        ) : fetchError ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center text-sm text-red-500"
            >
              {fetchError}
            </TableCell>
          </TableRow>
        ) : visibleReports.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center text-sm text-[#737373]"
            >
              No reports found for the selected filters.
            </TableCell>
          </TableRow>
        ) : (
          visibleReports.map((report) => (
            <TableRow key={report.id} className="hover:bg-[#F5F5F5]">
              <TableCell>
                <div className="font-semibold text-[#0A0A0A]">
                  {report.projectName}
                </div>
              </TableCell>
              <TableCell className="text-[#0A0A0A]">{report.mentor}</TableCell>
              <TableCell className="text-[#0A0A0A]">
                {report.studentsCount}
              </TableCell>
              <TableCell className="text-[#737373]">{report.date}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
